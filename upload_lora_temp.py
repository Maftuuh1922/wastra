from huggingface_hub import HfApi
import sys

try:
    api = HfApi()
    print("Uploading new LoRA weights to Hugging Face...")
    api.upload_file(
        path_or_fileobj="c:/Users/Administrator/wastra/pytorch_lora_weights.safetensors",
        path_in_repo="pytorch_lora_weights.safetensors",
        repo_id="maftuh-main/wastra-lora-api",
        repo_type="space"
    )
    print("✅ LoRA weights successfully replaced on Hugging Face!")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
