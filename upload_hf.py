from huggingface_hub import HfApi
import os
import sys

token = "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"
api = HfApi(token=token)

yolo_path = r"c:\Users\Administrator\wastra\modl ai\best.pt"
if os.path.exists(yolo_path):
    print("Mengunggah YOLOv8 best.pt...")
    try:
        api.upload_file(
            path_or_fileobj=yolo_path,
            path_in_repo="best.pt",
            repo_id="maftuh-main/wastra-yolov8-detector"
        )
        print("[SUKSES] YOLOv8 berhasil diunggah!")
    except Exception as e:
        print(f"[GAGAL] YOLOv8: {e}")
else:
    print(f"[ERROR] File tidak ditemukan: {yolo_path}")

lora_path = r"c:\Users\Administrator\wastra\modl ai\checkpoint-10000\pytorch_lora_weights.safetensors"
if os.path.exists(lora_path):
    print("Mengunggah LoRA pytorch_lora_weights.safetensors...")
    try:
        api.upload_file(
            path_or_fileobj=lora_path,
            path_in_repo="pytorch_lora_weights.safetensors",
            repo_id="maftuh-main/batik-generator-lora"
        )
        print("[SUKSES] LoRA berhasil diunggah!")
    except Exception as e:
        print(f"[GAGAL] LoRA: {e}")
else:
    print(f"[ERROR] File tidak ditemukan: {lora_path}")
