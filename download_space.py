from huggingface_hub import hf_hub_download
import sys
import shutil

try:
    print("Downloading app.py from Hugging Face...")
    file_path = hf_hub_download(
        repo_id="maftuh-main/wastra-lora-api",
        repo_type="space",
        filename="app.py",
        token="YOUR_HF_TOKEN_HERE"
    )
    shutil.copy(file_path, "c:/Users/Administrator/wastra/space_app.py")
    
    print("Downloading requirements.txt...")
    req_path = hf_hub_download(
        repo_id="maftuh-main/wastra-lora-api",
        repo_type="space",
        filename="requirements.txt",
        token="YOUR_HF_TOKEN_HERE"
    )
    shutil.copy(req_path, "c:/Users/Administrator/wastra/space_reqs.txt")
    
    print("Successfully downloaded files!")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
