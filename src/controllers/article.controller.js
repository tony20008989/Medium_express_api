const ArticleModel = require('../models/article.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Article Controller
 ******************************************************************************/
class ArticleController {
    getAllArticles = async (req, res, next) => {
        let articleList = await ArticleModel.find();
        if (!articleList.length) {
            throw new HttpException(404, 'Articles not found');
        }
        res.send(articleList);
    };

    getArticleById = async (req, res, next) => {
        const article = await ArticleModel.findOne({ id: req.params.id });
        if (!article) {
            throw new HttpException(404, 'Article not found');
        }
        if (article.is_premium == 1){
            if (req.currentUser.role == 'Member'){
                res.send(article);
            } else{
                throw new HttpException(404, 'You are not premium');
            }
        }
        res.send(article)
    };

    createArticle = async (req, res, next) => {
        this.checkValidation(req);

        req.body.author_id = req.currentUser.id

        const result = await ArticleModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Article was created!');
    };

    updateArticle = async (req, res, next) => {
        this.checkValidation(req);

        const result = await ArticleModel.update(req.body, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Article not found' :
            affectedRows && changedRows ? 'Article updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteArticle = async (req, res, next) => {
        const result = await ArticleModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Article not found');
        }
        res.send('Article has been deleted');
    };

    /// follow, like, bookmark

    getActionList = async (req, res, next) => {
        if (req.params.action == 'like') {
            const article = await ArticleModel.findActionList({ article_id: req.params.articleid},'user_like_article');
            if (!article) {
                throw new HttpException(404, 'This Article have no like');
            }
            res.send(article)
        } else if (req.params.action == 'follow') {
            const article = await ArticleModel.findActionList({ article_id: req.params.articleid},'user_follow_article');
            if (!article) {
                throw new HttpException(404, 'This Article have no follow');
            }
            res.send(article)
        } else if (req.params.action == 'bookmark') {
            const article = await ArticleModel.findActionList({ article_id: req.params.articleid},'user_bookmark_article');
            if (!article) {
                throw new HttpException(404, 'This Article have no bookmark');
            }
            res.send(article)
        } else {
            throw new HttpException(404, 'This Article have no this action');
        }
    };

    createAction = async (req, res, next) => {
        req.body.user_id = req.currentUser.id
        req.body.article_id = req.params.articleid
        req.body.action = req.params.action
        if (req.params.action == 'like') {
            const result = await ArticleModel.createAction(req.body, 'user_like_article');
            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
            res.status(201).send('You liked the article!');
        } else if (req.params.action == 'follow') {
            const result = await ArticleModel.createAction(req.body, 'user_follow_article');
            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
            res.status(201).send('You followed the article!');
        } else if (req.params.action == 'bookmark') {
            const result = await ArticleModel.createAction(req.body, 'user_bookmark_article');
            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
            res.status(201).send('You bookmarked the article !');
        } else {
            throw new HttpException(404, 'This Article have no this action');
        }
    };

    deleteAction = async (req, res, next) => {
        req.body.user_id = req.currentUser.id
        req.body.article_id = req.params.articleid
        req.body.action = req.params.action
        if (req.params.action == 'like') {
            const result = await ArticleModel.deleteAction(req.body, 'user_like_article');
            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
            res.status(201).send('You cancel liking the article!');
        } else if (req.params.action == 'follow') {
            const result = await ArticleModel.deleteAction(req.body, 'user_follow_article');
            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
            res.status(201).send('You cancel following the article!');
        } else if (req.params.action == 'bookmark') {
            const result = await ArticleModel.deleteAction(req.body, 'user_bookmark_article');
            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
            res.status(201).send('You cancel bookmarking the article !');
        } else {
            throw new HttpException(404, 'This Article have no this action');
        }
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ArticleController;