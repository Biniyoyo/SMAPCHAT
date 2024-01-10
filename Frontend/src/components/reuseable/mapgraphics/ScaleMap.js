import L from "leaflet";

var key;

function isMarkerInsidePolygon(latlng, poly) {
  var inside = false;
  var x = latlng[0],
    y = latlng[1];
  for (var ii = 0; ii < poly.getLatLngs().length; ii++) {
    var polyPoints = poly.getLatLngs()[ii];
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
      var xi = polyPoints[i].lat,
        yi = polyPoints[i].lng;
      var xj = polyPoints[j].lat,
        yj = polyPoints[j].lng;

      var intersect =
        (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
  }

  return inside;
}

// Function to convert value into color based on min, max color
const blendColors = (color1, color2, percentage) => {
  let r = Math.round(
    parseInt(color1.substring(1, 3), 16) * (1 - percentage) +
      parseInt(color2.substring(1, 3), 16) * percentage,
  );
  let g = Math.round(
    parseInt(color1.substring(3, 5), 16) * (1 - percentage) +
      parseInt(color2.substring(3, 5), 16) * percentage,
  );
  let b = Math.round(
    parseInt(color1.substring(5, 7), 16) * (1 - percentage) +
      parseInt(color2.substring(5, 7), 16) * percentage,
  );

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// Boundaries is the array of coordinates that is formed when render map data in MapRenderer.js file
// Function to color a specific boundary based on lat, lng
const colorBoundary = (category, boundaries, map) => {
  boundaries.forEach((boundary) => {
    var inside = false;

    boundary.layer.getLatLngs().forEach((poly) => {
      inside = inside | isMarkerInsidePolygon([category.Lattitude, category.Longitude], L.polygon(poly));
    });
    if (inside) {
      const layer = boundary.layer;
      layer.setStyle({
        fillColor: category.Color,
        fillOpacity: 0.5,
        weight: 2,
      });
      // Add the color changes on map
      layer.bindPopup(`${category.Name}: ${category.Value}`);

      const icon = new L.DivIcon({
        className: "my-div-icon",
        html: `<div style="width:64px; background:white; border-radius:10px; box-shadow:2px 2px 10px #000000AA;">
        <p style="width:64px; text-align:center;">${category.Name}</p>
        </div>
        
        <p style="width:64px; text-align:center; font-size:20px">${category.Value}</p>`,
        iconAnchor: [32, 32],
      });

      L.marker([category.Lattitude, category.Longitude], {icon: icon}).addTo(map);
      map.addLayer(layer);
    } else {
      // console.log("Boundary does not contain the point");
    }
  });
};

// Function to create categories array that contains sample datas
const createCategoriesFromData = (data) => {

  if (!data || !data.Location  || data.Location.length < 1) {
    return;
  }

  const max = data.Location.reduce((a, b) =>
    parseFloat(a.Value) > parseFloat(b.Value) ? a : b,
  ).Value;
  return data.Location.map((location, index) => {
    const scalePercentage = location.Value / max;
    console.log("max: " + max);
    console.log("Percent: " + location.Value / max);
    const categoryColor = blendColors(
      data.MinColor,
      data.MaxColor,
      scalePercentage,
    );

    return {
      CategoryId: index + 1,
      Name: location.Name,
      Value: location.Value,
      Color: categoryColor,
      Lattitude: location.Lattitude,
      Longitude: location.Longitude,
    };
  });
};

// Main function to render the scale map
export const renderScaleMap = (map, data, boundaries, rootMap) => {
  if (!data) {
    console.log("data is not provided for main function");
    return;
  }

  // Categories is array that contains sample data
  const categories = createCategoriesFromData(data);

  // Color boundaries of geojson data, if it contains data's lat,lng
  categories?.forEach((category) => {
    console.log(category);
    colorBoundary(
      category,
      boundaries,
      map,
    );
  });

  if (key)
    rootMap.removeControl(key);

  if (data.Location && data.Location.length > 0)
  {
  key = L.control({
    position: 'bottomright', 
    content: `
    <div style="width:100px; height:100px; color:red;"/>`
  });

  key.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.style = "background:white; padding:5px; border-radius:10px; box-shadow:2px 2px 10px #000000AA;"

    const max = data.Location.reduce((a, b) =>
    parseFloat(a.Value) > parseFloat(b.Value) ? a : b,
    ).Value;

            div.innerHTML = `
                <strong>Scale</strong><br>
                <div style="display:flex; height:16px;">
                  <div style="width:16px; height:16px; margin:0px; margin-right:4px; background:${data.MinColor}"></div> 
                  <p>0</p>
                  <div style="width:16px; height:16px; margin:0px; margin-left:4px; margin-right:4px; background:${data.MaxColor}"></div> 
                  <p>${max}</p>
                </div>`;

    return div;
  };

  key.addTo(rootMap);
}
};