import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.auth import get_current_admin

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

router = APIRouter(prefix="/api/uploads", tags=["Uploads"])
MAX_IMAGE_BYTES = 8 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"}
ALLOWED_SECTIONS = {"products", "works"}
EXTENSIONS = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif", "image/gif": ".gif"}


class UploadRequest(BaseModel):
    section: str = Field(max_length=20)
    content_type: str = Field(max_length=100)
    size: int = Field(gt=0, le=MAX_IMAGE_BYTES)


@router.post("/signed-url")
def create_signed_upload(payload: UploadRequest, _admin=Depends(get_current_admin)):
    """Issue a one-time upload URL only to an authenticated admin."""
    if payload.section not in ALLOWED_SECTIONS:
        raise HTTPException(status_code=400, detail="Unknown image section")
    if payload.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Choose a JPEG, PNG, WebP, AVIF, or GIF image")

    project_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    service_key = os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    bucket = os.getenv("SUPABASE_STORAGE_BUCKET", "product-images")
    if not project_url or not service_key:
        raise HTTPException(status_code=503, detail="Image storage is not configured. Add Supabase settings to the backend environment.")
    if not (service_key.startswith("sb_secret_") or service_key.startswith("eyJ")):
        raise HTTPException(status_code=503, detail="Supabase key format is invalid. Set the full Secret key (starts with sb_secret_), not its Key ID.")

    path = f"{payload.section}/{uuid4().hex}{EXTENSIONS[payload.content_type]}"
    encoded_path = urllib.parse.quote(f"{bucket}/{path}", safe="/")
    endpoint = f"{project_url}/storage/v1/object/upload/sign/{encoded_path}"
    headers = {"apikey": service_key, "Content-Type": "application/json"}
    # New sb_secret keys are API keys, not JWTs, so Supabase requires them
    # on apikey only. Legacy service_role keys are JWTs and use both headers.
    if service_key.startswith("eyJ"):
        headers["Authorization"] = f"Bearer {service_key}"
    request = urllib.request.Request(
        endpoint,
        data=json.dumps({}).encode(),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            result = json.loads(response.read())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:300]
        raise HTTPException(status_code=502, detail=f"Supabase could not create an upload link ({exc.code}): {detail}") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise HTTPException(status_code=502, detail="Could not connect to Supabase Storage") from exc

    signed_path = result.get("url") or result.get("signedURL")
    token = result.get("token")
    if not signed_path and token:
        signed_path = f"/object/upload/sign/{encoded_path}?token={urllib.parse.quote(token)}"
    if not signed_path:
        raise HTTPException(status_code=502, detail="Supabase returned an invalid upload link")
    if signed_path.startswith("http://") or signed_path.startswith("https://"):
        upload_url = signed_path
    else:
        upload_url = f"{project_url}/storage/v1/{signed_path.lstrip('/')}"
    public_url = f"{project_url}/storage/v1/object/public/{urllib.parse.quote(bucket, safe='')}/{urllib.parse.quote(path, safe='/')}"
    return {"upload_url": upload_url, "path": path, "public_url": public_url}
