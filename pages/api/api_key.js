import host from "../../helpers/host";
import { DatabaseConnection } from "../../helpers/conn";

export default function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({
            error: "METHOD_NOT_ALLOWED",
            message: `${req.method} is not allowed, please use the POST http method.`,
        });
        return;
    }

    const { api_key } = req.body;
    console.dir(req.body)

    const conn = new DatabaseConnection();
    conn.connect().then(() => {
        //check if connection is successful
        if (!conn.connection) {
            res.status(500).json({ status: false, code: 500, message: `Error: ${data.message}` });
            return;
        }
        console.log('db object created')
        //check if a user exists
        conn.connection.query(`SELECT * FROM Api_Keys WHERE api_key = '${api_key}'`).then((rows) => {
            if (rows.length == 1) {
                console.log('api_key exists')
                //if the api key is valid, return success
                if (rows[0]["api_key"] == api_key) {
                    res.status(200).json({ status: true, code: 200, message: 'API Key is valid' });
                    return;
                } else {
                    res.status(401).json({ status: false, code: 409 });
                    return;
                }
            } else {
                res.status(401).json({ status: false, code: 409 });
                return;
            }
        })
    })
}








             
