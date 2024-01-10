import { useEffect, useState, useContext } from "react";
import MapRenderer from "./MapRenderer";
import RatingDisplay from "./RatingDisplay";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { userProfileId } from "../../util/userUtil";
import { Spinner } from "react-bootstrap";
// Added to bring userId that used in saving rate data
import {
  getArrowMap,
  getBubbleMap,
  getPictureMap,
  getCategoryMap,
  getScaleMap,
} from "../../util/mapUtil";
import { AuthContext } from "../../contexts/AuthContext";
import "./MapCard.css";

export default function MapCard(props) {
  // The map data that this card is displaying
  const [mapData] = useState(props.mapData);
  const [mapUser, setMapUser] = useState(null);
  const numberOfColumns = props.numberOfColumns;

  const [graphicData, setGraphicData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { auth } = useContext(AuthContext);
  const userId = auth.user?._id;

  const navigate = useNavigate();

  let cardWidth = 45;

  if (numberOfColumns === 2) {
    cardWidth = 45;
  } else if (numberOfColumns === 3) {
    cardWidth = 30;
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (mapData.owner != null)
      userProfileId(mapData.owner).then((val) => setMapUser(val));
    else setMapUser({ username: "Unknown" });

    if (graphicData == null) populatePreview();
  }, [mapData]);
  /* eslint-enable react-hooks/exhaustive-deps */
  
  const populatePreview = async () => {

    setGeoData(await (await fetch(mapData.mapFile)).json());

    switch (mapData.mapType) {
      case "ArrowMap":
        setGraphicData(await getArrowMap(mapData._id));
        break;
      case "BubbleMap":
        setGraphicData(await getBubbleMap(mapData._id));
        break;
      case "PictureMap":
        setGraphicData(await getPictureMap(mapData._id));
        break;
      case "CategoryMap":
        setGraphicData(await getCategoryMap(mapData._id));
        break;
      case "ScaleMap":
        setGraphicData(await getScaleMap(mapData._id));
        break;
      default:
        break;
    }

    setLoading(false);
  };

  const handleRouteToViewMapPage = () =>
    navigate(`/view-map-page/${mapData._id}`);

  const renderer = loading ? (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "300px" }}
    >
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only"></span>
        </Spinner>
        <p className="ml-2 mt-2">Loading preview...</p>
      </div>
    </div>
  ) : (
    <MapRenderer
      width="100%"
      height="300px"
      mapType={mapData.mapType}
      Geometry={geoData}
      GeoJsonData={graphicData}
    />
  );

  return (
    <Card
      className="m-3 "
      style={{ width: `${cardWidth}%` }}
      onClick={handleRouteToViewMapPage}
    >
      {renderer}
      <RatingDisplay
        userId={userId}
        mapId={props.mapData._id}
        value={props.mapData.avgRate}
        from="map-card"
      />{" "}
      <Card.Body
        className=""
        style={{ backgroundColor: "#0C0D34", color: "white" }}
      >
        <Card.Title>{mapData.title ?? "Loading..."}</Card.Title>
        <Card.Text>
          by {mapUser?.username ?? "Loading..."} on {mapData.date}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
