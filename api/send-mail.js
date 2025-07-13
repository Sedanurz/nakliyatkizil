import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST isteklerine izin verilir' });
  }

  const { departure, delivery, weight, dimensions, elevator, name, email, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
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

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mesaj gönderildi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Mail gönderme başarısız' });
  }
}
