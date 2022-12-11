import dbConnectionFactory from "./mysql-connection-factory.js";

function Transaction(dbConn) {
    this.connection = dbConn;
    this.started = false;
    this.disposed = false;
    this.start = function () {
        if (this.disposed) {
            throw new Error("A transaction object cannot be reused and this one has already been used.  Create a new Transaction object.");
        }
        if (this.started) {
            throw new Error("This transaction has already been started and cannot undergo the start process again.");
        }
        return new Promise((rslv, rjct) => {
            this.connection.beginTransaction(err => {
                if (err) {
                    rjct(err);
                    return;
                }
                this.started = true;
                rslv();
            });
        });
    };
    this.commit = function () {
        if (!this.started) {
            throw new Error("Cannot commit a transaction that hasn't started.");
        }
        if (this.disposed) {
            throw new Error("Cannot commit a disposed transaction.");
        }
        return new Promise((rslv, rjct) => {
            this.connection.commit(err => {
                if (err) {
                    rjct(err);
                    return;
                }
                this.started = false;
                this.disposed = true;
                rslv();
            });
        });
    };
    this.rollback = function () {
        if (!this.started) {
            throw new Error("Cannot roll back a transaction that hasn't started.");
        }
        if (this.disposed) {
            throw new Error("Cannot roll back a disposed transaction.");
        }
        return new Promise((rslv, rjct) => {
            this.connection.rollback(err => {
                if (err) {
                    rjct(err);
                    return;
                }
                this.started = false;
                this.disposed = true;
                rslv();
            });
        });
    }
}

export default {
    create: async function () {
        const dbConn = await dbConnectionFactory();
        return new Transaction(dbConn);
    }
};