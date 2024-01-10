import {
  createOrUpdateRate,
  getRatesByMapId,
  deleteRate,
} from "../../../util/ratingUtil";

// const exampleMapId = "65612a9a5a99c4e94572effc"; // Sample MapID
// const exampleUserId = "65612c7a5a99c4e94572f00d"; // Sample UserID
// const exampleRate = 5; // Sample Rate

export const fetchRatesForMap = async (mapId) => {
  const rates = await getRatesByMapId(mapId);
  return rates;
};

export const createRating = async (userId, mapId, rate) => {
  await createOrUpdateRate(userId, mapId, rate);
};

export const deleteRating = async (userId) => {
  await deleteRate(userId);
};
