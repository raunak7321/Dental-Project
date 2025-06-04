const PediatricTreatment = require("../Models/pediatricModel");

exports.createPediatricTreatment = async (req, res) => {
  try {
    const pediatric = new PediatricTreatment(req.body);
    await pediatric.save();
    res.status(201).json(pediatric);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating pediatric treatment", error });
  }
};
