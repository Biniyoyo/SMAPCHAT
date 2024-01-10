import { webFetch, webDelete, webPost, webPut } from "./webUtil";
import axios from "axios";
///all map related api
//1

export const fetchSpecificMap = async (mapID) => {
  const apiUrl = `/map/specific/${mapID}`;
  return await webFetch(apiUrl);
};

export const fetchPublicMaps = async (sort, page, limit) => {
  const maps = await webFetch(`/map/public?sort=${sort}&page=${page}&limit=${limit}`);
  console.log("publis maps: ", maps);
  return maps;
};

export const fetchPublicSearchMaps = async (query, sort, page, limit) => {
  return await webFetch(
    `/map/public/search?query=${query}&sort=${sort}&page=${page}&limit=${limit}`
  );
};

export const fetchUserMaps = async (sort, page, limit, user) => {
  return await webFetch(
    `/map/${user}/?sort=${sort}&page=${page}&limit=${limit}`
  );
};

export const fetchUserSearchMaps = async (query, sort, page, limit, user) => {
  return await webFetch(
    `/map/${user}/search?query=${query}&sort=${sort}&page=${page}&limit=${limit}`
  );
};

export const createMap = async (mapData, graphicData) => {
  return await webPost("/map/create", {
    mapData: mapData,
    graphicData: graphicData,
  });
};

export const updateMap = async (userId, mapId, mapData) => {
  const apiUrl = `/map/update`;
  return await webPut(apiUrl, {
    userId,
    mapId,
    mapData,
  });
};
// export const updateMap = async (mapData, graphicData) => {
//   const apiUrl = `/map/update`;
//   return await webPut(apiUrl, {
//     mapData: mapData,
//     graphicData: graphicData,
//   });
// };

export const updateMapStatus = async (userId, mapId, isPublic) => {
  const apiUrl = `/map/statusUpdate`;
  return await webPut(apiUrl, {
    userId,
    mapId,
    isPublic,
  });
};

export const deleteMap = async (mapId) => {
  return await webDelete(`/map/delete/${mapId}`);
};

export const getBubbleMap = async (mapID) => {
  const apiUrl = `/map/get/bubble/${mapID}`;
  return await webFetch(apiUrl);
};

export const getArrowMap = async (mapID) => {
  const apiUrl = `/map/get/arrow/${mapID}`;
  return await webFetch(apiUrl);
};

export const getCategoryMap = async (mapID) => {
  const apiUrl = `${process.env.REACT_APP_URL}/map/get/category/${mapID}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching category map:", error);
    throw error;
  }
};

export const getScaleMap = async (mapID) => {
  const apiUrl = `${process.env.REACT_APP_URL}/map/get/scale/${mapID}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching scale map:", error);
    throw error;
  }
};

export const getPictureMap = async (mapID) => {
  const apiUrl = `/map/get/picture/${mapID}`;
  return await webFetch(apiUrl);
}
