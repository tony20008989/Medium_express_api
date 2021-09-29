const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');
class UserModel {
    tableName = 'article';
    // find = async (params = {}) => {
    //     let sql = `SELECT * FROM ${this.tableName}`;

    //     if (!Object.keys(params).length) {
    //         return await query(sql);
    //     }

    //     const { columnSet, values } = multipleColumnSet(params)
    //     sql += ` WHERE ${columnSet}`;

    //     return await query(sql, [...values]);
    // }

    find = async () => {
        let sql = `SELECT author_id, title, update_time, LEFT(content,30) AS content FROM ${this.tableName} LIMIT 10`;

        return await query(sql);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    }

    create = async ({title, content, author_id , is_premium}) => {
        const sql = `INSERT INTO ${this.tableName}
        (title, content, author_id, is_premium) VALUES (?,?,?,?)`;

        const result = await query(sql, [title, content, author_id, is_premium]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE article SET ${columnSet} WHERE id = ?`;

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

    findActionList = async (params, table) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT * FROM ${table}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result;
    }

    createAction = async ({user_id, article_id}, table) => {
        const sql = `INSERT INTO ${table}
        (user_id, article_id) VALUES (?,?)`;

        const result = await query(sql, [user_id, article_id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    deleteAction = async ({user_id, article_id}, table) => {
        const sql = `DELETE FROM ${table}
        WHERE (user_id, article_id) = (?,?)`;
        const result = await query(sql, [user_id, article_id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new UserModel;