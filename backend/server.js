require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const demandRoutes = require('./routes/demandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const mail = require('./email-test/testMail'); // Pour les mails

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 🔥 Serveur les images statiques du dossier "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/technician', technicianRoutes);

// Exemple : envoyer un mail après une demande
// app.post('/api/demandes', (req, res) => {
//     const demandeData = req.body;

//     mail.sendMail()
//         .then(() => {
//             res.status(201).json({ message: 'Demande créée et email envoyé' });
//         })
//         .catch((error) => {
//             console.log('Erreur d\'envoi d\'email :', error);
//             res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
//         });
// });

// ✅ Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
