const { body } = require('express-validator');
const Role = require('../../utils/userRoles.utils');


exports.createArticleSchema = [
    body('title')
        .exists()
        .withMessage('title is required'),
    body('content')
        .exists()
        .withMessage('content is required'),
    body('is_premium')
        .optional()
];

exports.updateArticleSchema = [
    body('title')
        .optional(),
    body('content')
        .optional(),
    body('is_premium')
        .optional(),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['title', 'content', 'is_premium'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
