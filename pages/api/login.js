// import host from "../../helpers/host";
import { DatabaseConnection } from "../../helpers/conn";
import crypto from "crypto";

export default function handler (req, res){
  if (req.method !== "POST") {
    res.status(405).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the POST http method.`,
    });
    return;
  }

  const { email, password } = req.body;
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
    conn.connection.query(`SELECT * FROM Users WHERE email = '${email}' AND password = '${password}'`).then((rows) => {
      if (rows.length == 1) {
        console.log('user exists')
        //create hex token
        const token = crypto.randomBytes(16).toString("hex");
        const q = "INSERT INTO `Tokens` (`id`, `token_key`, `user_id`, `created`, `expires`) VALUES (NULL, ?, ?, ?, ?)";
        //get current timestamp and add 1 hour
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        console.log('expires: ' + expires)
        const params = [token, rows[0].id, new Date(),expires];
        conn.connection.query(q,params).then(() => { 
          res.status(200).json({ status: true, code: 200, token: token});
        }).catch
        ((err) => {
          console.log(err);
          res.status(500).json({ status: false, code: 500, message: `Error: ${err}` });
        })
      }else{
        res.status(401).json({ status: false, code: 409,token:'' });
        return;
      }
    })
  })

  //   conn.registerUser(email, password).then((result) => {
      
  //     //if register was successful
  //     console.log("result"+ result)
  //     if (result.status) {
  //       //return data 
  //       console.log('register successful')
  //       res.status(result.code).json(result);
  //     }
  //     //if register was not successful
  //     else {
  //       res.status(result.code).json({ status: false, code: result.code, message: result.message });
  //     }
  //   }).catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ status: false, code: 500, message: `Error: ${err}` });
  //   })
  // });


};
