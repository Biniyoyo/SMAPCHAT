import L from "leaflet";
import locationIcon from "../../../assets/images/location.png";

export const renderArrowMap = (map, data) => {
  if (data == null) {
    return;
  }

  const arrowMapData = convertJsonToArrowMapData(data);
  const processedData = processArrowData(arrowMapData);

  // Marker (pinpoint) drawing on map
  processedData.forEach((point) => {
    // Create a marker with a label for the order number
    const marker = L.marker(point.position, {
      // Use a Leaflet DivIcon to style the label
      icon: new L.DivIcon({
        className: "my-div-icon",
        html: `
        <img src=${locationIcon} width=24px, height=24px></img>
        <div style="width:64px; background:white; border-radius:10px; box-shadow:2px 2px 10px #000000AA;">
        <p style="width:64px; text-align:center;">${point.name}</p>
        </div>`,
        iconAnchor: [12, 24]
      }),
    }).addTo(map);

    // Bind a popup with name and date information
    marker.bindPopup(`<b>${point.name}</b><br>Date: ${point.date}`);
  });

  // Draw the original arrow (polyline)
  L.polyline(
    processedData.map((point) => point.position),
    { color: "#4488FF" }
  ).addTo(map);

  // Function to animate each segment in sequence
  const animateNextSegment = (index) => {
    if (index < processedData.length - 1) {
      animateSegment(
        map,
        processedData[index].position,
        processedData[index + 1].position,
        () => {
          animateNextSegment(index + 1);
        }
      );
    }
  };

  // Start animating from the first segment
  animateNextSegment(0);
};

const convertJsonToArrowMapData = (json) => {
  return json.Location.map((loc, index) => ({
    name: loc.Name,
    lattitude: loc.Lattitude,
    longitude: loc.Longitude,
    order: loc.Order,
    date: loc.Date,
  }));
};

const processArrowData = (arrowMapData) => {
  return arrowMapData
    .sort((a, b) => a.order - b.order)
    .map((point) => ({
      position: [point.lattitude, point.longitude],
      name: point.name,
      order: point.order,
      date: point.date,
    }));
};

// This function deals with animating sequential boldness of arrow
const animateSegment = (map, start, end, onComplete) => {
  let currentWeight = 5; // Initial weight of the line
  const maxWeight = 10; // Max weight when the line is "bold"
  const increaseRate = 0.1; // Rate of weight increase
  const decreaseRate = 0.05; // Rate of weight decrease
  let increasing = true;

  const segment = L.polyline([start, end], {
    color: "#4488FF",
    weight: currentWeight,
  }).addTo(map);

  const animate = () => {
    if (increasing) {
      currentWeight += increaseRate;
      if (currentWeight >= maxWeight) {
        increasing = false;
      }
    } else {
      currentWeight -= decreaseRate;
      if (currentWeight <= 5) {
        map.removeLayer(segment);
        onComplete();
        return;
      }
    }

    segment.setStyle({ weight: currentWeight });
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};
