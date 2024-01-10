import React, { useEffect, useState, useContext } from "react";
import RatingDisplay from "../../../reuseable/RatingDisplay";
import { userProfileId } from "../../../../util/userUtil";
import defaultAvatar from "../../../../assets/images/avatar.png"
// Added to bring userId that used in saving rate data
import { AuthContext } from "../../../../contexts/AuthContext";
import { Image } from "react-bootstrap";

const UserInfo = (props) => {
  const [user, setUser] = useState({});

  const { auth } = useContext(AuthContext);
  const userId = auth.user?._id;

  useEffect(() => {
    userProfileId(props.userId).then((val) => setUser(val));
  }, [props.userId]);

  return (
    <div className="row m-0">
      <div className="col-9">
        <div className="row m-0">
          <div className="col-auto">
            
            <Image
              src={user?.avatar}
              style={{width: "45px", height: "45px"}}
              onError={({target}) => target.src = defaultAvatar}
              roundedCircle
              alt="Avatar"
            />

          </div>
          <div className="col d-flex align-items-center">
            <div className="row text-start">
              <div className="h6">
                {props.map.title} By {user?.username ?? "Loading..."}
              </div>
              <div
                style={{
                  fontSize: "14px",
                }}
              >
                {props.map.description}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-3 d-flex align-items-end">
        <div className="row text-end px-3">
          <RatingDisplay
            userId={userId}
            mapId={props.map._id}
            value={props.map.avgRate} // Current average rating
            from="view-map-page"
            clickable={true}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
