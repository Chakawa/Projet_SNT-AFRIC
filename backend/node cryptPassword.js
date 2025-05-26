const bcrypt = require('bcryptjs');

async function cryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
}

// Remplace 'password123' par le mot de passe que tu veux crypter
cryptPassword('password123');
