import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserList.css";
import Customer from "../../../reuseable/Customer";
import { getUsers } from "../../../../util/userUtil";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUsers();

      if (result.success) {
        setUserList(result.data);
      } else {
        console.error("Error fetching users:", result.error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        className="input-group"
        style={{
          margin: "auto",
          marginTop: "10px",
          marginBottom: "10px",
          width: "50%",
        }}
      >
        <span className="input-group-text search-icon">
          <BsSearch />
        </span>
        <input
          className="bar form-control"
          placeholder="Search for customers"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <div className="scroller" style={{ height: "calc(100vh - 140px)" }}>
        <div className="container-fluid px-5">
          <div className="row">
            {userList
              .filter((a, i) => a.username.includes(term))
              .map((user, index) => (
                <div className="col-md-6 justify-content-center" key={index}>
                  <Customer userData={user} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
