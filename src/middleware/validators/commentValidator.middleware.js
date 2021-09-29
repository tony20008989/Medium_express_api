const { body } = require('express-validator');

exports.createCommentSchema = [
    body('article_id')
        .exists()
        .withMessage('article_id is required'),
    body('content')
        .exists()
        .withMessage('content is required'),
    body('parent_id')
        .optional()
];


exports.updateCommentSchema = [
    body('content')
        .optional(),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['content'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
