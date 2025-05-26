const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const demandRoutes = require('./routes/demandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const mail = require('./email-test/testMail');  // Importation du fichier mail.js

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/technician', technicianRoutes);

// Exemple de route où tu envoies un email après avoir créé une demande
app.post('/api/demandes', (req, res) => {
    // Logique pour créer une demande (tu peux remplacer par ta logique réelle)
    const demandeData = req.body;
    
    // Appel de la fonction d'envoi d'email après avoir créé la demande
    mail.sendMail()
        .then(() => {
            res.status(201).json({ message: 'Demande créée et email envoyé' });
        })
        .catch((error) => {
            console.log('Erreur d\'envoi d\'email :', error);
            res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
        });
});

// Configuration du port et démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
