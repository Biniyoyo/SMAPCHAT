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

// Function to color a specific boundary based on lat, lng
const colorBoundary = (name, lat, lng, color, boundaries, map) => {
  boundaries.forEach((boundary) => {
    var inside = false;

    boundary.layer.getLatLngs().forEach((poly) => {
      inside = inside | isMarkerInsidePolygon([lat, lng], L.polygon(poly));
    });
    if (inside) {
      boundary.layer.setStyle({
        fillColor: color,
        fillOpacity: 0.5,
        weight: 2,
      });
      boundary.layer.bindPopup(`${name}`);
      map.addLayer(boundary.layer);
    } else {
      console.log("category colorBoundary failed");
    }
  });
};

// Main function to render the category map
export const renderCategoryMap = (map, data, boundaries, rootMap) => {
  if (!data) {
    return;
  }

  data.Category.forEach((category) => {
    category.Locations.forEach((location) => {
      colorBoundary(
        category.Name,
        location.Lattitude,
        location.Longitude,
        category.Color,
        boundaries,
        map,
      );
    });
  });

  if (key)
  rootMap.removeControl(key);

  key = L.control({
    position: 'bottomright', 
    content: `
    <div style="width:100px; height:100px; color:red;"/>`
  });

  key.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.style = "background:white; padding:5px; border-radius:10px; box-shadow:2px 2px 10px #000000AA;"
    var labels = ['<strong>Categories</strong>'];
    
    for (var i = 0; i < data.Category.length; i++) {
    
            div.innerHTML += 
            labels.push(`
                <div style="display:flex; height:16px;">
                  <div style="width:16px; height:16px; margin:0px; margin-right:4px; background:${data.Category[i].Color}"></div> 
                  <p>${data.Category[i].Name}</p>
                </div>`);
    
        }
        div.innerHTML = labels.join('<br>');
    return div;
  };

  key.addTo(rootMap);
};
