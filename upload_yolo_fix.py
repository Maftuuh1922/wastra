from huggingface_hub import HfApi
import sys

try:
    token = "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"
    api = HfApi(token=token)
    
    print("Uploading updated app.py to maftuh-main/wastra-yolo-api...")
    api.upload_file(
        path_or_fileobj="c:/Users/Administrator/wastra/yolo_space_app.py",
        path_in_repo="app.py",
        repo_id="maftuh-main/wastra-yolo-api",
        repo_type="space"
    )
    print("app.py uploaded successfully!")
    
    print("Restarting the YOLO Space...")
    api.restart_space(repo_id="maftuh-main/wastra-yolo-api", token=token)
    
    print("All done!")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
