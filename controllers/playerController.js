const Player = require("../model/Player");
const { StatusCodes } = require("http-status-codes");
const { UnAuthorizedError, BadRequestError } = require("../errors/ErrorClass");

// Changing Password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;
  console.log(id);
  try {
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Validate current password
    const isPasswordCorrect = await player.isMatch(currentPassword);
    if (!isPasswordCorrect) {
      throw new UnAuthorizedError("User not authorized");
    }

    // Assign the already hashed newPassword to Player.password
    player.password = newPassword;
    await player.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to update password" });
  }
};

// Logging in
const loginPlayer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Fill out all the necessary fields...");
  }

  const player = await Player.findOne({ email });
  if (!player) {
    throw new UnAuthorizedError("User not Authorized");
  }

  //Check the password if the admin username is found on the database
  const isPasswordCorrect = await player.isMatch(password);
  if (!isPasswordCorrect) {
    throw new UnAuthorizedError("User not Authorized");
  }

  const token = player.createToken();

  res.status(StatusCodes.OK).json({
    token,
    ...{
      _id: player._id,
      firstName: player.firstName,
      lastName: player.lastName,
      email: player.email,
      birthDate: player.birthDate,
      contact: player.contact,
    },
  });
};

// Get all Players
const getAllPlayers = async (req, res) => {
  try {
    const player = await Player.find();
    res.status(200).json({ player });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single Player by ID
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(200).json({ player });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a Player
const updatePlayer = async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body;

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      { email, username, password, displayName },
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res
      .status(200)
      .json({ message: "Player updated successfully", Player: updatedPlayer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a Player
const deletePlayer = async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Register new Player
const registerPlayer = async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body;

    // Check if Player already exists
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User with this email already exists" });
    }

    // Create new Player
    const player = new Player({
      email,
      username,
      password,
      displayName,
    });

    await player.save();

    // Create token
    const token = player.createToken();

    // Send response
    res.status(StatusCodes.CREATED).json({
      token,
      _id: player._id,
      customId: player.customId,
      email: player.email,
      username: player.username,
      displayName: player.displayName,
    });
  } catch (error) {
    console.error("Registration Error:", error.stack);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Registration: Server error", error });
  }
};


module.exports = {
  changePassword,
  loginPlayer,
  getAllPlayers,
  getPlayerById,
  registerPlayer,
  updatePlayer,
  deletePlayer,
};
