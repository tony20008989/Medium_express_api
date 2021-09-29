const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const auth = require('../middleware/auth.middleware');

const { createArticleSchema, updateArticleSchema } = require('../middleware/validators/articleValidator.middleware');

router.get('/', awaitHandlerFactory(articleController.getAllArticles)); // localhost:3000/api/v1/users
router.get('/:id', awaitHandlerFactory(articleController.getArticleById)); 
router.post('/', auth(), createArticleSchema, awaitHandlerFactory(articleController.createArticle)); // localhost:3000/api/v1/users
router.put('/:id', auth(), updateArticleSchema, awaitHandlerFactory(articleController.updateArticle)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete('/:id', auth(), awaitHandlerFactory(articleController.deleteArticle)); // localhost:3000/api/v1/users/id/1

///like, follow, bookmark
router.get('/action/:action/:articleid', awaitHandlerFactory(articleController.getActionList));
router.post('/action/:action/:articleid', auth(), awaitHandlerFactory(articleController.createAction));
router.delete('/action/:action/:articleid', auth(), awaitHandlerFactory(articleController.deleteAction));

module.exports = router;