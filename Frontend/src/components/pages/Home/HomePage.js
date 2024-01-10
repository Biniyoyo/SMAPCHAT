import React from "react";
import { useState } from "react";
import "./HomePage.css";
import ScrollableGallery from "../../reuseable/ScrollableGallery";
import SearchWidget from "../../reuseable/SearchWidget";
import { fetchPublicMaps, fetchPublicSearchMaps } from "../../../util/mapUtil";

const HomePage = () => {
  const fetchData = async (page, limit) => {
    try {
      if (!searchTerm) {
        return await fetchPublicMaps(sortTerm, page, limit);
      } else {
        return await fetchPublicSearchMaps(searchTerm, sortTerm, page, limit);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [sortTerm, setSortTerm] = useState("date");

  const setSearch = (value) => {
    if (value !== searchTerm) {
      setSearchTerm(value);
    }
  };

  const setSort = (value) => {
    console.log(value);
    if (value !== sortTerm) {
      setSortTerm(value);
    }
  };

  return (
    <div className="container-fluid mt-4">
      {/* remove height and color from the css when you add components */}

      <div className="row justify-content-center">
        <div className="left">
          <ScrollableGallery
            numberOfColumns={10}
            height={125}
            fetchFunction={fetchData}
            lastSearch={searchTerm}
            lastSort={sortTerm}
          />
        </div>

        <div className="right">
          <SearchWidget setSearchTerm={setSearch} setSortTerm={setSort} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
