import { kml } from "@tmcw/togeojson";
var shapefile = require("shapefile");

//functions for haldning shp file upload
async function handleFileUploadForShp(files) {
  // Check if there are exactly 2 files
  if (files.length !== 2) {
    alert("Please upload exactly 2 files: a .shp and a .dbf file.");
    return;
  }

  var shp, dbf;

  Array.from(files).forEach((file) => {
    if (file.name.endsWith(".shp")) {
      shp = file;
    } else if (file.name.endsWith(".dbf")) {
      dbf = file;
    }
  });

  // Check if both .shp and .dbf files are present
  if (!shp || !dbf) {
    alert("Both .shp and .dbf files are required.");
    return;
  }

  const shpReader = shp.stream().getReader();
  const dbfReader = dbf.stream().getReader();

  const geoJson = await shapefile.read(shpReader, dbfReader);

  if (
    !geoJson ||
    !Array.isArray(geoJson.features) ||
    geoJson.features.length === 0
  ) {
    throw new Error("Invalid or mismatched .shp and .dbf files.");
  }

  return geoJson;
}

// handler for KML file uploads
function handleFileUploadForKml(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const kmlText = e.target.result;
      const pars = new DOMParser();
      const kmlDoc = pars.parseFromString(kmlText, "text/xml");
      const converted = kml(kmlDoc);

      resolve(converted);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
}

//functions for handling GeoJSON file upload
function handleFileUploadForGeoJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);

      resolve(data);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
}

export function handleFileUpload(files) {
  const first = files[0];

  if (first.name.endsWith(".kml")) {
    return handleFileUploadForKml(first);
  }

  if (first.name.endsWith(".json") || first.name.endsWith(".geojson")) {
    return handleFileUploadForGeoJson(first);
  }

  if (first.name.endsWith(".dbf") || first.name.endsWith(".shp")) {
    return handleFileUploadForShp(files);
  }
}
