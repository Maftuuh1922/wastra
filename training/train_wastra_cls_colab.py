import os
import shutil
import random
import zipfile
import urllib.request
from pathlib import Path
import yaml
from google.colab import drive

drive.mount('/content/drive')

# Path folder dataset di Drive Anda (folder yang berisi data.yaml).
# Kalau data.yaml Anda ada di subfolder lain, ganti path ini,
# atau biarkan None agar dicari otomatis di dalam Dataset_Batik_YOLO.
DRIVE_DATASET_DIR = "/content/drive/MyDrive/Dataset_Batik_YOLO/dari_classifier"

NEW_DATASET = Path("/content/wastra_cls")        # output dataset klasifikasi
NEGATIVE_CLASS = "bukan_batik"

def find_data_yaml() -> Path:
    # 1. Kalau path diisi manual, pakai itu
    if DRIVE_DATASET_DIR:
        p = Path(DRIVE_DATASET_DIR) / "data.yaml"
        if p.exists():
            return p
        raise FileNotFoundError(f"data.yaml tidak ada di {DRIVE_DATASET_DIR}")

    # 2. Cari otomatis di folder Dataset_Batik_YOLO di Drive
    search_roots = [
        Path("/content/drive/MyDrive/Dataset_Batik_YOLO"),
        Path("/content/drive/MyDrive"),
    ]
    for root in search_roots:
        if not root.exists():
            continue
        candidates = [
            p for p in root.rglob("data.yaml")
            if "training_runs" not in str(p)
        ]
        if candidates:
            for c in candidates:
                print("  kandidat:", c)
            print("Dipakai:", candidates[0])
            return candidates[0]

    raise FileNotFoundError(
        "\n\nTidak menemukan data.yaml di Google Drive.\n"
        "Isi variabel DRIVE_DATASET_DIR di atas dengan path folder\n"
        "dataset Anda (folder yang berisi data.yaml), lalu run ulang.\n"
        "Cek path-nya dengan: !find /content/drive/MyDrive -name data.yaml\n"
    )

data_yaml_path = find_data_yaml()
OLD_DATASET = data_yaml_path.parent
print("Dataset lama:", OLD_DATASET)

with open(data_yaml_path) as f:
    data_cfg = yaml.safe_load(f)

class_names = data_cfg["names"]
if isinstance(class_names, dict):
    class_names = [class_names[i] for i in sorted(class_names)]
print(f"{len(class_names)} kelas ditemukan:", class_names)

SPLIT_MAP = {"train": "train", "valid": "val", "val": "val", "test": "val"}

# PENTING: Buat folder untuk semua kelas terlebih dahulu (bahkan yang kosong)
# Ini untuk mencegah error YOLOv8 jika ada kelas yang tidak punya gambar di set validasi
for cls_name in class_names:
    (NEW_DATASET / "train" / cls_name).mkdir(parents=True, exist_ok=True)
    (NEW_DATASET / "val" / cls_name).mkdir(parents=True, exist_ok=True)
(NEW_DATASET / "train" / NEGATIVE_CLASS).mkdir(parents=True, exist_ok=True)
(NEW_DATASET / "val" / NEGATIVE_CLASS).mkdir(parents=True, exist_ok=True)

# Konversi dataset
print("Memulai konversi dataset...")
for old_split, new_split in SPLIT_MAP.items():
    img_dir = OLD_DATASET / old_split / "images"
    lbl_dir = OLD_DATASET / old_split / "labels"
    if not img_dir.exists():
        continue
    for img_path in img_dir.iterdir():
        lbl_path = lbl_dir / (img_path.stem + ".txt")
        if not lbl_path.exists():
            continue
        lines = lbl_path.read_text().strip().splitlines()
        if not lines:
            continue
        cls_id = int(lines[0].split()[0])
        cls_name = class_names[cls_id]
        dest = NEW_DATASET / new_split / cls_name
        dest.mkdir(parents=True, exist_ok=True)
        shutil.copy2(img_path, dest / img_path.name)

print("Konversi selesai.")

coco_zip = Path("/content/coco128.zip")
if not coco_zip.exists():
    urllib.request.urlretrieve(
        "https://ultralytics.com/assets/coco128.zip", coco_zip
    )
with zipfile.ZipFile(coco_zip) as z:
    z.extractall("/content/")

neg_images = sorted(Path("/content/coco128/images/train2017").glob("*.jpg"))
random.seed(42)
random.shuffle(neg_images)

# ~10-15% dari total dataset adalah proporsi negatif yang sehat
n_train_neg = 110
n_val_neg = 18

for split, imgs in [("train", neg_images[:n_train_neg]),
                    ("val", neg_images[n_train_neg:n_train_neg + n_val_neg])]:
    dest = NEW_DATASET / split / NEGATIVE_CLASS
    dest.mkdir(parents=True, exist_ok=True)
    for p in imgs:
        shutil.copy2(p, dest / p.name)

# (Opsional tapi SANGAT direkomendasikan) upload foto negatif Anda
# sendiri (dinding, meja, baju polos, layar laptop, dll) ke folder:
#   /content/negatif_saya/
my_neg = Path("/content/negatif_saya")
if my_neg.exists():
    files = sorted(my_neg.iterdir())
    cut = int(len(files) * 0.85)
    for split, batch in [("train", files[:cut]), ("val", files[cut:])]:
        dest = NEW_DATASET / split / NEGATIVE_CLASS
        dest.mkdir(parents=True, exist_ok=True)
        for p in batch:
            shutil.copy2(p, dest / p.name)

for split in ["train", "val"]:
    total = sum(1 for _ in (NEW_DATASET / split).rglob("*.jpg"))
    print(f"{split}: {total} gambar, "
          f"{len(list((NEW_DATASET / split).iterdir()))} kelas")

from ultralytics import YOLO

model = YOLO("yolov8s-cls.pt")   # small = akurasi bagus & tetap cepat
results = model.train(
    data=str(NEW_DATASET),
    epochs=60,
    imgsz=224,
    batch=64,
    patience=15,
    # Augmentasi agar tahan terhadap foto HP (blur, gelap, miring):
    degrees=15,
    translate=0.1,
    scale=0.3,
    fliplr=0.5,
    erasing=0.2,
    auto_augment="randaugment",
    # Simpan hasil ke Drive agar tidak hilang saat sesi Colab berakhir
    project="/content/drive/MyDrive/Dataset_Batik_YOLO/training_runs",
    name="cls_v2_dengan_negatif",
    exist_ok=True,
)

metrics = model.val()
print("Top-1 accuracy:", metrics.top1)

best = "/content/drive/MyDrive/Dataset_Batik_YOLO/training_runs/cls_v2_dengan_negatif/weights/best.pt"
print("Model terbaik:", best)

# Setelah puas dengan hasilnya, upload ke HF Space Anda:
# from huggingface_hub import HfApi, login
# login()  # masukkan token HF Anda
# HfApi().upload_file(
#     path_or_fileobj=best,
#     path_in_repo="yolov8s_batik_cls_v2.pt",
#     repo_id="maftuh-main/wastra-yolov8-detector",
# )
