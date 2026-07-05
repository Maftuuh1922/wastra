import os
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
    # Menonaktifkan safety checker untuk mencegah gambar hitam pada CPU
    pipeline = AutoPipelineForText2Image.from_pretrained(
        "runwayml/stable-diffusion-v1-5", 
        torch_dtype=torch.float32, 
        use_safetensors=True,
        safety_checker=None,
        requires_safety_checker=False
    )
    
    # 1. Load LCM LoRA (Untuk Speed 4-Steps)
    print("Loading LCM LoRA for Hyper-Fast Generation...")
    pipeline.load_lora_weights("latent-consistency/lcm-lora-sdv1-5", adapter_name="lcm")

    # 2. Load Batik LoRA (Style Pengguna)
    print("Loading Wastra LoRA from local file...")
    pipeline.load_lora_weights("./pytorch_lora_weights.safetensors", adapter_name="batik")
    
    # Gabungkan kedua LoRA (LCM 100%, Batik 100%)
    pipeline.set_adapters(["lcm", "batik"], adapter_weights=[1.0, 1.0])
    
    # Ganti Scheduler ke LCMScheduler
    from diffusers import LCMScheduler
    pipeline.scheduler = LCMScheduler.from_config(pipeline.scheduler.config)
    
    # Optimasi memory CPU
    pipeline.to("cpu")
    
    print("Model, LCM, and LoRA loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model_error = str(e)
    pipeline = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "Online",
        "model": "SD+LoRA Wastra Studio API",
        "error": model_error if pipeline is None else None
    })

@app.route('/generate', methods=['POST'])
def generate():
    if pipeline is None:
        return jsonify({"error": f"Model gagal dimuat: {model_error}"}), 500

    data = request.json
    if not data:
        return jsonify({"error": "Format harus JSON"}), 400
        
    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({"error": "Tidak ada prompt yang diberikan"}), 400

    try:
        print(f"Generating image for prompt: {prompt}")
        # LCM memungkinkan 4 langkah (super cepat) & CFG Scale rendah
        # Turunkan resolusi ke 384x384 untuk mempercepat CPU (sekitar 3-4 menit total)
        image = pipeline(
            prompt, 
            num_inference_steps=4, 
            guidance_scale=1.5,
            width=384,
            height=384
        ).images[0]
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return send_file(img_byte_arr, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860)
