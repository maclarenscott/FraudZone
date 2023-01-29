import React, { useState } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import { whoAmI } from "../../lib/auth";
import { removeToken } from "../../lib/token";
import Head from 'next/head'

function timeStampToRelative(time) {
  const date = new Date(time);
  //offset date by 5 hours
  date.setHours(date.getHours() - 5);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

const api_key_display = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false)
  const { token } = router.query;
  const { email } = router.query;

  React.useEffect(() => {

    if (!loaded) {
      console.log("YOLOOO")
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          email: email
        }),
      }
      fetch("/api/api_keys", request).then((response) => response.json())
        .then((data) => {
          console.log("api keys " + data["api_keys"])
          setData(data["api_keys"])
          setLoaded(true)
          console.log("loaded")
        }).catch((error) => {
          console.log(error);
        })
    }
  })
  return (
    <>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Created</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name}>
              <td>
                <a href={`#`}>{row["api_key"]}</a>
              </td>

              <td>{timeStampToRelative(row["date"])}</td>
              <td>{row["valid"]}</td>
            </tr>
          ))}
        </tbody>


      </table>
    </>
  )
}








const dash = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [api_keys, setApiKeys] = useState([]);
  const [loaded, setLoaded] = useState(false)
  const { token } = router.query;
  const { email } = router.query;

  function getRiskColor(risk) {
    if (risk >=70) {
      return "text-danger"
    } else if (risk >= 30) {
      return "text-warning"
    } else {
      return ""
    }}


  React.useEffect(() => {

    if (!loaded) {
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          email: email
        }),
      }
      fetch("/api/sessions", request).then((response) => response.json())
        .then((data) => {
          console.log(data["sessions"])
          setData(data["sessions"])

          setLoaded(true)
          console.log("loaded")
        }).catch((error) => {
          console.log(error);
        }
        )


    }
  }, [loaded])

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1>Welcome to your dashboard</h1>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Source</th>
            <th scope="col">Date</th>
            <th scope="col">Risk</th>
          </tr>
        </thead>
        <tbody>
          {data ? data.map((row) => (
            <tr key={row.name}>
              <td className="text-primary">
                <a href={`/dashboard/session/${row["sessions_key"]}?email=${email}`}>{row["sessions_key"]}</a>
              </td>

              <td>{row["source"]}</td>
              <td>{timeStampToRelative(row["date"])}</td>
              <td className={getRiskColor(parseInt(row["risk"]))}>{row["risk"]}</td>




            </tr>
          )) : <tr><td>loading</td></tr>}
        </tbody>
      </table>
      {/* <h1>API Keys</h1>
      {api_key_display()} */}
    </>
  )
}


export default function Dashboard() {
  const router = useRouter();
  // Get the query parameter from the URL
  const { token } = router.query;
  const { email } = router.query;

  // Watchers
  React.useEffect(() => {
    if (!token || !email) {
      redirectToLogin();
    } else {
      // (async () => {
      //   try {
      //     const data = await whoAmI();
      //     if (data.error === "Unauthorized") {
      //       // User is unauthorized and there is no way to support the User, it should be redirected to the Login page and try to logIn again.
      //       redirectToLogin();
      //     } else {
      //       setUser(data.payload);
      //     }
      //   } catch (error) {
      //     // If we receive any error, we should be redirected to the Login page
      //     redirectToLogin();
      //   }
      // })();
    }
  }, []);

  function redirectToLogin() {
    Router.push("/auth/login");
  }

  function handleLogout(e) {
    e.preventDefault();

    removeToken();
    redirectToLogin();
  }


  return (<div>
    {dash()}
  </div>)
}

// Fojan side notes :
// class A extends React.Component {
//     componentDidUpdate() {
//         React.useEffect(() => {

//         }) // with no second param
//     }
//     componentDidMount() {
//         React.useEffect(() => {

//         }, []) // the Second param should be empty
//     }
//     componentWillReceiveProps() {
//         React.useEffect(() => {

//         }, [props.name]) // The Second param is everything what you want
//     }
//     componentWillUnmount() {
//         React.useEffect(() => {
//             document.querySelectorAll("button").addEventListener("click", (e) => {

//             }, {})
//             return () => {
//                 // This function will be called before raise the Component's Destroy Event
//                 document.querySelectorAll("button").removeEventListener("click", (e) => {

//                 })
//             }
//         })
//     }
//     render() {
//         return (
//             <div>salam</div>
//         )
//     }
// }
