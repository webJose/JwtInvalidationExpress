import mysql from 'mysql2';
import config from '../config.js';

export default function () {
    const conn = mysql.createConnection(config.db);
    return new Promise((rslv, rjct) => {
        conn.connect(err => {
            if (err) {
                rjct(err);
                return;
            }
            rslv(conn);
        });
    });
};
