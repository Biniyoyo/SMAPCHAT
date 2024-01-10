const mongodb = require("mongodb");
const UserSchema = require("../schema/User.js");
const MapSchema = require("../schema/MapSchema.js");
const PictureMapSchema = require("../schema/PictureMap.js");
const ArrowMapSchema = require("../schema/ArrowMap.js");
const ScaleMapSchema = require("../schema/ScaleMap.js");
const CategoryMapSchema = require("../schema/CategoryMap.js");
const BubbleMapSchema = require("../schema/BubbleMap.js");
const UserModel = require("../model/UserModel.js");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { SUPPORTED_REGIONS } = require("firebase-functions/v1");
const { Types } = mongoose;

class MapModel {
  //1
  static async getMapsUserId(userId) {
    try {
      const user = await UserSchema.findOne({
        _id: userId,
      }).exec();

      if (!user) {
        throw new Error("User not found");
      }

      const mapList = user.mapList || [];
      // Fetch maps using MapID from the mapList
      const maps = await Promise.all(
        mapList.map(async (mapId) => {
          const map = await MapSchema.findOne({ MapID: mapId }).exec();
          return map;
        })
      );

      return maps;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getSpecificMapByMapId(mapID) {
    try {
      const map = await MapSchema.findOne({
        _id: mapID,
      }).exec();

      return map;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getPublicMaps(sort = "date", page = 1, limit = 20) {
    const sorter = sort === "rating" ? { avgRate: -1 } : { date: -1 };

    try {
      const maps = await MapSchema.find({ public: 1 })
        .sort(sorter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      console.log(maps.length);
      return maps;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async searchPublicMapsByQuery(
    query,
    sort = "date",
    page = 1,
    limit = 20
  ) {
    const sorter = sort === "rating" ? { avgRate: -1 } : { date: -1 };

    try {
      const publicMaps = await MapSchema.find({
        public: 1,
        title: { $regex: query, $options: "i" },
      })
        .sort(sorter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec();

      return publicMaps;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getUserMaps(sort = "date", page = 1, limit = 20, user) {
    const sorter = sort === "rating" ? { avgRate: -1 } : { date: -1 };

    try {
      const maps = await MapSchema.find({ owner: user })
        .sort(sorter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      return maps;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async searchUserMapsByQuery(
    query,
    sort = "date",
    page = 1,
    limit = 20,
    user
  ) {
    const sorter = sort === "rating" ? { avgRate: -1 } : { date: -1 };

    try {
      const publicMaps = await MapSchema.find({
        owner: user,
        title: { $regex: query, $options: "i" },
      })
        .sort(sorter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec();

      return publicMaps;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createOrUpdateMap(mapData, graphicData, user) {
    const current =
      mapData._id !== 0 && (await MapSchema.exists({ _id: mapData._id }));
    const currentMap = current
      ? await MapSchema.findOne({ _id: mapData._id })
      : null;
    const thisUser = await UserSchema.findOne({ _id: user });
    mapData.owner = thisUser._id;

    if (!current || !currentMap.owner.equals(thisUser._id)) {
      console.log("Creating map");
      return await this.createMap(mapData, graphicData);
    } else {
      console.log("Updating map");
      return await this.updateMap(mapData, graphicData);
    }
  }

  static async createMap(mapData, graphicData) {
    delete mapData["_id"];
    delete graphicData["_id"];
    const newMap = await MapSchema.create(mapData);
    graphicData.MapID = newMap._id;

    switch (mapData.mapType) {
      case "ArrowMap":
        ArrowMapSchema.create(graphicData);
        break;
      case "BubbleMap":
        BubbleMapSchema.create(graphicData);
        break;
      case "PictureMap":
        PictureMapSchema.create(graphicData);
        break;
      case "CategoryMap":
        CategoryMapSchema.create(graphicData);
        break;
      case "ScaleMap":
        ScaleMapSchema.create(graphicData);
        break;
    }
  }

  static async updateMap(mapData, graphicData) {
    const id = mapData._id;
    delete mapData["_id"];
    await MapSchema.findOneAndUpdate({ _id: id }, mapData);

    console.log(id);
    console.log(mapData);
    console.log(graphicData);

    switch (mapData.mapType) {
      case "ArrowMap":
        await ArrowMapSchema.findOneAndUpdate({ MapID: id }, graphicData);
        break;
      case "BubbleMap":
        await BubbleMapSchema.findOneAndUpdate({ MapID: id }, graphicData);
        break;
      case "PictureMap":
        await PictureMapSchema.findOneAndUpdate({ MapID: id }, graphicData);
        break;
      case "CategoryMap":
        await CategoryMapSchema.findOneAndUpdate({ MapID: id }, graphicData);
        break;
      case "ScaleMap":
        await ScaleMapSchema.findOneAndUpdate({ MapID: id }, graphicData);
        break;
    }
  }

  //16
  static async updatePublicStatus(userId, mapId, isPublic) {
    try {
      const updatedMap = await MapSchema.findOneAndUpdate(
        { MapID: mapId },
        { public: isPublic },
        { new: true }
      );

      if (!updatedMap) {
        throw new Error("Map not found");
      }

      return updatedMap;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //delete
  //17
  static async deleteMap(mapID, user) {
    try {
      const mapData = await MapSchema.findOne({ _id: mapID });
      const thisUser = await UserSchema.findOne({ _id: user });

      if (!mapData) {
        throw new Error("Map does not exist");
      }

      // Must be the owner or an admin to delete a map
      console.log(mapData.owner);
      console.log(thisUser._id);
      if (!mapData.owner.equals(thisUser._id) && thisUser.userType != 1) {
        throw new Error("Delete not permitted");
      }

      await MapSchema.findOneAndDelete({ _id: mapData._id });

      switch (mapData.mapType) {
        case "ArrowMap":
          await ArrowMapSchema.findOneAndDelete({ MapID: mapData._id });
          break;
        case "BubbleMap":
          await BubbleMapSchema.findOneAndDelete({ MapID: mapData._id });
          break;
        case "PictureMap":
          await PictureMapSchema.findOneAndDelete({ MapID: mapData._id });
          break;
        case "CategoryMap":
          await CategoryMapSchema.findOneAndDelete({ MapID: mapData._id });
          break;
        case "ScaleMap":
          await ScaleMapSchema.findOneAndDelete({ MapID: mapData._id });
          break;
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //18
  static async getBubbleMapByMapId(mapID) {
    try {
      console.log(mapID);
      const map = await BubbleMapSchema.findOne({
        MapID: mapID,
      }).exec();

      return map;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //19
  static async getArrowMapByMapId(mapID) {
    try {
      const map = await ArrowMapSchema.findOne({
        MapID: mapID,
      }).exec();

      return map;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //20
  static async getCategoryMapByMapId(mapID) {
    try {
      console.log(mapID);
      const map = await CategoryMapSchema.findOne({
        MapID: mapID,
      }).exec();

      return map;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //21
  static async getScaleMapByMapId(mapID) {
    try {
      console.log(mapID);
      const map = await ScaleMapSchema.findOne({
        MapID: mapID,
      }).exec();

      return map;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getPictureMapByMapId(mapID) {
    try {
      console.log(mapID);
      const map = await PictureMapSchema.findOne({
        MapID: mapID,
      }).exec();

      return map;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = MapModel;
