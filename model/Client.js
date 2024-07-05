const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Fill out the first name"],
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: [true, "Fill out the last name"],
      maxlength: 20,
    },
    password: {
      type: String,
      required: [true, "Fill out the password field"],
      minlength: 5,
    },
    email: {
      type: String,
      required: [true, "Fill out the email field"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Fill out email field",
      ],
      unique: true,
    },
    contact: {
      type: String,
      required: [true, "Fill out the contact number"],
      maxlength: 15,
    },
    birthDate: {
      type: Date,
      required: [true, "Fill out the birth date"],
    }
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password before saving
ClientSchema.pre("save", async function (next) {
  console.log("SAVING>>>>")
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Methods for creating a token
ClientSchema.methods.createToken = function () {
  const token = jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token
};

// Method to compare passwords
ClientSchema.methods.isMatch = async function (reqPassword) {
  const isCorrect = await bcrypt.compare(reqPassword, this.password);
  return isCorrect;
};

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
