from huggingface_hub import HfApi
import os

token = "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"
api = HfApi(token=token)

repo_id = "maftuh-main/wastra-yolo-api"

dockerfile = """FROM python:3.9-slim

WORKDIR /app

# Install system dependencies (YOLO butuh libGL)
# Mengganti libgl1-mesa-glx dengan libgl1 karena versi Debian terbaru (Trixie) menggunakan libgl1
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860

CMD ["python", "app.py"]
"""

print("Mengupdate Dockerfile...")
try:
    api.upload_file(
        path_or_fileobj=dockerfile.encode("utf-8"),
        path_in_repo="Dockerfile",
        repo_id=repo_id,
        repo_type="space"
    )
    print("Dockerfile berhasil diupdate! Silakan cek kembali Hugging Face Space kamu.")
except Exception as e:
    print(f"Error uploading files: {e}")
