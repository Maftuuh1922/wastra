import gradio as gr
from ultralytics import YOLO
from huggingface_hub import hf_hub_download
import spaces

print("Mendownload best (3).pt dari maftuh-main/wastra-yolov8-detector...")
try:
    model_path = hf_hub_download(repo_id="maftuh-main/wastra-yolov8-detector", filename="best (3).pt")
    model = YOLO(model_path)
    print("Model YOLO berhasil dimuat!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@spaces.GPU
def predict(image):
    if model is None:
        return {"success": False, "error": "Model gagal dimuat"}
    
    if image is None:
        return {"success": False, "error": "Tidak ada gambar"}
        
    try:
        results = model.predict(image, conf=0.35, iou=0.45, verbose=False)
        detections = []
        for r in results:
            boxes = r.boxes
            if boxes is None or len(boxes) == 0:
                continue
                
            for box in boxes:
                b = box.xywhn[0].tolist()
                cx, cy, w, h = b[0], b[1], b[2], b[3]
                cls_id = int(box.cls[0].item())
                conf = box.conf[0].item()
                label = model.names[cls_id]
                
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
                
        return {"success": True, "detections": detections}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Gradio Interface
iface = gr.Interface(
    fn=predict,
    inputs=gr.Image(type="pil", label="Upload Image"),
    outputs=gr.JSON(label="Detections"),
    title="YOLOv8 Wastra Detector API (ZeroGPU)",
    description="Gradio API for YOLOv8 Wastra Detector with ZeroGPU support."
)

if __name__ == "__main__":
    iface.launch()
