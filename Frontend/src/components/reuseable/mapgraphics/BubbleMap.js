import L from "leaflet";

export const renderBubbleMap = (map, data) => {
  if (data == null) {
    return;
  }

  const bubbleMapData = convertJsonToBubbleMapData(data);

  bubbleMapData.forEach((point) => {
    const bubbleColor = point.color;
    const bubbleRadius = sizeToRadius(point.size);

    L.circle([point.lattitude, point.longitude], {
      color: bubbleColor,
      fillColor: bubbleColor,
      fillOpacity: 0.5,
      radius: bubbleRadius,
    })
      .addTo(map)
      .bindPopup(point.name);

      const icon = new L.DivIcon({
        className: "my-div-icon",
        html: `
        <div style="width:64px; background:white; border-radius:10px; box-shadow:2px 2px 10px #000000AA;">
        <p style="width:64px; text-align:center;">${point.name}</p>
        </div>`
      });

      L.marker([point.lattitude, point.longitude], {icon: icon}).addTo(map);
  });
};

const convertJsonToBubbleMapData = (json) => {
  return json.Location.map((loc) => ({
    name: loc.Name,
    lattitude: loc.Lattitude,
    longitude: loc.Longitude,
    color: loc.Color,
    size: parseInt(loc.Size, 10), // Assuming size is a string in JSON
  }));
};

const sizeToRadius = (size) => {
  if (isNaN(size) || size === null || size === "") {
    size = 1; // default size when input is invalid or empty
  }
  const minSize = 1;
  const maxSize = 10;
  const minRadius = 100;
  const maxRadius = 1000;
  return (
    ((size - minSize) / (maxSize - minSize)) * (maxRadius - minRadius) +
    minRadius
  );
};
