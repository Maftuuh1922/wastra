from huggingface_hub import HfApi
import sys

try:
    token = "YOUR_HF_TOKEN_HERE"
    api = HfApi(token=token)
    
    # 1. Upload Model Weights to MODEL repo
    print("Uploading YOLO weights to maftuh-main/wastra-yolov8-detector...")
    api.upload_file(
        path_or_fileobj=r"c:\Users\Administrator\wastra\components\best (3).pt",
        path_in_repo="yolov8s_batik_det_v3.pt",
        repo_id="maftuh-main/wastra-yolov8-detector",
        repo_type="model"
    )
    print("[OK] Model weights uploaded!")
    
    # 2. Upload Updated app.py to SPACE repo
    print("Uploading updated app.py to maftuh-main/wastra-yolo-api...")
    api.upload_file(
        path_or_fileobj="c:/Users/Administrator/wastra/yolo_space_app.py",
        path_in_repo="app.py",
        repo_id="maftuh-main/wastra-yolo-api",
        repo_type="space"
    )
    print("[OK] app.py uploaded!")
    
    # 3. Restart SPACE
    print("Restarting the YOLO Space...")
    api.restart_space(repo_id="maftuh-main/wastra-yolo-api", token=token)
    
    print("[OK] All done!")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
