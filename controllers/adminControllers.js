const { StatusCodes } = require("http-status-codes");
const Admin = require("../model/Admin");
const { BadRequestError, UnAuthorizedError } = require("../errors/ErrorClass");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  //Create using admin model
  const admin = await Admin.create(req.body);

  //After registration, create a token
  const token = admin.createToken();

  res.status(StatusCodes.OK).json({
    username: admin.username,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    contactNumber: admin.contactNumber,
    role: admin.role,
  });
  // .json({ token, ...{ email: admin.email, adminUser: admin.username } });
};
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Fill out all the necessary fields...");
  }

  const admin = await Admin.findOne({ username });
  if (!admin) {
    throw new UnAuthorizedError("User not Authorized");
  }

  //Check the password if the admin username is found on the database
  const isPasswordCorrect = await admin.isMatch(password);
  if (!isPasswordCorrect) {
    throw new UnAuthorizedError("User not Authorized");
  }

  const token = admin.createToken();

  res.status(StatusCodes.OK).json({
    token,
    ...{
      _id: admin._id,
      username: admin.username,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      contactNumber: admin.contactNumber,
      role: admin.role,
      scheduleDate: admin.scheduleDate,
      availableTime: admin.availableTime,
    },
  });
};

const getAdmins = async (req, res) => {
  const adminList = await Admin.find({});

  res.status(StatusCodes.OK).json(adminList);
};

const deleteAdmin = async (req, res) => {
  const { id: adminId } = req.params;

  const deleteAdmin = await Admin.findOneAndDelete({ _id: adminId });

  if (!deleteAdmin) {
    throw new NotFoundError("Admin does not exist...");
  }

  const updatedAdminList = await Admin.find({});

  res.status(StatusCodes.OK).json({ updatedAdminList });
};

const updateAdmin = async (req, res) => {
  const { id: adminId } = req.params;
  const { body } = req;

  const updateFields = {};

  // {"username":"salmonela","firstName":"Sallyfghsdgfsdg","lastName":"Doe","contactNumber":"+639270298872","scheduleDate":"T - TH","availableTime":"6AM - 6PM","email":"sdfasdfas@gmail.com","password":"","role":"admin"}

  if (body.username) updateFields.username = body.username;
  if (body.firstName) updateFields.firstName = body.firstName;
  if (body.lastName) updateFields.lastName = body.lastName;
  if (body.email) updateFields.email = body.email;
  if (body.role) updateFields.role = body.role;
  if (body.contactNumber) updateFields.contactNumber = body.contactNumber;
  if (body.scheduleDate) updateFields.scheduleDate = body.scheduleDate;
  if (body.availableTime) updateFields.availableTime = body.availableTime;

  if (body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    updateFields.password = hashedPassword;
  }

  const updatedAdmin = await Admin.findOneAndUpdate(
    { _id: adminId },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedAdmin) {
    throw new NotFoundError("Admin does not exist...");
  }

  const updatedAdminList = await Admin.find({});
  console.log("updated", updatedAdminList);
  res.status(StatusCodes.OK).json(updatedAdminList);
};

module.exports = {
  register,
  login,
  getAdmins,
  deleteAdmin,
  updateAdmin,
};
