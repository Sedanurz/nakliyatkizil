import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // ✅ CORS AYARI: www'li ve www'siz alan adını destekle
  const allowedOrigins = ['https://www.nakliyatkizil.com', 'https://nakliyatkizil.com'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight isteği (CORS OPTIONS kontrolü)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    departure,
    delivery,
    weight,
    dimensions,
    elevator,
    name,
    email,
    phone,
    message
  } = req.body;

  if (!process.env.EMAIL || !process.env.PASS) {
    return res.status(500).json({ message: '.env değişkenleri eksik' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'nakliyatkizil@gmail.com',
    subject: `Yeni Nakliyat Talebi - ${name}`,
    html: `
      <h2 style="color:#e53935;">Yeni Nakliyat Talebi</h2>
      <p><strong>Alınacak Yer:</strong> ${departure}</p>
      <p><strong>Götürülecek Yer:</strong> ${delivery}</p>
      <p><strong>Tahmini Ağırlık:</strong> ${weight}</p>
      <p><strong>Kat Bilgisi:</strong> ${dimensions}</p>
      <p><strong>Asansör Bilgisi:</strong> ${elevator}</p>
      <hr>
      <p><strong>Ad Soyad:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Mesaj:</strong> ${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Mail başarıyla gönderildi' });
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    return res.status(500).json({ message: 'Mail gönderme başarısız' });
  }
}
