import time
import sys
import requests
from gradio_client import Client, handle_file

def test_api_speed():
    # URL HF Space
    space_id = "maftuh-main/batik-classifier"
    
    # Download a sample image if we don't have one
    sample_img_url = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Batik_Parang_Rusak.jpg"
    img_path = "sample_batik.jpg"
    try:
        r = requests.get(sample_img_url)
        with open(img_path, 'wb') as f:
            f.write(r.content)
        print("✅ Sample image downloaded")
    except Exception as e:
        print("❌ Failed to download sample image:", e)
        sys.exit(1)

    print(f"🚀 Connecting to {space_id} API...")
    try:
        client = Client(space_id)
        
        # Warmup (first request is usually slow because of cold start)
        print("🔥 Warming up API...")
        _ = client.predict(image=handle_file(img_path), api_name="/predict")
        
        # Speed test loop
        num_tests = 5
        print(f"⏱️ Running {num_tests} inference tests for MobileNetV3 (TFLite CPU)...")
        
        total_time = 0
        for i in range(num_tests):
            start_time = time.time()
            result = client.predict(image=handle_file(img_path), api_name="/predict")
            end_time = time.time()
            
            latency = end_time - start_time
            total_time += latency
            print(f"   Test {i+1}: {latency:.3f} detik")
            
        avg_time = total_time / num_tests
        fps = 1.0 / avg_time
        
        print("\n" + "="*50)
        print("📊 HASIL KECEPATAN (MOBILE NET V3 - HF CLOUD API)")
        print("="*50)
        print(f"Rata-rata Waktu Respons : {avg_time:.3f} detik per gambar")
        print(f"Estimasi Kecepatan API  : {fps:.1f} FPS (Frames Per Second)")
        print(f"*Catatan: Ini adalah kecepatan via internet (termasuk ping jaringan).")
        print(f" Jika dijalankan langsung di HP/Browser (On-Device), FPS akan jauh lebih tinggi (bisa 30-90 FPS).")
        print("="*50)
        
    except Exception as e:
        print("❌ Error during API test:", e)

if __name__ == "__main__":
    test_api_speed()
