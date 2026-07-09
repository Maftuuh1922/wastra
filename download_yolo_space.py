from huggingface_hub import hf_hub_download
import sys
import shutil

try:
    print("Downloading app.py from YOLO Space...")
    file_path = hf_hub_download(
        repo_id="maftuh-main/wastra-yolo-api",
        repo_type="space",
        filename="app.py",
        token="YOUR_HF_TOKEN_HERE"
    )
    shutil.copy(file_path, "c:/Users/Administrator/wastra/yolo_space_app.py")
    print("Successfully downloaded YOLO app.py!")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
