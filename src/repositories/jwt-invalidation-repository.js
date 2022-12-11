import dbConnectionFactory from './mysql-connection-factory.js';
import Query from './mysql-query.js';

const clearInvalidationSql = "truncate table JwtBlacklist;";
const upsertInvalidationSql = "insert into JwtBlacklist(`UserId`, `MinimumIat`)"
    + " values(?, ?) as new"
    + " on duplicate key update `MinimumIat` = new.`MinimumIat`;";
const getInvalidationSql = "select `Id`, `UserId`, `MinimumIat` from JwtBlacklist where `UserId` = ?;";

export default {
    clear: async function (txn) {
        const dbConn = txn?.connection ?? await dbConnectionFactory();
        const q = new Query(dbConn);
        const r = await q.query(clearInvalidationSql);
        console.log('Cleared table.  Results: %o', r);
    },
    add: async function (userId, newTime, txn) {
        const dbConn = txn?.connection ?? await dbConnectionFactory();
        const q = new Query(dbConn);
        const r = await q.query(upsertInvalidationSql, [userId, newTime]);
        console.log('Record upserted.  Results: %o', r);
    },
    get: async function (userId) {
        const dbConn = await dbConnectionFactory();
        const q = new Query(dbConn);
        const r = await q.query(getInvalidationSql, userId);
        console.log('Record read.  Results: %o', r);
        return r.results;
    }
};
