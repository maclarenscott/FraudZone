import mysql from 'serverless-mysql';
// import dotenv from 'dotenv';
export class DatabaseConnection {

    constructor(host = false, user = "fz", password = false, database = "FraudZone") {
        console.log('at constructor')
        // require("dotenv").config()
        //set host and password to environment variables if not given
        if (!host) {
            host = "194.113.64.137";
        }
        if (!password) {
            password = btoa("aGVxcG8wLWhvdHZ1Yy1EeXR2ZWY=");
        }

        console.log('pass:' + password)
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    async connect() {
        try {
            this.connection = require('serverless-mysql')(
                {
                    config: {
                        host: this.host,
                        user: this.user,
                        password: this.password,
                        database: this.database
                    }
                })

            return { status: true, message: "Connected to database" };
        } catch (err) {
            console.log("cant connect to mysql: " + err)
            return { status: false, message: `Error: ${err}` };
        }
    }

    async registerUser(email, hashed_password) {
        console.log("Checking if user exists")
        //check if a user exists
        this.connection.query('SELECT * FROM Users WHERE email = ?', [email]).then((rows) => {
            //if user exists
            let ret = {};
            if (rows.length > 0) {
                console.log('user exists')
                ret = { status: false, code: 409 };
            }
            //if not user
            else {
                try {
                    //insert user into database
                    console.log('inserting user')
                    this.connection.query("INSERT INTO Users (id, email, password) VALUES (NULL, ?, ?)", [email, hashed_password]).then((result) => {
                        //return success
                        console.log('user inserted')
                        console.dir(result)
                        ret = { status: true, code: 200 };
                        return ret
                    })
                }
                catch (err) {
                    console.log(err);
                    ret = { status: false, code: 500, message: `Error: ${err}` };
                }
            }
            console.log("returning ")
            console.dir(ret)
            return ret;
        }

        )


    }

    async loginUser(email, hashed_password) {
        //check if a user exists and the password hashes are identical
        const rows = await this.connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, hashed_password]);
        //if not user
        if (rows.length == 0) {
            return { status: false, token: "", code: 401 };
        }
        //if user exists
        else {
            try {
                user_id = rows[0].id;
                //generate token
                const token = require('crypto').randomBytes(64).toString('hex');
                //get current time stamp and add 4 hours until it expires
                var date = new Date();
                date.setHours(date.getHours() + 4);
                var expires = date.toISOString().slice(0, 19).replace('T', ' ');
                //update token in database
                await this.connection.query("INSERT INTO Tokens (id, token_key, user_id, created, expires) VALUES (NULL, ?, ?, CURRENT_TIMESTAMP, ?)", [token, user_id, expires]);
                return { status: true, token: token, code: 200 };
            }
            catch (err) {
                console.log(err);
                return { status: false, token: "", code: 500, message: `Error: ${err}` };
            }
        }

    }
    async checkToken(token) {
        //check if a token exists
        this.connection.query('SELECT * FROM Tokens WHERE token_key = ?', [token])
            .then((rows) => {
                try {
                    //if token exists
                    if (rows.length > 0) {
                        //check if token is expired
                        if (rows[0].expires < new Date().toISOString().slice(0, 19).replace('T', ' ')) {
                            return { status: false, code: 401 };
                        }
                        //if token is not expired
                        else {
                            return { status: true, code: 200 };
                        }
                    }
                    //if token does not exist
                    else {
                        return { status: false, code: 401 };
                    }
                } catch (err) {
                    console.log(err);
                    return { status: false, code: 500, message: `Error: ${err}` };
                }
            })
    }

    async getUserInfo(token, user_id) {
        //check if a token exists
        this.checkToken(token).then((result) => result.json())
            .then((result) => {
                //if token exists
                if (result["status"]) {
                    //get user id from token
                    this.connection.query('SELECT * FROM Sessions WHERE user_id = ?', [user_id])
                        .then((rows) => {
                            //return a list of the sessions
                            return { status: true, code: 200, sessions: rows };
                        })
                }
                //if token does not exist
                else {
                    return { status: false, code: 401 };
                }
            })  
    }Ï






                    //Example of an api request
                    // async getUniversityById(id) {
                    //     const rows = await this.connection.query('SELECT * FROM universities WHERE id = ?', [id]);
                    //     return rows[0];
                    // }



                }