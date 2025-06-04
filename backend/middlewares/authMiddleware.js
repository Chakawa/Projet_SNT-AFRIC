const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.niveauAcces = decoded.niveauAcces;
        next();
    } catch (error) {
        console.error('Auth Middleware error:', error);
        res.status(401).json({ message: 'Token invalide' });
        return;
    }
};