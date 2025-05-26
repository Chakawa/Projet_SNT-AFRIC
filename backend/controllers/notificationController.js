const db = require('../config/db');
const transporter = require('../utils/transporter'); // importer proprement
const { User } = require('../models');

// Créer une notification
async function createNotification(userId, titre, message, type, lien = null) {
    try {
        const [user] = await db.execute(
            'SELECT email, notifications_email, notifications_plateforme FROM utilisateurs WHERE id = ?',
            [userId]
        );

        if (user.length === 0) return null;

        const userPrefs = user[0];

        let notificationId = null;
        if (userPrefs.notifications_plateforme) {
            const [result] = await db.execute(
                'INSERT INTO notifications (user_id, titre, message, type, lien) VALUES (?, ?, ?, ?, ?)',
                [userId, titre, message, type, lien]
            );
            notificationId = result.insertId;
        }

        if (userPrefs.notifications_email) {
            await transporter.sendMail({
                from: `"SNT AFRIC" <${process.env.EMAIL_FROM}>`,
                to: userPrefs.email,
                subject: titre,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #d0640b;">SNT AFRIC Notification</h2>
                        <p>${message}</p>
                        ${lien ? `<a href="${process.env.APP_URL}${lien}" style="display: inline-block; padding: 10px 20px; background-color: #d0640b; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">Voir les détails</a>` : ''}
                        <p style="margin-top: 30px; font-size: 12px; color: #777;">
                            Vous recevez cet email parce que vous avez activé les notifications par email dans votre compte SNT AFRIC.
                        </p>
                    </div>
                `
            });

            if (notificationId) {
                await db.execute(
                    'UPDATE notifications SET envoye_email = TRUE WHERE id = ?',
                    [notificationId]
                );
            }
        }

        return notificationId;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}

// Fonctions supplémentaires
async function getUserNotifications(userId, limit = 50) {
    const [notifications] = await db.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY date_creation DESC LIMIT ?',
        [userId, limit]
    );
    return notifications;
}

async function markNotificationAsRead(notificationId, userId) {
    await db.execute(
        'UPDATE notifications SET lue = TRUE WHERE id = ? AND user_id = ?',
        [notificationId, userId]
    );
}

async function getUnreadCount(userId) {
    const [result] = await db.execute(
        'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND lue = FALSE',
        [userId]
    );
    return result[0].count;
}

async function markAllAsRead(userId) {
    await db.execute(
        'UPDATE notifications SET lue = TRUE WHERE user_id = ? AND lue = FALSE',
        [userId]
    );
}

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    getUnreadCount,
    markAllAsRead
};
