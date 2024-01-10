const MapModel = require("../database/model/MapModel");
const UserModel = require("../database/model/UserModel");

exports.getMapsByUserId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await MapModel.getMapsUserId(id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getSpecificMap = async (req, res, next) => {
  const { mapID } = req.params;

  try {
    const specificMap = await MapModel.getSpecificMapByMapId(mapID);
    res.status(200).json(specificMap);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};

exports.getPublicMaps = async (req, res, next) => {
  const { sort = "date", page = 1, limit = 20 } = req.query;

  try {
    const maps = await MapModel.getPublicMaps(sort, page, limit);
    res.status(200).json(maps);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.searchPublicMapsByQuery = async (req, res, next) => {
  const { query, sort = "date", page = 1, limit = 2 } = req.query;

  try {
    const publicMaps = await MapModel.searchPublicMapsByQuery(
      query,
      sort,
      page,
      limit
    );
    res.status(200).json(publicMaps);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("Server Error");
  }
};

exports.getUserMaps = async (req, res, next) => {
  const { userId } = req.params;
  const { sort, page, limit } = req.query;

  try {
    const userMaps = await MapModel.getUserMaps(sort, page, limit, userId);
    res.status(200).json(userMaps);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.searchUserMapsByQuery = async (req, res, next) => {
  const { userId } = req.params;
  const { query, sort = "date", page = 1, limit = 2 } = req.query;

  try {
    const userMaps = await MapModel.searchUserMapsByQuery(
      query,
      sort,
      page,
      limit,
      userId
    );
    res.status(200).json(userMaps);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.createMap = async (req, res, next) => {
  if (!req.user) {
    res.status(401).send("Please sign in or create user account!");
  }

  const { mapData, graphicData } = req.body;
  const user = req.user;

  console.log("createMap user");
  console.log(req.user);

  try {
    await MapModel.createOrUpdateMap(mapData, graphicData, user);
    res.json({ mapData, graphicData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error when creating map");
  }
};

exports.updateMap = async (req, res, next) => {
  const { mapData, graphicData } = req.body;
  try {
    const result = await MapModel.updateMap(mapData, graphicData);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.updatePublicStatus = async (req, res, next) => {
  const { userId, mapId, isPublic } = req.body;

  try {
    const result = await MapModel.updatePublicStatus(userId, mapId, isPublic);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.deleteMapByMapId = async (req, res, next) => {
  const { mapID } = req.params;
  const user = req.user;

  try {
    const result = await MapModel.deleteMap(mapID, user);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getBubbleMap = async (req, res, next) => {
  const { mapID } = req.params;

  try {
    const result = await MapModel.getBubbleMapByMapId(mapID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getArrowMap = async (req, res, next) => {
  const { mapID } = req.params;

  try {
    const result = await MapModel.getArrowMapByMapId(mapID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getCategoryMap = async (req, res, next) => {
  const { mapID } = req.params;

  try {
    const result = await MapModel.getCategoryMapByMapId(mapID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getScaleMap = async (req, res, next) => {
  const { mapID } = req.params;

  try {
    const result = await MapModel.getScaleMapByMapId(mapID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getPictureMap = async (req, res, next) => {
  const { mapID } = req.params;

  try {
    const result = await MapModel.getPictureMapByMapId(mapID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};
