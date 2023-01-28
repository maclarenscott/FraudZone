import mysql from 'serverless-mysql';
export class DatabaseConnection {

    constructor(host = null, user = "fz", password = null, database = "FraudZone") {
        require("dotenv").config()
        //set host and password to environment variables if not given
        if (!host) {
            host=process.env.host;

        }
        if (!password) {
            password=process.env.pass;
        }

        console.log(process.env.pass)
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    async connect() {
        this.connection = require('serverless-mysql')(
            {
                config: {
                    host: this.host,
                    user: this.user,
                    password: this.password,
                    database: this.database
                }
            });
    }

    async loginUser(email,hashed_password){
        //check if a user exists and the password hashes are identical
        const rows = await this.connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email,hashed_password]);
        //if not user
        if (rows.length == 0){
            return {status:false, token:""};
        }
        //if user exists
        else{
            user_id = rows[0].id;
            //generate token
            const token = require('crypto').randomBytes(64).toString('hex');
            //get current time stamp and add 4 hours until it expires
            var date = new Date();
            date.setHours(date.getHours() + 4);
            var expires = date.toISOString().slice(0, 19).replace('T', ' ');
            //update token in database
            await this.connection.query("INSERT INTO Tokens (id, token_key, user_id, created, expires) VALUES (NULL, ?, ?, CURRENT_TIMESTAMP, ?)", [token,user_id,expires]);
            return {status:true, token:token};
        }   

    }

    //Example of an api request
    // async getUniversityById(id) {
    //     const rows = await this.connection.query('SELECT * FROM universities WHERE id = ?', [id]);
    //     return rows[0];
    // }

    
    
}