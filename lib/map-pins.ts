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
    x: 15,
    y: 35,
    region: 'Sumatera',
    motifName: 'Batik Tanah Liek & Ulos',
    description: 'Di Sumatera, wastra tidak hanya batik tetapi juga tenun seperti Ulos. Batik Tanah Liek dari Minangkabau sangat unik karena pewarnaannya menggunakan tanah liat yang menghasilkan warna bumi (earth tones).',
    image: '/images/motif-sekar-jagad.png', // Using existing placeholder images
  },
  {
    id: 'jawa-barat',
    x: 23,
    y: 75,
    region: 'Jawa Barat (Cirebon)',
    motifName: 'Megamendung',
    description: 'Motif awan bergelombang yang melambangkan kesejukan dan ketenangan. Memiliki pengaruh kuat dari budaya Tiongkok yang berakulturasi dengan keraton Cirebon.',
    image: '/images/motif-mega-mendung.png',
  },
  {
    id: 'jawa-tengah',
    x: 32,
    y: 80,
    region: 'Jawa Tengah & Yogyakarta',
    motifName: 'Parang & Kawung',
    description: 'Jantung dari batik klasik Indonesia. Motif Parang melambangkan ombak laut yang tak pernah berhenti bergerak, sedangkan Kawung melambangkan hati yang suci dan keadilan.',
    image: '/images/motif-parang.png',
  },
  {
    id: 'kalimantan',
    x: 42,
    y: 40,
    region: 'Kalimantan',
    motifName: 'Batik Benang Bintik / Dayak',
    description: 'Motif yang sangat dipengaruhi oleh kepercayaan suku Dayak, seperti pohon kehidupan (Batang Garing) yang melambangkan keseimbangan antara dunia atas dan bawah.',
    image: '/images/motif-kawung.png',
  },
  {
    id: 'sulawesi',
    x: 60,
    y: 45,
    region: 'Sulawesi',
    motifName: 'Batik Toraja (Paqbarre Allo)',
    description: 'Motif dari Sulawesi banyak terinspirasi dari ukiran kayu rumah adat Tongkonan. Paqbarre Allo (Matahari) melambangkan kebesaran dan kemuliaan.',
    image: '/images/motif-truntum.png',
  },
  {
    id: 'papua',
    x: 88,
    y: 50,
    region: 'Papua',
    motifName: 'Batik Cendrawasih & Asmat',
    description: 'Batik Papua terkenal dengan warnanya yang cerah dan motif figuratif seperti burung Cendrawasih, alat musik Tifa, dan patung suku Asmat yang sangat ikonik.',
    image: '/images/motif-sidomukti.png',
  },
]
