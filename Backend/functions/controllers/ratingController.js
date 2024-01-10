const RatingModel = require("../database/model/RatingModel");

exports.getAvgRateByMapId = async (req, res, next) => {
  const { mapId } = req.params;

  try {
    const avgRate = await RatingModel.getAvgRateByMapId(mapId);
    res.json({ avgRate: avgRate });
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.createOrUpdateRate = async (req, res, next) => {
  const { userId, mapId, rate } = req.body;

  try {
    const updatedAvgRate = await RatingModel.createOrUpdateRate(
      userId,
      mapId,
      rate
    );

    if (updatedAvgRate) {
      res.json({ avgRate: updatedAvgRate });
    } else {
      throw new Error("Unable to process rating.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};
exports.deleteRate = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const deletedRates = await RatingModel.deleteRate(userId);
    res.json(deletedRates);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};
