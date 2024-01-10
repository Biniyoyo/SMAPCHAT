import React, { useState, useEffect, useContext } from "react";
import CommentComponent from "./CommentComponent";
import "./ScrollableComments.css";
import { fetchComments } from "../../util/commentUtil";
import { GlobalStoreContext } from "../../contexts/GlobalStoreContext";

/// A scrollable container for Comment components. Used for
/// the vie screen to browse comments
export default function ScrollableComments(props) {
  const { store, setStore } = useContext(GlobalStoreContext);

  const mapId = props.mapId;
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchComments = async (pageNumber) => {
    return await fetchComments(mapId, pageNumber, 20);
  };

  const addComments = async () => {
    if (!hasMoreComments || isLoading) return;
    setIsLoading(true);

    const newComments = await handleFetchComments(page);
    if (newComments && newComments.length > 0) {
      setStore((prevStore) => ({
        ...prevStore,
        currentMapComments: [...newComments],
      }));
      setPage(page + 1);
    } else {
      setHasMoreComments(false);
    }
    setIsLoading(false);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (store.currentMapComments.length === 0) {
      addComments();
    }
  }, [store.currentMapComments]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // This handler handles the scrolling event, which will
  // fetch a new comment  when the user is 90% of the way
  // down the current scroll
  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    const isBottom = scrollTop + clientHeight >= scrollHeight * 0.9;

    if (isBottom && !isLoading) {
      addComments();
    }
  };

  return (
    <>
      {store.currentMapComments && store.currentMapComments.length === 0 ? (
        <div style={{ color: "lightgrey" }}>No Comments</div>
      ) : (
        <div className="scroller" onScroll={handleScroll}>
          {store.currentMapComments.map((comment, index) => (
            <CommentComponent key={`comment-${index}`} {...comment} />
          ))}
        </div>
      )}
    </>
  );
}
