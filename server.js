require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Ortam değişkenlerini kontrol et
if (!process.env.EMAIL || !process.env.PASS) {
  console.error('Hata: .env dosyasındaki EMAIL veya PASS eksik.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON veri alımı için

// Statik dosyalar (form HTML burada olabilir)
app.use(express.static('public'));

// Mail yapılandırması
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// Test SMTP bağlantısı
transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP bağlantı hatası:', error);
  } else {
    console.log('SMTP bağlantısı başarılı.');
  }
});

// POST /send-email endpoint
app.post('/send-email', (req, res) => {
  const {
    departure,    // Alınacak Yer
    delivery,     // Götürülecek Yer
    weight,       // Tahmini Ağırlık
    dimensions,   // Kat Bilgisi
    elevator,     // Asansör Bilgisi
    name,
    email,
    phone,
    message
  } = req.body;

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'nakliyatkizil@gmail.com', // Dilersen kendi adresini yaz
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('E-posta gönderme hatası:', error);
      return res.status(500).json({ message: 'Mail gönderme başarısız' });
    }
    console.log('E-posta gönderildi:', info.response);
    res.status(200).json({ message: 'Mail başarıyla gönderildi' });
  });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
