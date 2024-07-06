const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String },
    // Add more fields as needed
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password before saving
playerSchema.pre("save", async function (next) {
  console.log("SAVING");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Methods for creating a token
playerSchema.methods.createToken = function () {
  const token = jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token;
};

// Method to compare passwords
playerSchema.methods.isMatch = async function (reqPassword) {
  const isCorrect = await bcrypt.compare(reqPassword, this.password);
  return isCorrect;
};

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
