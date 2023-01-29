import host from "../../helpers/host";
import { DatabaseConnection } from "../../helpers/conn";

export default function handler (req, res){
  if (req.method !== "POST") {
    res.status(405).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the POST http method.`,
    });
    return;
  }

  const { email, token } = req.body;
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
    conn.connection.query(`SELECT * FROM Users WHERE email = '${email}'`).then((rows) => {
      if (rows.length == 1) {
        console.log('user exists')
        const user_id = rows[0].id;
        if(!user_id){
            res.status(500).json({ status: false, code: 500, message: `Error: ${data.message}` });
            return;
        }
        //check if token is valid for user
        conn.connection.query(`SELECT * FROM Tokens WHERE user_id = '${user_id}' AND token_key = '${token}'`).then((rows) => {
            if (rows.length == 1) {
                //get sessions from user
                conn.connection.query(`SELECT * FROM Api_Keys WHERE user_id = '${user_id}'`).then((rows) => {
                    res.status(200).json({ status: true, code: 200, sessions: rows });
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({ status: false, code: 500, message: `Error: ${err}` });
                })
            }
            else{
                res.status(401).json({ status: false, code: 409});
            }
        })
      }else{
        res.status(401).json({ status: false, code: 409});
        return;
      }
    })
  })



};
