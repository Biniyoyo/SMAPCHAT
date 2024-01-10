import { useState, useContext, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import {
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsHandThumbsDown,
  BsHandThumbsDownFill,
} from "react-icons/bs";
import "./Comment.css";
import AuthContext from "../../contexts/AuthContext";
import {
  handleDislikeComment,
  handleLikeComment,
} from "../../util/commentUtil";
import { GlobalStoreContext } from "../../contexts/GlobalStoreContext";
import { userProfileId } from "../../util/userUtil";

/// Component which displays a single comment. Takes the
/// ID of the desired comment as a string in the ID prop.
export default function CommentComponent(props) {
  const { auth } = useContext(AuthContext);
  const { store, setStore } = useContext(GlobalStoreContext);
  const user = auth.user;

  const [owner, setOwner] = useState({});

  useEffect(() => {
    userProfileId(props.commenterId).then((e) => setOwner(e));
  }, [props.commenterId])

  const isLiked = (comment) => {
    if (user != null) {
      return comment.likes.some((id) => id === user._id);
    }
    return false;
  };

  const isDisliked = (comment) => {
    if (user != null) {
      return props.disLikes.some((id) => id === user._id);
    }
    return false;
  };

  const handleLike = async () => {
    if (user === null) {
      alert("You need to sign in in order to like and dislike comments!");
    } else {
      const response = await handleLikeComment(user._id, props._id);
      if (response.error) {
        alert("something went wrong while hamdling like button");
      } else {
        const updatedComments = store.currentMapComments.map((comment) => {
          if (comment._id === props._id) {
            const updatedDislikes = comment.disLikes.filter(
              (id) => id !== user._id
            );
            const updatedLikes = comment.likes.includes(user._id)
              ? comment.likes
              : [...comment.likes, user._id];

            return {
              ...comment,
              disLikes: updatedDislikes,
              likes: updatedLikes,
            };
          }
          return comment;
        });

        setStore((prevStore) => ({
          ...prevStore,
          currentMapComments: updatedComments,
        }));
      }
    }
  };

  const handleDislike = async () => {
    if (user === null) {
      alert("You need to sign in in order to like and dislike comments!");
    } else {
      const response = await handleDislikeComment(user._id, props._id);
      if (response.error) {
        alert("something went wrong while hamdling like button");
      } else {
        const updatedComments = store.currentMapComments.map((comment) => {
          if (comment._id === props._id) {
            const updatedLikes = comment.likes.filter((id) => id !== user._id);
            const updatedDislikes = comment.disLikes.includes(user._id)
              ? comment.disLikes
              : [...comment.disLikes, user._id];

            return {
              ...comment,
              disLikes: updatedDislikes,
              likes: updatedLikes,
            };
          }
          return comment;
        });

        setStore((prevStore) => ({
          ...prevStore,
          currentMapComments: updatedComments,
        }));
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="Comment">
      <Image
        className="Avatar"
        src={
          props.commenterAvatar === ""
            ? require("../../assets/images/avatar.png")
            : owner.avatar
        }
        roundedCircle
      />
      <Card style={{ width: "100%", border: "none" }}>
        <Card.Body>
          <Card.Title className="text-start">
            {owner.username ?? "Loading..."}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted text-start">
            {" "}
            {props.likes.length - props.disLikes.length} likes *{" "}
            {formatDate(props.date)}
          </Card.Subtitle>
          <Card.Text className="text-start">{props.content}</Card.Text>
        </Card.Body>
      </Card>

      <div className="Rating">
        <div onClick={handleLike}>
          {isLiked(props) ? (
            <BsHandThumbsUpFill className="Button" />
          ) : (
            <BsHandThumbsUp className="Button" />
          )}
        </div>
        <div onClick={handleDislike}>
          {isDisliked(props) ? (
            <BsHandThumbsDownFill className="Button" />
          ) : (
            <BsHandThumbsDown className="Button" />
          )}
        </div>
      </div>
    </div>
  );
}
