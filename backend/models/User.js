const db = require('../config/db');

class User {
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        return rows[0];
    }

    static async create(userData) {
        const { nom, prenom, email, telephone, adresse, ville, password, niveauAcces } = userData;
        const [result] = await db.execute(
            'INSERT INTO utilisateurs (nom, prenom, email, telephone, adresse, ville, password, niveau_acces) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nom, prenom, email, telephone, adresse, ville, password, niveauAcces]
        );
        return result.insertId;
    }
}

module.exports = User;