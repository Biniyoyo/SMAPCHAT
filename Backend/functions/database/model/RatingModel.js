const mongodb = require("mongodb");
const RatingSchema = require("../schema/RatingSchema.js");
const MapSchema = require("../schema/MapSchema.js");

class RatingModel {
  //get
  static async getAvgRateByMapId(mapId) {
    try {
      const map = await MapSchema.findById(mapId);
      if (!map) {
        throw new Error("Map not found");
      }
      return map.avgRate;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createOrUpdateRate(userId, mapId, rate) {
    try {
      let updatedRate;
      let isNewRate = false;

      // Check if the rate already exists
      const existingRate = await RatingSchema.findOne({
        userID: userId,
        mapID: mapId,
      });

      if (existingRate) {
        // Update the existing rate
        updatedRate = await RatingSchema.findOneAndUpdate(
          { userID: userId, mapID: mapId },
          { rate: rate },
          { new: true }
        );
      } else {
        // Create a new rate
        updatedRate = await RatingSchema.create({
          mapID: mapId,
          userID: userId,
          rate: rate,
        });
        isNewRate = true; // Flag to indicate a new rating has been added
      }

      // Calculate the new average rate
      const rates = await RatingSchema.find({ mapID: mapId });
      const totalRate = rates.reduce((acc, curr) => acc + curr.rate, 0);
      // Differentiate between update and create in average calculation
      const avgRate = isNewRate
        ? (totalRate + rate) / (rates.length + 1)
        : totalRate / rates.length;

      // Update the MapSchema
      await MapSchema.findByIdAndUpdate(mapId, { avgRate: avgRate });

      return avgRate; // Return the new average rate
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //delete
  static async deleteRate(userId) {
    try {
      // Find all ratings to be deleted to get their mapIDs
      const ratingsToDelete = await RatingSchema.find({ userID: userId });
      const mapIds = ratingsToDelete.map((rating) => rating.mapID);

      // Delete the ratings
      await RatingSchema.deleteMany({ userID: userId });

      // Update avgRate for each affected map
      for (const mapId of mapIds) {
        const remainingRatings = await RatingSchema.find({ mapID: mapId });
        let avgRate = 0;

        if (remainingRatings.length > 0) {
          const totalRate = remainingRatings.reduce(
            (acc, curr) => acc + curr.rate,
            0
          );
          avgRate = totalRate / remainingRatings.length;
        }

        await MapSchema.findByIdAndUpdate(mapId, { avgRate: avgRate });
      }

      return {
        success: true,
        message: "Ratings deleted and average rates updated",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = RatingModel;
