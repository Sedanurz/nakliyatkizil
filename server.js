const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Frontend’den gelecek istekler için
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-mail', (req, res) => {
  const { departure, delivery, weight, dimensions, elevator, name, email, phone, message } = req.body;

  // Mail transporter ayarları (örnek Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ' nakliyatkizil@gmail.com',          // Gmail adresin
      pass: 'jxhl yugr meou zbyb'                // Gmail uygulama şifren
    }
  });

  const mailOptions = {
    from: email,
    to: ' nakliyatkizil@gmail.com',               // Mailin gideceği adres
    subject: `Yeni Teklif Talebi - ${name}`,
    html: `
      <h3>Yeni Teklif Talebi</h3>
      <p><b>Alınıcak Yer:</b> ${departure}</p>
      <p><b>Götürülücek Yer:</b> ${delivery}</p>
      <p><b>Tahmini Ağırlık:</b> ${weight} kg</p>
      <p><b>Kat Bilgisi:</b> ${dimensions}</p>
      <p><b>Asansör Bilgisi:</b> ${elevator}</p>
      <hr>
      <h4>Kişisel Bilgiler</h4>
      <p><b>Ad Soyad:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Telefon:</b> ${phone}</p>
      <p><b>Mesaj:</b> ${message}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Mail gönderme hatası:', error);
      return res.status(500).send('Mail gönderilemedi.');
    }
    res.send('Mesaj başarıyla gönderildi!');
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
