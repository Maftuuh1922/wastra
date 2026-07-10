export interface BatikDetail {
  name: string;
  origin: string;
  meaning: string;
  description: string;
  source: string;
  sourceUrl: string;
}

export const BATIK_INFO: Record<string, BatikDetail> = {
  'batik-aceh': {
    name: 'Batik Aceh',
    origin: 'Aceh',
    meaning: 'Tolak bala, keberanian, dan nilai-nilai spiritual Islami.',
    description: 'Batik Aceh sangat khas dengan penggunaan warna-warna cerah yang berani. Motif yang sering digunakan terinspirasi dari alam dan budaya lokal, seperti Pintu Aceh (simbol keterbukaan), Tolak Angin (simbol perlindungan), dan Rencong (simbol keberanian). Tidak menggunakan motif binatang bernyawa sesuai syariat Islam.',
    source: 'Dewan Kerajinan Nasional Daerah (Dekranasda) Aceh & Kementerian Pendidikan dan Kebudayaan RI',
    sourceUrl: 'https://warisanbudaya.kemdikbud.go.id/'
  },
  'batik-bali': {
    name: 'Batik Bali',
    origin: 'Bali',
    meaning: 'Keharmonisan antara manusia, alam, dan para dewa (Tri Hita Karana).',
    description: 'Batik Bali memadukan corak tradisional Bali dengan teknik pewarnaan modern. Motifnya sering menonjolkan ornamen pura, bunga frangipani, burung bangau, dan ragam hias simetris yang terinspirasi dari seni ukir pura tradisional Bali.',
    source: 'Yayasan Batik Indonesia (YBI)',
    sourceUrl: 'https://yayasanbatikindonesia.id/'
  },
  'batik-bali_barong': {
    name: 'Batik Bali Barong',
    origin: 'Bali',
    meaning: 'Simbol kebaikan, pelindung spiritual, dan tolak bala dalam mitologi Hindu Bali.',
    description: 'Motif ini menampilkan abstraksi wajah Barong, makhluk mitologis Bali yang menjadi raja dari roh-roh baik. Penggunaan motif ini pada kain dipercaya memberikan perlindungan magis bagi pemakainya.',
    source: 'Direktorat Jenderal Kebudayaan, Kemdikbud RI',
    sourceUrl: 'https://kebudayaan.kemdikbud.go.id/'
  },
  'batik-bali_merak': {
    name: 'Batik Bali Merak',
    origin: 'Bali',
    meaning: 'Keanggunan, keindahan eksotis, dan martabat.',
    description: 'Menampilkan burung merak yang digambar dengan sangat detail pada bagian ekornya. Motif fauna ini banyak dipengaruhi oleh seni lukis tradisional Kamasan Bali.',
    source: 'Museum Batik Indonesia',
    sourceUrl: 'https://museumbatikindonesia.kemdikbud.go.id/'
  },
  'batik-betawi': {
    name: 'Batik Betawi',
    origin: 'DKI Jakarta',
    meaning: 'Keterbukaan, kedinamisan, dan akulturasi budaya pesisir.',
    description: 'Sangat mudah dikenali dari warna-warnanya yang kontras (merah, hijau, kuning, biru terang). Motifnya sangat dekat dengan ikon Jakarta seperti Monas, Sungai Ciliwung, dan kesenian Tanjidor.',
    source: 'Lembaga Kebudayaan Betawi (LKB)',
    sourceUrl: 'https://jakarta-tourism.go.id/'
  },
  'batik-celup': {
    name: 'Batik Celup (Tie-Dye)',
    origin: 'Nusantara (Umum)',
    meaning: 'Kebebasan berekspresi dan kreativitas tanpa batas.',
    description: 'Teknik pewarnaan kain dengan cara mengikat sebagian kain sebelum dicelupkan ke pewarna (dikenal juga dengan nama Jumputan). Menghasilkan pola gradasi dan bentuk tak beraturan yang sangat organik.',
    source: 'Balai Besar Kerajinan dan Batik (BBKB) Kementerian Perindustrian',
    sourceUrl: 'https://bbkb.kemenperin.go.id/'
  },
  'batik-ikat_celup': {
    name: 'Batik Ikat Celup',
    origin: 'Nusantara',
    meaning: 'Kebebasan berekspresi dan dinamika kreativitas perajin.',
    description: 'Varian dari teknik celup ikat (jumputan atau sasirangan) yang menggunakan ikatan benang atau tali untuk menghalangi warna masuk ke serat kain, menciptakan pola-pola organis bersilangan yang indah.',
    source: 'Balai Besar Kerajinan dan Batik',
    sourceUrl: 'https://bbkb.kemenperin.go.id/'
  },
  'batik-ceplok': {
    name: 'Batik Ceplok',
    origin: 'Yogyakarta & Surakarta',
    meaning: 'Keteraturan, keseimbangan, dan kesempurnaan hidup.',
    description: 'Motif Ceplok tersusun dari bentuk-bentuk geometris seperti lingkaran, persegi, atau bintang yang berulang secara radial. Polanya didasarkan pada bentuk bunga mawar atau bintang bersudut.',
    source: 'Museum Keraton Yogyakarta',
    sourceUrl: 'https://kratonjogja.id/'
  },
  'batik-ciamis': {
    name: 'Batik Ciamis',
    origin: 'Ciamis, Jawa Barat',
    meaning: 'Kesederhanaan, ketenangan, dan keseimbangan alam.',
    description: 'Batik pesisiran bernuansa kalem (biasanya campuran hitam, putih, dan cokelat soga). Motif alam dan floranya (seperti dedaunan dan ombak) digambar tidak terlalu rumit, mencerminkan kehidupan masyarakat agraris.',
    source: 'Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat',
    sourceUrl: 'https://disparbud.jabarprov.go.id/'
  },
  'batik-corak_insang': {
    name: 'Batik Corak Insang',
    origin: 'Pontianak, Kalimantan Barat',
    meaning: 'Napas kehidupan, kelangsungan peradaban, dan penghormatan terhadap Sungai Kapuas.',
    description: 'Motif khas masyarakat Melayu Pontianak yang menggambarkan pola insang ikan secara geometris zigzag. Dulunya hanya digunakan oleh kaum bangsawan Kesultanan Kadriah di acara adat.',
    source: 'Majelis Adat Budaya Melayu (MABM) Kalimantan Barat',
    sourceUrl: 'https://warisanbudaya.kemdikbud.go.id/'
  },
  'batik-garutan': {
    name: 'Batik Garutan',
    origin: 'Garut, Jawa Barat',
    meaning: 'Keceriaan, keindahan alam, dan kesuburan tanah pegunungan.',
    description: 'Mempunyai ciri khas warna cerah seperti kuning, hijau, dan ungu. Motifnya terinspirasi dari flora dan fauna khas pegunungan Priangan, dengan pola dasar bentuk belah ketupat atau garis diagonal.',
    source: 'Asosiasi Perajin Batik Garut',
    sourceUrl: 'https://garutkab.go.id/'
  },
  'batik-gentongan': {
    name: 'Batik Gentongan',
    origin: 'Tanjung Bumi, Bangkalan, Madura',
    meaning: 'Ketangguhan, keberanian, dan proses panjang kehidupan.',
    description: 'Disebut "Gentongan" karena kain direndam dalam gentong tanah liat berhari-hari bahkan berbulan-bulan untuk mendapatkan warna alami (terutama merah mengkudu dan biru tarum) yang sangat tajam dan tidak luntur.',
    source: 'Warisan Budaya Takbenda Indonesia, Kemdikbud RI',
    sourceUrl: 'https://warisanbudaya.kemdikbud.go.id/'
  },
  'batik-jakarta_ondel_ondel': {
    name: 'Batik Ondel-Ondel',
    origin: 'DKI Jakarta',
    meaning: 'Penolak bala, perlindungan dari roh jahat, dan penjaga kampung.',
    description: 'Salah satu sub-motif Batik Betawi yang menjadikan Ondel-Ondel (boneka raksasa khas Betawi) sebagai elemen utamanya, dipadukan dengan kembang kelapa.',
    source: 'Dinas Kebudayaan Provinsi DKI Jakarta',
    sourceUrl: 'https://dinaskebudayaan.jakarta.go.id/'
  },
  'batik-jawa_barat_megamendung': {
    name: 'Batik Megamendung',
    origin: 'Cirebon, Jawa Barat',
    meaning: 'Kesabaran, keteduhan, dan rahmat pembawa kehidupan (hujan).',
    description: 'Motif awan berlapis yang sangat ikonik, merupakan bentuk akulturasi budaya Tiongkok (awan Taoisme) dengan nuansa Cirebon. Garis awannya dibuat melengkung lancip dengan gradasi 7 lapis warna.',
    source: 'Keraton Kasepuhan Cirebon & Yayasan Batik Indonesia',
    sourceUrl: 'https://yayasanbatikindonesia.id/'
  },
  'batik-jawa_timur_pring': {
    name: 'Batik Pring (Pring Sedapur)',
    origin: 'Magetan, Jawa Timur',
    meaning: 'Kerukunan, ketenteraman, kekuatan kelompok, dan manfaat yang tiada henti.',
    description: 'Menampilkan corak rimbunan pohon bambu (pring sedapur). Menggambarkan filosofi bambu yang tumbuh bergerombol (rukun) dan dari akar hingga pucuknya bermanfaat bagi manusia.',
    source: 'Dewan Kerajinan Nasional Daerah (Dekranasda) Jawa Timur',
    sourceUrl: 'https://dekranasda.jatimprov.go.id/'
  },
  'batik-kalimantan_dayak': {
    name: 'Batik Dayak',
    origin: 'Kalimantan',
    meaning: 'Hubungan spiritual antara manusia, roh leluhur (tato), dan alam semesta.',
    description: 'Didominasi oleh perpaduan warna hitam, kuning, merah, dan hijau. Motifnya mengadaptasi ukiran kayu dan tato khas Suku Dayak seperti motif tameng, naga (Jata), dan burung enggang (Tingang).',
    source: 'Majelis Adat Dayak Nasional (MADN)',
    sourceUrl: 'https://id.wikipedia.org/wiki/Batik_Dayak'
  },
  'batik-keraton': {
    name: 'Batik Keraton',
    origin: 'Yogyakarta & Surakarta',
    meaning: 'Kekuasaan, kebijaksanaan, dan kepemimpinan berlandaskan tata krama kosmis.',
    description: 'Awalnya adalah batik larangan yang hanya boleh dipakai oleh Sultan dan kerabat keraton. Memiliki pakem pembuatan yang sangat ketat dengan nuansa warna alam (soga, indigo, putih, hitam).',
    source: 'Museum Batik Keraton Kasunanan Surakarta & Keraton Yogyakarta',
    sourceUrl: 'https://kratonjogja.id/'
  },
  'batik-lampung_gajah': {
    name: 'Batik Lampung Gajah',
    origin: 'Lampung',
    meaning: 'Keagungan, kekuatan, dan ikon identitas lokal (Way Kambas).',
    description: 'Batik kontemporer khas Sumatera yang memadukan corak satwa gajah sumatera dengan motif tradisional Lampung seperti siger (mahkota) dan kapal pesisir.',
    source: 'Dinas Pariwisata dan Ekonomi Kreatif Provinsi Lampung',
    sourceUrl: 'https://pariwisata.lampungprov.go.id/'
  },
  'batik-lasem': {
    name: 'Batik Lasem',
    origin: 'Lasem, Rembang, Jawa Tengah',
    meaning: 'Akulturasi harmoni antara masyarakat Jawa dan Tionghoa (Bhinneka Tunggal Ika).',
    description: 'Sangat ikonik dengan warna "Abang Getih Pitik" (merah darah ayam). Motifnya memadukan unsur Tiongkok (burung hong, naga, koin emas) dengan ornamen Jawa pesisiran.',
    source: 'Museum Batik Lasem & Warisan Budaya Takbenda RI',
    sourceUrl: 'https://warisanbudaya.kemdikbud.go.id/'
  },
  'batik-madura_mataketeran': {
    name: 'Batik Mata Keteran',
    origin: 'Madura, Jawa Timur',
    meaning: 'Ketajaman visi, kewaspadaan, dan keindahan alam pesisir.',
    description: 'Motif klasik khas Madura yang terinspirasi dari mata burung perkutut (mata keteran). Menyimbolkan ketajaman pandangan hidup dan kewaspadaan masyarakat pesisir Madura dalam mengarungi lautan.',
    source: 'Dinas Pariwisata dan Kebudayaan Kabupaten Pamekasan',
    sourceUrl: 'https://pamekasankab.go.id/'
  },
  'batik-maluku_pala': {
    name: 'Batik Maluku Pala',
    origin: 'Maluku',
    meaning: 'Kejayaan sejarah, kekayaan bumi rempah-rempah, dan kemakmuran.',
    description: 'Motif batik yang terinspirasi dari komoditas buah pala dan cengkeh yang pernah menjadikan Kepulauan Maluku sebagai pusat perdagangan rempah dunia pada masa lampau.',
    source: 'Dekranasda Provinsi Maluku',
    sourceUrl: 'https://malukuprov.go.id/'
  },
  'batik-ntb_lumbung': {
    name: 'Batik NTB Lumbung',
    origin: 'Lombok, Nusa Tenggara Barat',
    meaning: 'Ketahanan pangan, kemakmuran, dan rasa syukur atas hasil bumi.',
    description: 'Menampilkan desain bangunan arsitektur Lumbung Padi khas suku Sasak yang dipadukan dengan sulur-sulur tanaman dan warna-warna bumi (earth tones).',
    source: 'Museum Negeri Nusa Tenggara Barat',
    sourceUrl: 'https://ntbprov.go.id/'
  },
  'batik-papua_asmat': {
    name: 'Batik Papua Asmat',
    origin: 'Papua',
    meaning: 'Penghormatan terhadap roh nenek moyang dan nilai-nilai magis.',
    description: 'Motif ini mentransfer seni ukir tiga dimensi Suku Asmat ke atas kain. Banyak menggunakan garis-garis asimetris kuat dengan dominasi warna merah, hitam, kuning, dan putih.',
    source: 'Lembaga Masyarakat Adat Asmat',
    sourceUrl: 'https://id.wikipedia.org/wiki/Suku_Asmat'
  },
  'batik-papua_cendrawasih': {
    name: 'Batik Cendrawasih',
    origin: 'Papua',
    meaning: 'Keindahan alam surgawi, kebanggaan, dan keanggunan eksotis.',
    description: 'Berpusat pada ilustrasi Burung Cendrawasih (Bird of Paradise) dengan ekor yang menjuntai indah. Warna yang digunakan biasanya sangat kontras, memadukan hijau hutan dan kuning keemasan.',
    source: 'Dinas Pariwisata Provinsi Papua',
    sourceUrl: 'https://papua.go.id/'
  },
  'batik-papua_tifa': {
    name: 'Batik Papua Tifa',
    origin: 'Papua',
    meaning: 'Kebersamaan, perayaan sukacita, dan seruan persatuan suku.',
    description: 'Motifnya menampilkan Tifa (alat musik pukul tradisional Papua). Biasanya dipadukan dengan simbol-simbol geometris atau flora lokal, melambangkan harmoni dalam tarian adat.',
    source: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
    sourceUrl: 'https://kebudayaan.kemdikbud.go.id/'
  },
  'batik-pekalongan': {
    name: 'Batik Pekalongan',
    origin: 'Pekalongan, Jawa Tengah',
    meaning: 'Kebebasan berekspresi, adaptabilitas budaya, dan keindahan pesisir.',
    description: 'Batik Pekalongan adalah batik pesisir paling masif. Mengalami pengaruh kuat dari kebudayaan Belanda (Batik Kumpeni), Arab, dan Tiongkok. Terkenal dengan motif buketan bunga (buket) dan warna cerah pastel.',
    source: 'Museum Batik Pekalongan (Diakui UNESCO sebagai Kota Kreatif Kriya)',
    sourceUrl: 'https://museumbatikpekalongan.info/'
  },
  'batik-priangan': {
    name: 'Batik Priangan',
    origin: 'Tasikmalaya, Jawa Barat',
    meaning: 'Kelembutan budi, kerendahan hati, dan harmoni manusia dengan alam (Sunda).',
    description: 'Motif Tasikmalayan atau Priangan lebih menitikberatkan pada bentuk alam, terutama tumbuhan dan burung. Warna-warna yang digunakan kalem, tidak mencolok, dan menyiratkan keanggunan khas Pasundan.',
    source: 'Paguyuban Pecinta Batik Sunda',
    sourceUrl: 'https://jabarprov.go.id/'
  },
  'batik-sekar': {
    name: 'Batik Sekar (Sekar Jagad)',
    origin: 'Yogyakarta & Surakarta',
    meaning: 'Keragaman dan keindahan dunia yang menyatu dalam keharmonisan (Peta Dunia).',
    description: 'Berasal dari kata "Kar" (peta) dan "Jagad" (dunia). Motif ini tampak seperti pulau-pulau tidak beraturan yang bersatu. Melambangkan bahwa keragaman (Bhinneka) adalah sebuah keindahan yang absolut.',
    source: 'Yayasan Batik Indonesia',
    sourceUrl: 'https://yayasanbatikindonesia.id/'
  },
  'batik-sidoluhur': {
    name: 'Batik Sidoluhur',
    origin: 'Surakarta, Jawa Tengah',
    meaning: 'Pencapaian derajat yang tinggi, keluhuran budi pekerti, dan kehormatan.',
    description: 'Kata "Sido" berarti jadi/berhasil, dan "Luhur" berarti tinggi/mulia. Batik ini sering dikenakan oleh pengantin Jawa dengan harapan kedua mempelai menjadi panutan masyarakat.',
    source: 'Pura Mangkunegaran Surakarta',
    sourceUrl: 'https://puromangkunegaran.com/'
  },
  'batik-sidomukti': {
    name: 'Batik Sidomukti',
    origin: 'Surakarta & Yogyakarta',
    meaning: 'Kehidupan yang terus menerus tercukupi, makmur, dan penuh kebahagiaan.',
    description: 'Motif andalan dalam upacara pernikahan adat Jawa. Diberi warna soga alami yang filosofinya memberikan kehidupan mapan ("mukti") bagi sepasang pengantin hingga hari tua.',
    source: 'Museum Keraton Surakarta',
    sourceUrl: 'https://kratonjogja.id/'
  },
  'batik-sogan': {
    name: 'Batik Sogan',
    origin: 'Jawa Tengah (Solo & Jogja)',
    meaning: 'Kesederhanaan, keklasikan, kerendahan hati (bumi), dan identitas keraton.',
    description: 'Bukan sekadar motif, Sogan adalah jenis batik pewarnaan cokelat kemerahan atau cokelat kekuningan yang terbuat dari kayu pohon Soga. Identik dengan pakem keraton yang menjunjung tinggi keanggunan.',
    source: 'Balai Pelestarian Nilai Budaya (BPNB) Jawa Tengah',
    sourceUrl: 'https://kebudayaan.kemdikbud.go.id/bpnbjateng/'
  },
  'batik-solo_parang': {
    name: 'Batik Parang (Gaya Solo)',
    origin: 'Surakarta, Jawa Tengah',
    meaning: 'Ombak laut yang tak pernah berhenti bergerak (pantang menyerah) dan kesinambungan.',
    description: 'Merupakan salah satu motif tertua di Indonesia. Bentuk lereng diagonal Parang gaya Solo cenderung lebih melengkung halus (landai) dan mengalir, menyimbolkan kelembutan namun keteguhan hati kerabat keraton Surakarta.',
    source: 'Museum Keraton Kasunanan Surakarta',
    sourceUrl: 'https://surakarta.go.id/'
  },
  'batik-sulawesi_selatan_lontara': {
    name: 'Batik Lontara',
    origin: 'Sulawesi Selatan',
    meaning: 'Petuah bijak leluhur, kekuatan sastra, dan ketegasan karakter suku Bugis-Makassar.',
    description: 'Motif kontemporer yang mengangkat kaligrafi aksara Lontara. Huruf-hurufnya dirangkai membentuk pola garis atau siluet, berisi pepatah atau petuah adat "Pappaseng".',
    source: 'Dinas Kebudayaan Provinsi Sulawesi Selatan',
    sourceUrl: 'https://disbudpar.sulselprov.go.id/'
  },
  'batik-sumatera_barat_rumah_minang': {
    name: 'Batik Rumah Minang',
    origin: 'Sumatera Barat',
    meaning: 'Sistem kekerabatan matrilineal, kebesaran keluarga, dan persatuan kaum.',
    description: 'Mengambil inspirasi dari atap bergonjong (menyerupai tanduk kerbau) Rumah Gadang, dipadukan dengan motif sulur pakis dan corak songket tradisional Minangkabau.',
    source: 'Museum Adityawarman Padang',
    sourceUrl: 'https://museum.sumbarprov.go.id/'
  },
  'batik-sumatera_utara_boraspati': {
    name: 'Batik Boraspati',
    origin: 'Tapanuli, Sumatera Utara',
    meaning: 'Pelindung rumah tangga, kesuburan, kelimpahan rezeki, dan penolak bala.',
    description: 'Batik ini menggunakan lambang cicak (Boraspati ni Tano) yang banyak ditemui di ukiran (Gorga) Rumah Bolon suku Batak. Cicak dipercaya dapat beradaptasi di mana saja dan membawa kekayaan bagi pemilik rumah.',
    source: 'Pusat Dokumentasi dan Pengkajian Kebudayaan Batak, Universitas HKBP Nommensen',
    sourceUrl: 'https://uhn.ac.id/'
  },
  'batik-tambal': {
    name: 'Batik Tambal',
    origin: 'Yogyakarta',
    meaning: 'Memperbaiki hal-hal yang rusak (kesembuhan), merajut energi kehidupan yang baru.',
    description: 'Bentuknya berupa gabungan potongan-potongan (patchwork) motif batik lain seperti parang, kawung, dan truntum dalam pola segitiga. Pada masa lalu, kain ini diselimutkan pada orang sakit agar cepat sembuh.',
    source: 'Balai Besar Kerajinan dan Batik (BBKB) Yogyakarta',
    sourceUrl: 'https://bbkb.kemenperin.go.id/'
  },
  'batik-yogyakarta_kawung': {
    name: 'Batik Kawung (Gaya Jogja)',
    origin: 'Yogyakarta',
    meaning: 'Kesucian, awal kehidupan, empat arah mata angin (Kiblat Papat Lima Pancer).',
    description: 'Berbentuk bulatan-bulatan yang saling bersilangan menyerupai irisan buah aren atau bunga teratai. Dalam tradisi keraton, motif ini dulunya mencerminkan kepemimpinan yang adil dan hati yang bersih.',
    source: 'Yayasan Batik Indonesia & Keraton Yogyakarta',
    sourceUrl: 'https://kratonjogja.id/'
  },
  'batik-yogyakarta_parang': {
    name: 'Batik Parang (Gaya Jogja)',
    origin: 'Yogyakarta',
    meaning: 'Kewibawaan, ketegasan pemimpin, kesatriaan, dan perlindungan magis.',
    description: 'Berbeda dengan gaya Solo, garis diagonal Parang dari Kesultanan Yogyakarta ditarik dari kanan atas ke kiri bawah dengan sudut kemiringan yang lebih tajam dan tegas, mencerminkan karakter kesatria yang dinamis.',
    source: 'Museum Keraton Ngayogyakarta Hadiningrat',
    sourceUrl: 'https://kratonjogja.id/'
  }
};

/**
 * Fungsi untuk mencari detail batik berdasarkan label mentah dari model.
 */
export function getBatikDetail(rawLabel: string): BatikDetail {
  if (BATIK_INFO[rawLabel]) {
    return BATIK_INFO[rawLabel];
  }
  
  // Fallback (Penyelamatan) jika model mengeluarkan label yang belum ada di objek BATIK_INFO.
  const fallbackName = rawLabel
    .replace(/^batik-/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
    
  return {
    name: fallbackName,
    origin: 'Nusantara',
    meaning: 'Makna belum ditambahkan ke database.',
    description: 'Model mendeteksi motif batik yang sudah dilatihkan, namun deskripsi resminya belum ditambahkan oleh administrator web ke dalam file database informasi.',
    source: 'Sistem Deteksi Otomatis (Fallback)',
    sourceUrl: '#'
  };
}
