export default function Query(dbConn) {
    this._dbConn = dbConn;
    this.query = function (sql, sqlParams) {
        return new Promise((rslv, rjct) => {
            this._dbConn.query(sql, sqlParams, (err, results, fields) => {
                if (err) {
                    rjct(err);
                    return;
                }
                rslv({
                    results: results,
                    fields: fields
                });
            });
        });
    }
}
