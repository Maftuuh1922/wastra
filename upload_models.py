import boto3
import os

ENDPOINT_URL = 'https://s3.hf.co'
ACCESS_KEY = 'HFAKMnZT5yr1qfbRyl6IpZha4pnW5GQ'
SECRET_KEY = '24cbfa46f8605c7462d3530dafb64f636ac36d9810a786552204f28f52e46b8b'

s3 = boto3.client(
    's3',
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name='us-east-1'
)

def upload_to_hf(local_file, repo_name, object_name):
    if not os.path.exists(local_file):
        print(f"File not found: {local_file}")
        return
        
    # In HF S3, the bucket is the namespace (maftuh-main)
    # The key includes the repo name
    bucket_name = "maftuh-main"
    key = f"{repo_name}/{object_name}"
    
    print(f"Uploading {local_file} to {bucket_name}/{key}...")
    try:
        s3.upload_file(
            Filename=local_file,
            Bucket=bucket_name,
            Key=key
        )
        print(f"[SUCCESS] Uploaded {key}!")
    except Exception as e:
        print(f"[ERROR] Failed to upload {key}: {e}")

if __name__ == '__main__':
    # Upload YOLOv8
    yolo_path = r"c:\Users\Administrator\wastra\modl ai\best.pt"
    upload_to_hf(yolo_path, "wastra-yolov8-detector", "best.pt")

    # Upload LoRA
    lora_path = r"c:\Users\Administrator\wastra\modl ai\checkpoint-10000\pytorch_lora_weights.safetensors"
    upload_to_hf(lora_path, "batik-generator-lora", "pytorch_lora_weights.safetensors")
