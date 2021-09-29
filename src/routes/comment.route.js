const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');

const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createCommentSchema, updateCommentSchema} = require('../middleware/validators/commentValidator.middleware');

router.get('/article/:article_id', auth(), awaitHandlerFactory(commentController.getArticleComment));
router.get('/:comment_id/replies', auth(), awaitHandlerFactory(commentController.getCommentReply));
router.post('/', auth(), createCommentSchema, awaitHandlerFactory(commentController.createComment));
router.post('/:comment_id/replies', auth(), createCommentSchema, awaitHandlerFactory(commentController.createReply));
router.put('/:comment_id', auth(), updateCommentSchema, awaitHandlerFactory(commentController.updateComment));
router.delete('/:comment_id', auth(), awaitHandlerFactory(commentController.deleteComment));
router.post('/clap/:comment_id', auth(), awaitHandlerFactory(commentController.clapComment));

module.exports = router;