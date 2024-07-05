const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Fill out the username"],
      minlength: 4,
      maxlength: 20,
      unique: true,
    },
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
    email: {
      type: String,
      required: [true, "Fill out the email field"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Fill out email field",
      ],
      unique: true,
    },
    role: {
      type: String,
      required: [true, "Fill out the role"],
      enum: ["super_admin" , "admin"],
      default: "admin",
    },
    contactNumber: {
      type: String,
      required: [true, "Fill out the contact number"],
      maxlength: 15
    },
    password: {
      type: String,
      required: [true, "Fill out the password field"],
      minlength: 8,
    }
  },
  { timestamps: true }
);

//PRE MIDDLEWARE BEFORE REGISTERING NEW ADMIN
AdminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Methods for creating a token
AdminSchema.methods.createToken = function () {
  const token = jwt.sign(
    { adminId: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token
};

AdminSchema.methods.isMatch = async function(reqPassword) {
    const isCorrect = await bcrypt.compare(reqPassword, this.password)
    return isCorrect
}

const AdminModel = mongoose.model("Admin", AdminSchema);

module.exports = AdminModel;
