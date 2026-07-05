from huggingface_hub import HfApi
import sys

try:
    token = "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"
    api = HfApi(token=token)
    
    # 1. Upload Model Weights to MODEL repo
    print("Uploading YOLO weights to maftuh-main/wastra-yolov8-detector...")
    api.upload_file(
        path_or_fileobj=r"C:\Users\Administrator\Downloads\yolov8_batik_38kelas_v1_3M_params.pt",
        path_in_repo="yolov8_batik_38kelas_v1_3M_params.pt",
        repo_id="maftuh-main/wastra-yolov8-detector",
        repo_type="model"
    )
    print("✅ Model weights uploaded!")
    
    # 2. Upload Updated app.py to SPACE repo
    print("Uploading updated app.py to maftuh-main/wastra-yolo-api...")
    api.upload_file(
        path_or_fileobj="c:/Users/Administrator/wastra/yolo_space_app.py",
        path_in_repo="app.py",
        repo_id="maftuh-main/wastra-yolo-api",
        repo_type="space"
    )
    print("✅ app.py uploaded!")
    
    # 3. Restart SPACE
    print("Restarting the YOLO Space...")
    api.restart_space(repo_id="maftuh-main/wastra-yolo-api", token=token)
    
    print("✅ All done!")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
