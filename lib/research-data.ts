import { Database, FileText, FlaskConical, Network, Microscope } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export type Category = 'sejarah' | 'geometri' | 'teknologi' | 'ai-model'

export interface ResearchMaterial {
  slug: string
  category: Category
  iconName: 'Database' | 'FileText' | 'FlaskConical' | 'Network' | 'Microscope'
  title: string
  description: string
  content: string
}

export const researchDataset: ResearchMaterial[] = [
  // === AI & MODEL ===
  {
    slug: 'wastra-2k-dataset',
    category: 'ai-model',
    iconName: 'Database',
    title: 'Wastra-2K: Dataset Citra Batik Beranotasi',
    description: 'Dokumentasi mengenai pengumpulan dan pemrosesan lebih dari 2.000 citra batik untuk pelatihan model klasifikasi.',
    content: `## Dataset Wastra-2K
Dalam pengembangan sistem kecerdasan buatan untuk deteksi motif batik, ketersediaan data yang bersih dan beranotasi adalah kunci utama. Kami telah mengumpulkan dan memvalidasi **lebih dari 2.000 gambar batik** dari berbagai sumber digital maupun fotografi langsung.

### Metodologi Pengumpulan Data
Dataset ini terdiri dari berbagai kelas motif dominan (seperti Parang, Kawung, Megamendung, Truntum, dan Lasem). Setiap citra telah melalui proses:
1. **Pembersihan Data (Data Cleaning):** Menghapus citra dengan resolusi sangat rendah atau blur yang signifikan.
2. **Anotasi Manual:** Ahli wastra dilibatkan untuk memastikan label (*ground truth*) dari setiap gambar 100% akurat.
3. **Augmentasi:** Mengingat jumlah 2.000 citra perlu diperkaya agar model tidak *overfitting*, kami menggunakan teknik rotasi, *flipping*, dan penyesuaian kontras (brightness/contrast adjustment).

Dataset ini menjadi fondasi utama dalam melatih model arsitektur CNN kami dan terus dikembangkan seiring waktu.`,
  },
  {
    slug: 'arsitektur-deteksi-multi-motif',
    category: 'ai-model',
    iconName: 'Network',
    title: 'Arsitektur CNN untuk Deteksi Multi-Motif',
    description: 'Analisis teknis penggunaan Convolutional Neural Network (CNN) untuk mengenali lebih dari satu motif dalam satu kain.',
    content: `## Pendekatan Deteksi Multi-Label
Banyak kain batik modern yang menggabungkan beberapa pakem motif (misalnya Parang dan Truntum) dalam satu lembar kain. Menggunakan klasifikasi *single-label* konvensional tidak akan cukup.

### Implementasi Arsitektur
Sistem Wastra.ai menggunakan modifikasi arsitektur berbasis CNN (seperti ResNet atau EfficientNet) dengan pendekatan klasifikasi *multi-label*:
- **Fungsi Loss (Loss Function):** Kami menggunakan *Binary Cross-Entropy (BCE) Loss* pada setiap node *output* terakhir, berbeda dengan *Softmax* yang memaksa probabilitas berjumlah 1.
- **Thresholding:** Setiap kelas motif akan menghasilkan skor probabilitas independen dari 0 hingga 1. Probabilitas di atas *threshold* 0.6 dianggap sebagai kehadiran motif tersebut dalam citra.

### Tantangan Riset
Tantangan terbesar yang masih diteliti adalah membedakan motif latar (isen-isen) dengan motif utama (klowongan) dalam citra yang memiliki kompleksitas geometris sangat tinggi.`,
  },

  // === SEJARAH ===
  {
    slug: 'evolusi-motif-keraton',
    category: 'sejarah',
    iconName: 'FileText',
    title: 'Evolusi Motif Pakem Keraton',
    description: 'Kajian historis mengenai perubahan fungsi dan larangan (awisan dalem) pada motif-motif tertentu.',
    content: `## Batik Awisan Dalem
Pada masa lampau, Kesultanan Yogyakarta dan Kasunanan Surakarta memiliki aturan ketat mengenai pemakaian batik. Motif-motif tertentu ditetapkan sebagai **Batik Larangan** (Awisan Dalem) yang hanya boleh dikenakan oleh raja dan keturunannya.

### Motif Parang Rusak
Diciptakan oleh Panembahan Senopati, pendiri Kerajaan Mataram Islam, motif ini terinspirasi dari ombak Laut Selatan yang menghantam karang tanpa henti. Memiliki makna filosofis tentang semangat pantang menyerah. Di masa lalu, ukuran Parang menentukan kasta pemakainya.

### Dekonstruksi Modern
Seiring berakhirnya masa feodalistik dan masuknya era kemerdekaan, aturan ketat ini mulai melonggar. Kini, motif Parang dan Kawung menjadi warisan komunal yang dapat dinikmati dan dipakai oleh seluruh lapisan masyarakat sebagai simbol kebanggaan identitas bangsa.`,
  },

  // === GEOMETRI ===
  {
    slug: 'fraktal-dan-matematika-batik',
    category: 'geometri',
    iconName: 'Microscope',
    title: 'Fraktal dan Matematika dalam Motif Batik',
    description: 'Analisis geometri fraktal pada batik nitik dan truntum serta algoritma pembuatannya.',
    content: `## Keteraturan Kosmos dalam Titik
Motif batik klasik, khususnya kelompok *Ceplokan* dan *Nitik*, bukanlah gambar acak. Mereka adalah representasi visual dari konsep geometri dan fraktal jauh sebelum teori fraktal modern ditemukan oleh Benoit Mandelbrot.

### Motif Nitik dan Pikselasi
Motif Nitik (Yogyakarta) adalah motif tertua yang sangat kaku, terdiri dari ribuan titik persegi yang disusun menyerupai tenunan patola dari India.
Jika dianalisis secara komputasional, motif Nitik menggunakan pendekatan **Cellular Automata**. Pola dasar berukuran kecil diulang (tesselation) dengan simetri rotasi dan refleksi, menciptakan bidang ilusi optik yang rumit. 

Riset geometri ini sangat penting bagi pengembangan AI generatif, karena algoritma dapat diajarkan pakem matematis ini untuk menciptakan motif baru yang secara struktural valid.`,
  },

  // === TEKNOLOGI & PEWARNAAN ===
  {
    slug: 'kimia-pewarna-alam',
    category: 'teknologi',
    iconName: 'FlaskConical',
    title: 'Sains Ekstraksi Pewarna Alam',
    description: 'Kajian biomaterial tentang pigmen warna dari soga, tarum, dan fiksator alami (tunjung, tawas).',
    content: `## Menghasilkan Warna Tanpa Polusi
Pewarna alam (*natural dyes*) kembali menjadi tren utama dalam riset fesyen berkelanjutan (*sustainable fashion*). Batik tradisional menggunakan 100% material organik.

### Reaksi Fiksasi (Penguncian Warna)
Pigmen alam tidak akan menempel kuat pada serat katun (selulosa) tanpa bantuan senyawa mordan. 
- **Zat Warna:** Ekstrak kayu mahoni (kemerahan), daun nila/tarum (biru indigo), kayu tegeran (kuning).
- **Mordan/Fiksator:** Tawas (aluminium sulfat) digunakan untuk menghasilkan warna terang, Tunjung (besi sulfat) untuk menggelapkan warna (menuju hitam/cokelat tua), dan Kapur Tohor untuk menonjolkan warna asli pigmen.

Riset saat ini difokuskan pada peningkatan *color-fastness* (ketahanan luntur) pewarna alam agar mampu menyamai daya tahan pewarna sintetis seperti Naptol.`,
  }
]
