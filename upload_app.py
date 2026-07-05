from huggingface_hub import HfApi
import sys

try:
    api = HfApi(token="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")
    
    print("Uploading optimized app.py to maftuh-main/wastra-lora-api...")
    api.upload_file(
        path_or_fileobj="c:/Users/Administrator/wastra/space_app.py",
        path_in_repo="app.py",
        repo_id="maftuh-main/wastra-lora-api",
        repo_type="space"
    )
    
    print("Restarting the Space to apply LCM optimization...")
    api.restart_space(repo_id="maftuh-main/wastra-lora-api", token="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")
    
    print("✅ Successfully uploaded and restarted!")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
