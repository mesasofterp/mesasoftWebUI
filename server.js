const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const multer = require('multer'); // multer paketini dahil et

const app = express();
const port = 1905; // Sunucunun çalışacağı port
const upload = multer(); // multer'ı başlat

// Gelen istekleri okuyabilmek için gerekli ara yazılımlar (middleware)
app.use(cors()); // Farklı kaynaklardan gelen isteklere izin ver
app.use(express.json()); // JSON formatındaki verileri işle
app.use(express.urlencoded({ extended: true })); // Form verilerini işle

// --- VERİTABANI BİLGİLERİNİZİ BURAYA GİRİN ---
const dbConfig = {
    user: '***',
    password: '***',
    server: '***', // veya sunucu IP/adı
    database: '***',
    port: 111, // Port numarasını buraya ekleyin
    options: {
        encrypt: false, // Azure SQL için true yapın
        trustServerCertificate: true // Lokal geliştirme için true yapın
    }
};
// ---------------------------------------------

// İletişim formu için API endpoint'i
app.post('/api/contact', upload.none(), async (req, res) => { // multer middleware'ini ekle
    // Formdan gelen verileri al
    const { fullname, company, email, phone, message } = req.body;

    // Ad ve Soyad'ı ayır
    const nameParts = (fullname || '').split(' ');
    const ad = nameParts[0] || null;
    const soyad = nameParts.slice(1).join(' ') || null;

    // Gerekli alanları kontrol et
    if (!ad || !email || !message) {
        return res.status(400).json({ success: false, message: 'Lütfen tüm zorunlu alanları doldurun.' });
    }

    try {
        // Veritabanına bağlan
        let pool = await sql.connect(dbConfig);

        // SQL Injection'a karşı korumalı sorgu
        await pool.request()
            .input('Ad', sql.NVarChar, ad)
            .input('SoyAd', sql.NVarChar, soyad)
            .input('Unvan', sql.NVarChar, company)
            .input('Telefon', sql.NVarChar, phone) // Tablonuzdaki sütun adı 'Telefon'
            .input('Mesaj', sql.NVarChar, message)
            .input('Mail', sql.NVarChar, email) // E-posta için sütun eklediğinizi varsayıyoruz
            .query('INSERT INTO Talepler (Ad, SoyAd, Unvan, Telefon, Mesaj, Mail) VALUES (@Ad, @SoyAd, @Unvan, @Telefon, @Mesaj, @Mail)');

        res.json({ success: true, message: 'Mesajınız başarıyla alındı. En kısa sürede size geri döneceğiz.' });

    } catch (err) {
        console.error('Veritabanı Hatası:', err);
        res.status(500).json({ success: false, message: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.' });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
