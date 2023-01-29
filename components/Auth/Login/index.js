import { useState, useEffect } from "react";
import Router from "next/router";
import { loginUser } from "../../../lib/auth";
import { removeToken } from "../../../lib/token";
// import { host } from "../../../helpers/host";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  

  

  async function handleSubmit(e) {

    console.log('sign in click')
    const host="http://localhost:3000"
    console.log(host)
    e.preventDefault();

    try {
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": email,
          "password": password,
        })
      }

      fetch(`${host}/api/login`, request)
      .then((data) => data.json())
      .then((data) => {
        console.log('data')
        console.log(data)
        console.log(data["status"])
        //if register was successful
        if (data["status"] == true || data["status"] == "true"){
          
          // console.log("kkk")
          console.log("pushing to dashboard")
          const kkk =`/dashboard?email=${email}&token=${data["token"]}`;
          console.log(kkk)
          Router.push(kkk);
          // Router.push("https://google.ca");
        }else{
          setError(data["message"]);
        }
      }).catch((error) => {
        setError("Unable to login, invalid credentials");
        
      })

    } catch (error) {
      setError("Error:"+String(error));
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend className="h1">Login</legend>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="emailInput"
            className="form-control"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="passwordInput"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="RememberMeInput"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="RememberMeInput">
              Remember Me
            </label>
          </div>
        </div> */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary" >
          Login
        </button>
      </fieldset>
    </form>
  );
}
