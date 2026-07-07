import { BookMarked, GraduationCap, Palette, Sparkles, LucideIcon } from 'lucide-react'

export type Level = 'sd' | 'smp-sma' | 'umum'

export interface LearningMaterial {
  slug: string
  level: Level
  iconName: 'Palette' | 'Sparkles' | 'BookMarked' | 'GraduationCap'
  title: string
  description: string
  content: string
}

export const learningDataset: LearningMaterial[] = [
  // === SD ===
  {
    slug: 'cerita-bergambar-si-kawung',
    level: 'sd',
    iconName: 'Palette',
    title: 'Cerita Bergambar: Si Kawung',
    description: 'Ikuti petualangan Si Kawung mengenal bentuk lingkaran ajaib di kain batik lewat cerita dan gambar seru.',
    content: `## Halo, Adik-adik!
Pernahkah kalian melihat kain dengan gambar lingkaran yang tersusun rapi? Itu adalah motif Kawung!
Motif Kawung ini sudah ada sejak zaman kerajaan dulu lho. Katanya, bentuk lingkaran ini terinspirasi dari buah aren atau kolang-kaling. 

### Kenapa bentuknya bulat?
Bentuk bulat pada motif Kawung melambangkan hati yang bersih dan niat yang baik. Jadi, zaman dulu orang yang memakai batik Kawung diharapkan menjadi orang yang jujur dan baik hati.
Yuk kita warnai dan gambar motif Kawung di rumah!`,
  },
  {
    slug: 'tebak-motif-yuk',
    level: 'sd',
    iconName: 'Sparkles',
    title: 'Tebak Motif Yuk!',
    description: 'Permainan mencocokkan gambar motif dengan namanya — belajar sambil bermain.',
    content: `## Mari Bermain Tebak Motif!
Coba lihat sekelilingmu, adakah kain batik yang dipakai ayah, ibu, atau kakak? 

### Cara Bermain:
1. **Motif Awan:** Kalau bentuknya seperti awan bergelombang bertumpuk-tumpuk, itu adalah **Mega Mendung**.
2. **Motif Garis Miring:** Kalau bentuknya miring-miring seperti ombak laut atau pedang, itu namanya **Parang**.
3. **Motif Bunga Kecil:** Kalau bentuknya seperti bintang atau bunga kecil-kecil yang banyak, itu namanya **Truntum**.

Berapa banyak motif yang berhasil kamu temukan hari ini?`,
  },
  {
    slug: 'mewarnai-motif-nusantara',
    level: 'sd',
    iconName: 'BookMarked',
    title: 'Mewarnai Motif Nusantara',
    description: 'Lembar mewarnai motif parang dan mega mendung yang bisa dicetak di rumah atau di kelas.',
    content: `## Waktunya Berkreasi!
Menyiapkan pensil warna atau krayonmu! Mewarnai batik itu sangat seru karena kita bisa menggunakan warna apa saja.

### Tips Mewarnai:
- **Mega Mendung:** Biasanya menggunakan gradasi warna. Misalnya dari biru tua, biru muda, sampai putih. Tapi kamu bebas mewarnainya dengan warna pelangi!
- **Parang:** Gunakan warna cokelat dan putih untuk warna aslinya, atau coba padukan warna merah dan kuning agar terlihat terang!

Jangan lupa minta tolong ayah atau ibu untuk mencetak (print) gambar batiknya ya!`,
  },
  {
    slug: 'mengenal-warna-batik',
    level: 'sd',
    iconName: 'Palette',
    title: 'Mengenal Warna Alam Batik',
    description: 'Dari mana asalnya warna cokelat pada batik zaman dulu? Ayo kita pelajari!',
    content: `## Pewarna dari Alam
Tahukah kamu, zaman dulu sebelum ada cat atau spidol, orang membuat warna batik dari daun, akar, dan kulit pohon!

### Rahasia Warna:
- **Soga (Cokelat):** Didapat dari campuran kayu pohon Soga. Ini warna batik yang paling sering kita lihat!
- **Tarum (Biru):** Didapat dari daun tanaman Nila atau Tarum. Warnanya sangat cantik seperti langit biru.
- **Tegeran (Kuning):** Didapat dari kayu pohon Tegeran.

Alam sangat hebat ya bisa memberikan warna-warni yang indah untuk baju kita!`,
  },
  {
    slug: 'batik-itu-apa-sih',
    level: 'sd',
    iconName: 'Sparkles',
    title: 'Batik Itu Apa Sih?',
    description: 'Pengenalan sederhana tentang apa itu batik dan kenapa kita merayakannya setiap 2 Oktober.',
    content: `## Apa itu Batik?
Batik bukanlah sekadar baju atau kain, melainkan **cara menggambarnya**. Batik dibuat menggunakan alat bernama **Canting** dan cairan lilin panas yang disebut **Malam**.

### Hari Batik Nasional
Setiap tanggal 2 Oktober, seluruh masyarakat Indonesia memakai baju batik. Kenapa? Karena pada hari itu, dunia (melalui UNESCO) meresmikan bahwa Batik adalah warisan budaya asli milik Indonesia! 
Banggalah memakai batik, karena itu adalah lambang negara kita!`,
  },

  // === SMP-SMA ===
  {
    slug: 'filosofi-di-balik-motif',
    level: 'smp-sma',
    iconName: 'BookMarked',
    title: 'Filosofi di Balik Motif',
    description: 'Kupas makna simbolik kawung, parang, dan truntum serta perannya dalam upacara adat Jawa.',
    content: `## Pesan Tersembunyi di Selembar Kain
Bagi masyarakat Jawa, batik bukan sekadar hiasan. Setiap tarikan garis memiliki makna filosofis yang mendalam dan harapan bagi pemakainya.

### Tiga Motif Utama dan Maknanya:
1. **Parang:** Memiliki pola miring ibarat ombak laut yang tak pernah berhenti bergerak. Filosofinya adalah pantang menyerah dan terus memperbaiki diri. Pada zaman dahulu, motif ini hanya boleh dipakai oleh raja dan ksatria.
2. **Kawung:** Berbentuk empat oval yang mengelilingi satu titik pusat. Melambangkan keadilan, keperkasaan, dan hati yang murni (hati nurani sebagai pusat).
3. **Truntum:** Bermakna "tumbuh kembali" (tumaruntum). Sering dipakai oleh orang tua pengantin dengan harapan cinta kasih sang anak akan terus tumbuh tanpa batas bagaikan bintang di langit malam.`,
  },
  {
    slug: 'sejarah-batik-nusantara',
    level: 'smp-sma',
    iconName: 'GraduationCap',
    title: 'Sejarah Batik Nusantara',
    description: 'Perjalanan batik dari keraton hingga diakui UNESCO sebagai Warisan Budaya Takbenda.',
    content: `## Dari Keraton Menuju Panggung Dunia
Sejarah membatik di Indonesia telah dimulai sejak zaman kerajaan Majapahit dan populer pada masa kerajaan Mataram. Awalnya, tradisi membatik hanya dilakukan di dalam keraton untuk pakaian raja dan keluarga kerajaan.

### Perkembangan ke Luar Tembok Keraton
Lambat laun, kesenian ini dibawa oleh para pengikut raja ke luar keraton. Masyarakat mulai meniru dan menjadikan membatik sebagai pekerjaan kaum wanita untuk mengisi waktu luang.
- **Batik Pesisir:** Masyarakat di pesisir utara Jawa (seperti Pekalongan dan Cirebon) menyerap pengaruh asing (Tiongkok, Belanda, Arab) sehingga warna batiknya lebih cerah dan motifnya beragam (bunga, burung).
- **Pengakuan UNESCO:** Pada 2 Oktober 2009, UNESCO menetapkan batik sebagai *Masterpieces of the Oral and Intangible Heritage of Humanity*.`,
  },
  {
    slug: 'proyek-kelas-peta-motif-daerah',
    level: 'smp-sma',
    iconName: 'Sparkles',
    title: 'Proyek Kelas: Peta Motif Daerah',
    description: 'Panduan proyek kelompok memetakan motif khas daerah masing-masing beserta ceritanya.',
    content: `## Ayo Petakan Warisan Budaya Kita!
Tahukah kalian bahwa hampir seluruh wilayah di Indonesia kini memiliki motif batik khas daerahnya sendiri? Papua punya motif Tifa Honai, Bali punya motif Singa Barong, dan Kalimantan punya motif Batang Garing!

### Tugas Proyek:
1. Bentuklah kelompok beranggotakan 4-5 orang.
2. Pilih satu pulau di Indonesia.
3. Carilah minimal 5 motif batik khas dari pulau tersebut.
4. Buatlah infografis atau poster digital yang memuat gambar motif, nama daerah asal, dan makna/filosofinya.
5. Presentasikan di depan kelas! Ini akan memperkaya wawasan nusantara kita.`,
  },
  {
    slug: 'perbedaan-batik-klasik-dan-modern',
    level: 'smp-sma',
    iconName: 'Palette',
    title: 'Batik Klasik vs Modern',
    description: 'Mengenali perbedaan pakem batik keraton yang kaku dan batik pesisir yang dinamis.',
    content: `## Pakem Keraton dan Kebebasan Pesisir
Dalam dunia batik, secara garis besar terdapat pembagian antara **Batik Klasik (Keraton)** dan **Batik Modern (Pesisir)**.

- **Batik Klasik (Keraton Surakarta & Yogyakarta):** Terikat pada aturan (pakem) yang sangat ketat. Warnanya didominasi warna gelap dan alam (soga/cokelat, hitam, putih, biru tua). Maknanya sangat spiritual.
- **Batik Pesisir (Pekalongan, Cirebon, Madura, Lasem):** Sangat bebas dan tidak terikat aturan keraton. Menggunakan warna-warna terang (merah, kuning, hijau) karena pengaruh pedagang asing. Motifnya pun sangat realistis seperti bunga sakura, naga, atau kapal laut.`,
  },
  {
    slug: 'kimia-dalam-pembuatan-batik',
    level: 'smp-sma',
    iconName: 'GraduationCap',
    title: 'Proses Kimia Pembuatan Batik',
    description: 'Menyelami sains di balik pewarnaan dan peluruhan lilin (malam) pada kain batik.',
    content: `## Sains di Balik Selembar Kain
Proses membatik sebenarnya adalah proses reaksi kimia yang luar biasa. Konsep utamanya adalah **perintang warna**. Lilin (malam) menolak air (hidrofobik).

### Proses Pewarnaan Sintetis:
Saat ini banyak pengrajin menggunakan pewarna sintetis seperti *Naptol* atau *Indigosol*.
1. Pewarna Indigosol membutuhkan bantuan sinar matahari (fotooksidasi) atau larutan asam (Nitrit dan HCl) untuk memunculkan warnanya.
2. Proses *Nglorot*: Untuk menghilangkan lilin malam yang menempel, kain direbus dengan air mendidih. Titik leleh malam batik berada di kisaran 60-70 derajat Celcius, sehingga saat direbus malam akan mencair dan lepas dari kain, menyisakan motif yang indah.`,
  },

  // === Umum & Dewasa ===
  {
    slug: 'kajian-taksonomi-motif-batik',
    level: 'umum',
    iconName: 'GraduationCap',
    title: 'Kajian: Taksonomi Motif Batik',
    description: 'Telaah mendalam penggolongan motif geometris dan non-geometris beserta sebaran regionalnya.',
    content: `## Menggolongkan Ragam Hias Wastra
Dalam kajian seni kriya tekstil, motif batik diklasifikasikan ke dalam sistem taksonomi ragam hias untuk memudahkan analisis historis dan budaya.

### Klasifikasi Dasar:
1. **Motif Geometris (Ceplokan, Garis Miring):** Pola berulang yang dihitung secara matematis. Contohnya: Nitik (berbasis titik kuadrat), Parang (garis diagonal 45 derajat), dan Banji (swastika). Ini banyak dipengaruhi oleh filosofi Hindu-Buddha yang mengagungkan keteraturan kosmos.
2. **Motif Non-Geometris (Semen, Lung-lungan):** Pola yang mengalir bebas dan biasanya mengambil elemen flora dan fauna. Contohnya motif Semen yang mengandung unsur udara (burung), bumi (tumbuhan), dan air (ular/naga) yang merepresentasikan triloka atau tiga dunia dalam kosmologi Jawa kuno.`,
  },
  {
    slug: 'batik-tulis-cap-dan-printing',
    level: 'umum',
    iconName: 'BookMarked',
    title: 'Batik Tulis, Cap, dan Printing',
    description: 'Memahami perbedaan teknik produksi, nilai budayanya, dan cara mengenali masing-masing.',
    content: `## Menghargai Otentisitas Batik Asli
Di pasaran, istilah 'baju batik' sering rancu dengan 'kain bermotif batik'. Bedanya terletak pada proses pembuatannya.

1. **Batik Tulis:** Dibuat 100% manual dengan tangan menggunakan canting. Membutuhkan waktu berbulan-bulan. Ciri khasnya: goresannya tidak ada yang identik sama persis, aroma malam khas, dan tembus sempurna ke bagian belakang kain.
2. **Batik Cap:** Menggunakan stempel tembaga (cap) panas. Lebih cepat dari batik tulis namun masih dikategorikan sebagai batik asli karena menggunakan teknik rintang warna (malam). Ciri khasnya: pola berulang sangat rapi, menembus ke belakang.
3. **Batik Printing (Tekstil Bermotif Batik):** Ini **BUKAN** batik. Dicetak menggunakan mesin pabrik. Ciri utamanya: bagian belakang kain putih memudar (tidak tembus warna) dan polanya sangat sempurna tanpa meleset sedikitpun. Mengetahui hal ini penting untuk menghargai harga karya pengrajin lokal.`,
  },
  {
    slug: 'etika-ai-dan-warisan-budaya',
    level: 'umum',
    iconName: 'Sparkles',
    title: 'Etika AI dan Warisan Budaya',
    description: 'Diskusi tentang peran teknologi generatif dalam pelestarian — peluang sekaligus batasannya.',
    content: `## AI sebagai Katalisator, Bukan Pengganti
Hadirnya teknologi AI generatif menimbulkan diskursus baru dalam pelestarian warisan budaya. Apakah AI akan mematikan pekerjaan desainer batik?

### Peluang dan Ancaman:
- **Peluang Pelestarian:** AI dapat digunakan untuk mengenali, mengkategorikan, dan menyimpan puluhan ribu motif langka yang terancam punah. AI juga dapat mempercepat proses *brainstorming* desain bagi para pengrajin.
- **Batas Etika:** Kesenian membatik sarat akan spiritualitas, *roso* (rasa), dan filosofi si pembuatnya. AI hanya mampu mereplikasi piksel dan visual, namun tidak bisa memberikan "nyawa" (jiwa) dan doa yang biasa disertakan pengrajin saat meniup canting. Oleh karena itu, *output* AI sebaiknya diposisikan sebagai draf awal atau alat bantu bantu, bukan produk akhir kebudayaan.`,
  },
  {
    slug: 'peluang-bisnis-batik-global',
    level: 'umum',
    iconName: 'Palette',
    title: 'Peluang Bisnis Wastra Global',
    description: 'Menganalisis permintaan pasar internasional terhadap produk fashion berbahan wastra Nusantara.',
    content: `## Membawa Wastra ke Panggung Dunia
Permintaan terhadap *sustainable fashion* dan *ethical clothing* di Eropa dan Amerika saat ini sedang meroket. Batik, yang menggunakan metode kriya tangan dan pewarna alam, sangat memenuhi kriteria pasar ini.

### Strategi Ekspor:
1. **Storytelling:** Konsumen barat membeli *cerita*, bukan sekadar kain. Jelaskan filosofi motif, siapa pengrajinnya, dan dampak sosial yang dihasilkan dengan membeli produk tersebut.
2. **Adaptasi Siluet:** Motif tradisional tidak harus selalu menjadi kemeja kaku. Beradaptasilah dengan siluet pakaian kontemporer seperti *outerwear*, *loungewear*, atau aksesori seperti *scarf*.
3. **Pewarna Alam:** Penggunaan pewarna sintetis sering ditolak oleh kurator mode *eco-friendly*. Kembalilah pada Indigofera, Soga, dan Jelawe untuk meningkatkan daya saing premium di luar negeri.`,
  },
  {
    slug: 'konservasi-tekstil-kuno',
    level: 'umum',
    iconName: 'BookMarked',
    title: 'Konservasi Kain Batik Kuno',
    description: 'Panduan perawatan dan preservasi tekstil warisan keluarga (heritage textiles) agar tidak rapuh.',
    content: `## Merawat Lembaran Sejarah
Kain batik kuno (berusia puluhan hingga ratusan tahun) rentan mengalami oksidasi, pelapukan, dan serangan serangga. Merawatnya membutuhkan perlakuan khusus.

### Panduan Konservasi Rumahan:
- **Jangan dilipat!** Lipatan akan melemahkan serat kain dan membuatnya patah/robek seiring waktu. Sebaiknya digulung menggunakan tabung karton yang dilapisi tisu bebas asam (acid-free tissue).
- **Hindari Kamper (Kapur Barus):** Bahan kimia kamper terlalu keras. Gunakan merica hitam, cengkeh, atau akar wangi yang dibungkus kain kecil untuk mengusir serangga.
- **Pencucian:** Jangan pernah mencuci batik kuno dengan deterjen berbahan dasar *surfactant* kuat. Gunakan lerak (buah tradisional) dengan cara dicelup halus, bukan dikucek atau diperas.
- **Penyimpanan:** Simpan di tempat yang sejuk, kering, dan jauh dari paparan sinar matahari atau lampu UV secara langsung.`,
  },
]
