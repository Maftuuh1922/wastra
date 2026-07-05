from huggingface_hub import login, HfApi
import sys

try:
    print("Logging into Hugging Face...")
    login(token="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")
    api = HfApi()
    
    print("Uploading new LoRA weights (pytorch_lora_weights.safetensors) to maftuh-main/wastra-lora-api...")
    api.upload_file(
        path_or_fileobj="c:/Users/Administrator/wastra/pytorch_lora_weights.safetensors",
        path_in_repo="pytorch_lora_weights.safetensors",
        repo_id="maftuh-main/wastra-lora-api",
        repo_type="space"
    )
    
    # Also restart the space so it loads the new weights immediately!
    print("Restarting the Space to apply changes...")
    api.restart_space(repo_id="maftuh-main/wastra-lora-api")
    
    print("✅ LoRA weights successfully replaced and Space restarted!")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
