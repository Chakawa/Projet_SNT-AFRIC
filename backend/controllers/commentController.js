// controllers/commentController.js
const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  const userId = req.userId;             // du JWT
  const { demandeId, contenu } = req.body;

  if (!demandeId || !contenu) {
    return res.status(400).json({ error: 'demandeId et contenu requis' });
  }

  try {
    await Comment.create({ userId, demandeId, contenu });
    res.status(201).json({ message: 'Commentaire ajouté' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsByDemandeId = async (req, res) => {
  const { demandeId } = req.params;
  try {
    const comments = await Comment.getByDemandeId(demandeId);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
