import L from "leaflet";
import locationIcon from "../../../assets/images/location.png";

export const renderPictureMap = (map, data) => {
  if (data == null) {
    return;
  }

  const transformedLocations = data.Location.map((loc) => ({
    name: loc.Name,
    libraryIds: loc.Library.map((lib) => lib.Name),
    longitude: loc.Longitude.toString(),
    lattitude: loc.Lattitude.toString(),
  }));

  const transformedLibraries = data.Location.flatMap((loc) =>
    loc.Library.map((lib) => ({
      name: lib.Name,
      images: lib.Images,
    }))
  );

  transformedLocations.forEach((location) => {
    createMarkerForLocation(map, location, transformedLibraries);
  });
};

function createMarkerForLocation(map, location, libraries) {

  const iconUrl = findMatchingLibraries(location, libraries)[0]?.images[0] ?? locationIcon;

  const icon = new L.DivIcon({
    className: "my-div-icon",
    html: `
    <div style="width:64px; height:64px; background:white; border-radius:10px; box-shadow:2px 2px 10px #000000AA;">
    <img src=${iconUrl} width=56px, height=56px, style="width:56px; height:56px; margin: 4px; border-radius:10px;"></img>
    </div>`,
    iconAnchor: [32, 32],
  });

  const marker = L.marker(
    [parseFloat(location.lattitude), parseFloat(location.longitude)],
    { icon: icon }
  ).addTo(map);

  const matchingLibraries = findMatchingLibraries(location, libraries);
  const popupContent = createPopupContent(location, matchingLibraries);

  marker.bindPopup(popupContent);
}

/*function createCustomIcon(locationName) {
  return L.divIcon({
    html: `<div style="background-color: black; padding: 5px; border-radius: 100%; text-align: center;">${locationName}</div>`,
    className: "custom-div-icon",
  });
}*/

function findMatchingLibraries(location, libraries) {
  return libraries.filter((lib) => location.libraryIds.includes(lib.name));
}

function createPopupContent(location, libraries) {
  const popupContent = document.createElement("div");
  const firstLibrary = libraries[0];

  if (firstLibrary && firstLibrary.images.length > 0) {
    const firstImage = createFirstImageElement(firstLibrary);
    popupContent.appendChild(firstImage);

    const locationName = createLocationNameElement(location);
    popupContent.appendChild(locationName);

    setupImageClickEvent(firstImage, libraries, popupContent);
  }

  return popupContent;
}

function createFirstImageElement(library) {
  const firstImage = document.createElement("img");
  firstImage.src = library.images[0];
  firstImage.style.maxWidth = "100px";
  firstImage.style.cursor = "pointer";
  return firstImage;
}

function createLocationNameElement(location) {
  const locationName = document.createElement("div");
  locationName.textContent = location.name;
  return locationName;
}

function setupImageClickEvent(imageElement, libraries, popupContent) {
  imageElement.onclick = () => {
    const gridContainer = createGridContainer(libraries);
    popupContent.innerHTML = "";
    popupContent.appendChild(gridContainer);
  };
}

function createGridContainer(libraries) {
  const gridContainer = document.createElement("div");
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
  gridContainer.style.gap = "10px";
  gridContainer.style.maxWidth = "200px";

  libraries.forEach((lib) => {
    appendLibraryImagesToGrid(lib, gridContainer);
  });

  return gridContainer;
}

function appendLibraryImagesToGrid(library, gridContainer) {
  const libraryName = document.createElement("div");
  libraryName.textContent = library.name;
  gridContainer.appendChild(libraryName);

  library.images.forEach((imageUrl) => {
    const img = document.createElement("img");
    img.src = imageUrl;
    // Set a fixed height and width for the images
    img.style.height = "50px";
    img.style.width = "50px";
    img.style.objectFit = "cover";
    img.style.marginBottom = "10px";
    gridContainer.appendChild(img);
  });
}
