const CommentModel = require('../models/comment.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Comment Controller
 ******************************************************************************/
class CommentController {

    getArticleComment = async (req, res, next) => {
        const commentClap = []
        const myClap = []
        const authorlist = []
        const replylist = []
        const comment = await CommentModel.findAllComment(req.params.article_id,'0');
        for (var n in comment) {
            const author = await CommentModel.findCommentAuthor({ id: comment[n].user_id });
            authorlist.push(author)
        }
        for (var n in comment) {
            const Clap = await CommentModel.findAllClap({ comment_id: comment[n].id });
            commentClap.push(Clap)
        }
        for (var n in comment) {
            const Clap = await CommentModel.findClap(comment[n].id, req.currentUser.id);
            myClap.push(Clap)
        }
        for (var n in comment) {
            const reply = await CommentModel.findAllComment(req.params.article_id, comment[n].id)
            replylist.push(reply)
        }
        if (!comment) {
            throw new HttpException(404, 'Comment not found');
        }

        res.send({"comment":comment, "clap":commentClap, "my clap": myClap, "author": authorlist, "reply": replylist})
    };

    getCommentReply = async (req, res, next) => {
        const commentClap = []
        const myClap = []
        const authorlist = []
        const replylist = []
        ///aticle_id 要先找
        const comment = await CommentModel.findAllComment(req.params.article_id, req.params.comment_id);
        for (var n in comment) {
            const author = await CommentModel.findCommentAuthor({ id: comment[n].user_id });
            authorlist.push(author)
        }
        for (var n in comment) {
            const Clap = await CommentModel.findAllClap({ comment_id: comment[n].id });
            commentClap.push(Clap)
        }
        for (var n in comment) {
            const Clap = await CommentModel.findClap(comment[n].id, req.currentUser.id);
            myClap.push(Clap)
        }
        for (var n in comment) {
            const reply = await CommentModel.findAllComment(req.params.article_id, comment[n].id)
            replylist.push(reply)
        }
        if (!comment) {
            throw new HttpException(404, 'Comment not found');
        }

        res.send({"comment":comment, "clap":commentClap, "my clap": myClap, "author": authorlist, "reply": replylist})
    };

    createComment = async (req, res, next) => {
        this.checkValidation(req);

        req.body.user_id = req.currentUser.id

        const result = await CommentModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Comment was created!');
    };

    createReply = async (req, res, next) => {
        this.checkValidation(req);

        req.body.user_id = req.currentUser.id
        req.body.parent_id = req.params.comment_id

        const result = await CommentModel.createReply(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Comment was created!');
    };

    updateComment = async (req, res, next) => {
        this.checkValidation(req);

        const result = await CommentModel.update(req.body, req.params.comment_id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Comment not found' :
            affectedRows && changedRows ? 'Comment updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteComment = async (req, res, next) => {
        const result = await CommentModel.delete(req.params.comment_id);
        if (!result) {
            throw new HttpException(404, 'Comment not found');
        }
        res.send('Comment has been deleted');
    };

    clapComment = async (req, res, next) => {
        req.body.user_id = req.currentUser.id
        req.body.comment_id = req.params.comment_id
        const clap = await CommentModel.findClap(req.body.comment_id, req.body.user_id);
        if (clap == '') {
            const result = await CommentModel.clap(req.body);
            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
        } else {
            const result = await CommentModel.addClap(req.body,clap[0].amount);
            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
        }

        res.status(201).send('Clap was created!'); 
    }

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
module.exports = new CommentController;