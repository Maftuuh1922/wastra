from huggingface_hub import HfApi
import os

token = "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"
api = HfApi(token=token)

repo_id = "maftuh-main/wastra-yolo-api"

print(f"Creating Space {repo_id}...")
try:
    api.create_repo(repo_id=repo_id, repo_type="space", space_sdk="docker", exist_ok=True)
    print("Space created or already exists.")
except Exception as e:
    print(f"Failed to create space: {e}")

requirements = """flask
flask-cors
Pillow
ultralytics
huggingface-hub
"""

dockerfile = """FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860

CMD ["python", "app.py"]
"""

app_py = """import os
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from ultralytics import YOLO
from huggingface_hub import hf_hub_download

app = Flask(__name__)
CORS(app)

print("Memulai YOLOv8 API Server...")

try:
    print("Mendownload best.pt dari maftuh-main/wastra-yolov8-detector...")
    model_path = hf_hub_download(repo_id="maftuh-main/wastra-yolov8-detector", filename="best.pt")
    model = YOLO(model_path)
    print("Model YOLO berhasil dimuat!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "Online",
        "model": "YOLOv8 Wastra Detector API"
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model gagal dimuat"}), 500

    file = request.files.get('file') or request.files.get('image')
    if not file or file.filename == '':
        return jsonify({"error": "Tidak ada gambar yang diunggah"}), 400

    try:
        image = Image.open(io.BytesIO(file.read()))
        img_w, img_h = image.size
        
        results = model(image)
        
        detections = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                b = box.xyxy[0].tolist() 
                x1, y1, x2, y2 = b[0], b[1], b[2], b[3]
                
                cls_id = int(box.cls)
                conf = box.conf[0].item()
                label = model.names[cls_id]
                
                x_pct = (x1 / img_w) * 100
                y_pct = (y1 / img_h) * 100
                w_pct = ((x2 - x1) / img_w) * 100
                h_pct = ((y2 - y1) / img_h) * 100
                
                detections.append({
                    "label": label,
                    "confidence": round(conf * 100),
                    "x": x_pct,
                    "y": y_pct,
                    "w": w_pct,
                    "h": h_pct
                })
                
        return jsonify({
            "success": True,
            "detections": detections,
            "count": len(detections)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

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
