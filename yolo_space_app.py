import os
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
    print("Mendownload yolov8_batik_38kelas_v1_3M_params.pt dari maftuh-main/wastra-yolov8-detector...")
    model_path = hf_hub_download(repo_id="maftuh-main/wastra-yolov8-detector", filename="yolov8_batik_38kelas_v1_3M_params.pt")
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
