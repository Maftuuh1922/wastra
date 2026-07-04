from huggingface_hub import HfApi

token = "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"
api = HfApi(token=token)
repo_id = "maftuh-main/wastra-lora-api"

requirements = """flask
flask-cors
Pillow
diffusers
transformers
accelerate
huggingface-hub
torch
peft
"""

print("Mengupdate requirements.txt untuk menambahkan peft...")
try:
    api.upload_file(
        path_or_fileobj=requirements.encode("utf-8"),
        path_in_repo="requirements.txt",
        repo_id=repo_id,
        repo_type="space"
    )
    print("Berhasil! Space akan otomatis rebuild.")
except Exception as e:
    print(f"Error: {e}")
