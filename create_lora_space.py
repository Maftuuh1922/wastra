from huggingface_hub import HfApi
import os

token = "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"
api = HfApi(token=token)

repo_id = "maftuh-main/wastra-lora-api"

print(f"Creating Space {repo_id}...")
try:
    api.create_repo(repo_id=repo_id, repo_type="space", space_sdk="docker", exist_ok=True)
    print("Space created or already exists.")
except Exception as e:
    print(f"Failed to create space: {e}")

requirements = """flask
flask-cors
Pillow
diffusers
transformers
accelerate
huggingface-hub
torch
"""

dockerfile = """FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860

CMD ["python", "app.py"]
"""

app_py = """import os
import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from diffusers import AutoPipelineForText2Image
import torch

app = Flask(__name__)
CORS(app)

print("Memulai Wastra Studio (SD + LoRA) API Server...")

try:
    print("Loading Base Model (runwayml/stable-diffusion-v1-5)...")
    # For CPU spaces, we use float32
    pipeline = AutoPipelineForText2Image.from_pretrained(
        "runwayml/stable-diffusion-v1-5", 
        torch_dtype=torch.float32, 
        use_safetensors=True
    )
    
    print("Loading LoRA (maftuh-main/batik-generator-lora)...")
    pipeline.load_lora_weights("maftuh-main/batik-generator-lora")
    print("Model and LoRA loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    pipeline = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "Online",
        "model": "SD+LoRA Wastra Studio API"
    })

@app.route('/generate', methods=['POST'])
def generate():
    if pipeline is None:
        return jsonify({"error": "Model gagal dimuat"}), 500

    data = request.json
    if not data:
        return jsonify({"error": "Format harus JSON"}), 400
        
    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({"error": "Tidak ada prompt yang diberikan"}), 400

    try:
        print(f"Generating image for prompt: {prompt}")
        # Use low inference steps for CPU generation speed
        image = pipeline(prompt, num_inference_steps=10).images[0]
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return send_file(img_byte_arr, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860)
"""

print("Uploading files...")
try:
    api.upload_file(
        path_or_fileobj=requirements.encode("utf-8"),
        path_in_repo="requirements.txt",
        repo_id=repo_id,
        repo_type="space"
    )
    api.upload_file(
        path_or_fileobj=dockerfile.encode("utf-8"),
        path_in_repo="Dockerfile",
        repo_id=repo_id,
        repo_type="space"
    )
    api.upload_file(
        path_or_fileobj=app_py.encode("utf-8"),
        path_in_repo="app.py",
        repo_id=repo_id,
        repo_type="space"
    )
    print("Files uploaded successfully!")
except Exception as e:
    print(f"Error uploading files: {e}")
