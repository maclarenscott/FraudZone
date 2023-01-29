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
    conn.connection.query(`SELECT * FROM Users WHERE email = '${email}'`).then((rows) => {
      if (rows.length > 0) {
        console.log('user exists')
        res.status(409).json({ status: false, code: 409 });
      }else{
        conn.connection.query(`INSERT INTO Users (email, password) VALUES ('${email}', '${password}')`).then((result) => {
          console.log('user inserted')
          console.dir(result)
          res.status(200).json({ status: true, code: 200 });
        }
        ).catch((err) => {
          console.log(err);
          res.status(500).json({ status: false, code: 500, message: `Error: ${err}` });
        })
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
