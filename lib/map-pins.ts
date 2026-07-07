export interface MapPin {
  id: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  region: string
  motifName: string
  description: string
  image: string
}

export const mapPinsData: MapPin[] = [
  {
    id: 'sumatera',
    x: 13,
    y: 43,
    region: 'Sumatera',
    motifName: 'Batik Tanah Liek & Ulos',
    description: 'Di Sumatera, wastra tidak hanya batik tetapi juga tenun seperti Ulos. Batik Tanah Liek dari Minangkabau sangat unik karena pewarnaannya menggunakan tanah liat yang menghasilkan warna bumi (earth tones).',
    image: '/images/motif-sekar-jagad.png', // Using existing placeholder images
  },
  {
    id: 'jawa-barat',
    x: 27,
    y: 74,
    region: 'Jawa Barat & Banten',
    motifName: 'Megamendung & Baduy',
    description: 'Motif awan bergelombang dari Cirebon yang melambangkan kesejukan. Di Banten, suku Baduy juga menenun kain dengan warna dominan putih, hitam, dan biru tua yang sarat makna spiritual.',
    image: '/images/motif-mega-mendung.png',
  },
  {
    id: 'jawa-tengah',
    x: 32,
    y: 76,
    region: 'Jawa Tengah & Yogyakarta',
    motifName: 'Parang & Kawung',
    description: 'Jantung dari batik klasik Indonesia. Motif Parang melambangkan ombak laut yang tak pernah berhenti bergerak, sedangkan Kawung melambangkan hati yang suci dan keadilan.',
    image: '/images/motif-parang.png',
  },
  {
    id: 'madura',
    x: 39,
    y: 74,
    region: 'Madura',
    motifName: 'Batik Gentongan',
    description: 'Batik Madura terkenal dengan warna merah terang (mengkudu) dan berani. Teknik pewarnaannya menggunakan gentong tanah liat yang direndam berbulan-bulan.',
    image: '/images/motif-sekar-jagad.png',
  },
  {
    id: 'bali',
    x: 43,
    y: 80,
    region: 'Bali',
    motifName: 'Tenun Gringsing & Endek',
    description: 'Tenun Gringsing dari Tenganan adalah satu-satunya kain tenun ikat ganda di Indonesia, dipercaya memiliki kekuatan penolak bala. Kain Endek dipakai dalam berbagai upacara adat Bali.',
    image: '/images/motif-truntum.png',
  },
  {
    id: 'nusa-tenggara',
    x: 52,
    y: 83,
    region: 'Nusa Tenggara',
    motifName: 'Tenun Ikat Sumba',
    description: 'Tenun berukuran besar yang menampilkan motif figuratif seperti kuda, rusa, dan manusia. Sangat berharga dan sering dipakai sebagai simbol status sosial dalam upacara kematian (Marapu).',
    image: '/images/motif-sidomukti.png',
  },
  {
    id: 'kalimantan',
    x: 42,
    y: 43,
    region: 'Kalimantan',
    motifName: 'Batik Benang Bintik / Dayak',
    description: 'Motif yang sangat dipengaruhi oleh kepercayaan suku Dayak, seperti pohon kehidupan (Batang Garing) yang melambangkan keseimbangan antara dunia atas dan bawah.',
    image: '/images/motif-kawung.png',
  },
  {
    id: 'sulawesi',
    x: 58,
    y: 53,
    region: 'Sulawesi',
    motifName: 'Batik Toraja (Paqbarre Allo)',
    description: 'Motif dari Sulawesi banyak terinspirasi dari ukiran kayu rumah adat Tongkonan. Paqbarre Allo (Matahari) melambangkan kebesaran dan kemuliaan.',
    image: '/images/motif-truntum.png',
  },
  {
    id: 'maluku',
    x: 77,
    y: 57,
    region: 'Maluku',
    motifName: 'Tenun Tanimbar',
    description: 'Kain tenun dari kepulauan Maluku Tenggara yang khas dengan garis-garis tegas dan warna cerah. Dulu, motifnya menandakan keberanian kaum pria yang pulang dari medan perang.',
    image: '/images/motif-parang.png',
  },
  {
    id: 'papua',
    x: 88,
    y: 55,
    region: 'Papua',
    motifName: 'Batik Cendrawasih & Asmat',
    description: 'Batik Papua terkenal dengan warnanya yang cerah dan motif figuratif seperti burung Cendrawasih, alat musik Tifa, dan patung suku Asmat yang sangat ikonik.',
    image: '/images/motif-sidomukti.png',
  },
]
