import { useState, useEffect } from "react";
import UserPopup from "../popups/UserPopup";
//import { webFetch } from "../../util/webUtil";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  var elems = [];
  //const [userData, setUserData] = useState({});

  if (users.length <= 0) {
    fetch(`${process.env.REACT_APP_URL}/Users`).then((res) => {
      if (res.status === 200) {
        res.json().then((val) => {
          console.log(val);
          setUsers(val);
        });
      } else {
        console.log("Error from server: " + res.status);
      }
    });
  } else {
    users.forEach((id) => {
      elems.push(<UserPopup ID={id._id} />);
    });
  }
  useEffect(() => {
    if (users.length <= 0) {
      // Dummy data, webfetch is being weird with returning null
      // right now since it cant CORS from localhost to the backend.
      // Double check this against live later.
      setUsers([{ test: { username: "test", email: "test@test.com" } }]);
      return;

      /*webFetch("/Users")
        .then((val) => setUsers(val))
        .catch(() => console.log("Could not retrieve users"));*/
    } else {
      users.forEach((id) => {
        elems.push(<UserPopup ID={id._id} />);
      });
    }
  });

  return <>{elems}</>;
}
