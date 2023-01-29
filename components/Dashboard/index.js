import { useState } from "react";
import { host } from "../../../helpers/host";
//import registerUser from helper

import Router from "next/router";

export function DashboardTable() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      //create the  post request
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
      console.log(request)

      // console.dir(request);
      //call the api to register an account
      fetch(`${host}/api/register`, request)
        // .then((data) => data)
      .then((data) => data.json())
      .then((data) => {
          //if register was successful
          if (data != undefined && (data.status == true || data.status == "true")) {
            console.log("pushing to login")
            Router.push("/auth/login?email=" + email);
          } else {
            setError(data.message);
          }
      })
    } catch (error) {
      setError("Unable to register, try another email");
    }}
     



    

  return (
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend className="h1">Register</legend>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="emailInput"
              className="form-control"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="usernameInput"
            className="form-control"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div> */}
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
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          {/* Error message */}
          {error && <p className="text-danger">{error}</p>}
        </fieldset>
      </form>
    );
  }
