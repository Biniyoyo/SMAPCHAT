import React, { useState, useEffect } from "react";
import MapCard from "./MapCard";
import { Spinner } from "react-bootstrap";
import "./ScrollableGallery.css";
import { Link } from "react-router-dom";

/// A scrollable container for MapCard components. Used for
/// the gallery screens to allow users to scroll through many
/// screens of possible maps to view.
export default function ScrollableGallery(props) {
  // Persist elements through re-render
  const [elements, setElements] = useState([]);
  // tracks which row needs be loaded next
  // each row typically has 3 maps (may change?)
  const [row, setRow] = useState(0);
  const [dataFetched, setDataFetched] = useState(false);
  const [bottom, setBottom] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [lastSort, setLastSort] = useState("date");

  const numberOfColumns = props.numberOfColumns;
  const height = props.height;

  if (props.lastSearch !== lastSearch || props.lastSort !== lastSort) {
    setRow(0);
    setElements([]);
    setBottom(false);
    setDataFetched(false);
    setLastSearch(props.lastSearch);
    setLastSort(props.lastSort);
  }

  const addRowOfMapCards = () => {
    if (bottom || waiting) {
      return;
    }

    setWaiting(true);
    props.fetchFunction(row + 1, numberOfColumns).then((mapDataArray) => {

      setWaiting(false);

      if (
        !mapDataArray ||
        !Array.isArray(mapDataArray) ||
        mapDataArray.length <= 0
      ) {
        setDataFetched(true);
        setBottom(true);
        console.log("No more maps!");
        return;
      }

      const newRow = (
        <div className="row" key={`row-${row}`}>
          {mapDataArray.map((mapData, index) => (
            <MapCard
              key={`row-${row}-card-${index}`}
              numberOfColumns={numberOfColumns}
              mapData={mapData}
            />
          ))}
        </div>
      );

      setDataFetched(true);

      setElements([...elements, newRow]);
      setRow(row + 1);
    });
  };

  // Initial load
  useEffect(() => {
    if (elements.length === 0) {
      console.log(props.fetchFunction);

      // Add two rows to ensure we can scroll
      addRowOfMapCards();
    }
  });

  // This handler handles the scrolling event, which will
  // fetch a new set of maps and create map cards for them
  // when the user is 90% of the way down the current scroll
  const handleScroll = (event) => {
    if (
      event.currentTarget.scrollTop + event.currentTarget.clientHeight >=
      event.currentTarget.scrollTopMax * 0.9
    ) {
      addRowOfMapCards();
    }
  };

  if (dataFetched && elements.length <= 0) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="text-center">
          No maps!<br/>Why not try {" "}
              <Link to="/create-page" style={{ color: "blue" }}>
                creating one?
              </Link>
        </div>
      </div>
    );
  }

  if (dataFetched) {
    return (
      <div
        className="scroller"
        style={{ height: `calc(100vh - ${height}px)` }}
        onScroll={handleScroll}
      >
        {elements}
      </div>
    );
  } else {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only"></span>
          </Spinner>
          <p className="ml-2 mt-2">Loading...</p>
        </div>
      </div>
    );
  }
}
