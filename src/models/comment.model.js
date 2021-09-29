const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');
class UserModel {
    tableName = 'comment';
    clapTableName = 'user_clap_comment';
    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findAllComment = async (article_id, parent_id) => {
        const sql = `SELECT * FROM ${this.tableName}
        WHERE (article_id, parent_id) = (?,?)`;

        const result = await query(sql, [article_id, parent_id]);

        // return back the first row (user)
        return result;
    }

    // findAllComment = async (params) => {
    //     const { columnSet, values } = multipleColumnSet(params)

    //     const sql = `SELECT * FROM ${this.tableName}
    //     WHERE ${columnSet} and parent_id = 0`;

    //     const result = await query(sql, [...values]);

    //     // return back the first row (user)
    //     return result;
    // }

    findCommentAuthor = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT nickname FROM user
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result;
    }

    findAllClap = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT sum(amount) FROM ${this.clapTableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result;
    }

    findClap = async (comment_id, user_id) => {

        const sql = `SELECT amount FROM ${this.clapTableName}
        WHERE (comment_id, user_id) = (?,?)`;

        const result = await query(sql, [comment_id, user_id]);

        // return back the first row (user)
        return result;
    }

    create = async ({user_id, article_id, content}) => {
        const sql = `INSERT INTO ${this.tableName}
        (user_id, article_id, content) VALUES (?,?,?)`;
        const result = await query(sql, [user_id, article_id, content]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    createReply = async ({user_id, article_id, parent_id, content}) => {
        const sql = `INSERT INTO ${this.tableName}
        (user_id, article_id, parent_id, content) VALUES (?,?,?,?)`;
        const result = await query(sql, [user_id, article_id, parent_id, content]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE comment SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    clap = async ({user_id, comment_id, amount}) => {
        const sql = `INSERT INTO ${this.clapTableName}
        (user_id, comment_id, amount) VALUES (?,?,?)`;
        const result = await query(sql, [user_id, comment_id, amount]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    addClap = async ({user_id, comment_id, amount}, clap) => {
        const total = amount + clap
        const sql = `UPDATE ${this.clapTableName} SET amount=?
        WHERE user_id=? AND comment_id=?`;
        const result = await query(sql, [total, user_id, comment_id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new UserModel;