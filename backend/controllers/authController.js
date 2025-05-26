const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

exports.register = async (req, res) => {
    const { nom, prenom, email, telephone, adresse, ville, password, niveauAcces } = req.body;
    try {
        console.log('Register data:', { nom, prenom, email, telephone, adresse, ville, password, niveauAcces });
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ nom, prenom, email, telephone, adresse, ville, password: hashedPassword, niveauAcces });
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Login data:', { email, password });
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        const token = jwt.sign({ userId: user.id, niveauAcces: user.niveau_acces }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, niveauAcces: user.niveau_acces });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};
