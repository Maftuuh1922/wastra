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
    print("Mendownload best (3).pt dari maftuh-main/wastra-yolov8-detector...")
    model_path = hf_hub_download(repo_id="maftuh-main/wastra-yolov8-detector", filename="best (3).pt")
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
        # Jalankan prediksi dengan model.predict, set threshold (misal conf=0.35)
        # Threshold ini cukup longgar agar frontend bisa filter lebih lanjut
        results = model.predict(image, conf=0.35, iou=0.45, verbose=False)
        
        detections = []
        for r in results:
            boxes = r.boxes
            if boxes is None or len(boxes) == 0:
                continue
                
            for box in boxes:
                # Ambil format xywhn (normalized 0-1, CENTER-based)
                b = box.xywhn[0].tolist()
                cx, cy, w, h = b[0], b[1], b[2], b[3]
                
                cls_id = int(box.cls[0].item())
                conf = box.conf[0].item()
                label = model.names[cls_id]
                
                # Konversi center-based ke top-left dalam format persen (0-100)
                x_pct = (cx - w / 2) * 100
                y_pct = (cy - h / 2) * 100
                w_pct = w * 100
                h_pct = h * 100
                
                detections.append({
                    "label": label,
                    "confidence": round(conf * 100, 1),
                    "x": round(x_pct, 1),
                    "y": round(y_pct, 1),
                    "w": round(w_pct, 1),
                    "h": round(h_pct, 1)
                })
                
        # Format response sesuai permintaan (tanpa field count, dan array kosong bila tidak ada)
        return jsonify({
            "success": True,
            "detections": detections
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860)
