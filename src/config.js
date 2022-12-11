import wjConfig from "wj-config";

export default await wjConfig()
    .addObject({
        port: 7777,
        jwt: {
            tokenTtl: 600,
            secret: "katOnCeyboard"
        },
        db: {
            host: "localhost",
            user: "generaldb_admin",
            password: "123@test!",
            database: "GeneralDB"
        }
    })
    .build();
