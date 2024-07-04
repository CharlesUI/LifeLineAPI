const Client = require("../model/Client");
const { StatusCodes } = require("http-status-codes");
const { UnAuthorizedError, BadRequestError } = require("../errors/ErrorClass");

// Changing Password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;
  console.log(id);
  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Validate current password
    const isPasswordCorrect = await client.isMatch(currentPassword);
    if (!isPasswordCorrect) {
      throw new UnAuthorizedError("User not authorized");
    }

    // Assign the already hashed newPassword to client.password
    client.password = newPassword;
    await client.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to update password" });
  }
};

// Logging in
const loginClient = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Fill out all the necessary fields...");
  }

  const client = await Client.findOne({ email });
  if (!client) {
    throw new UnAuthorizedError("User not Authorized");
  }

  //Check the password if the admin username is found on the database
  const isPasswordCorrect = await client.isMatch(password);
  if (!isPasswordCorrect) {
    throw new UnAuthorizedError("User not Authorized");
  }

  const token = client.createToken();

  res.status(StatusCodes.OK).json({
    token,
    ...{
      _id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      birthDate: client.birthDate,
      contact: client.contact,
    },
  });
};

// Get all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json({ clients });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single client by ID
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ client });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a client
const updateClient = async (req, res) => {
  try {
    const { firstName, lastName, email, birthDate, contact } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, birthDate, contact },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res
      .status(200)
      .json({ message: "Client updated successfully", client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a client
const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Register new client
const registerClient = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contact, birthDate } = req.body;

    // Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User with this email already exists" });
    }

    // Create new client
    const client = new Client({
      firstName,
      lastName,
      email,
      password,
      contact,
      birthDate
    });

    await client.save();

    // Create token
    const token = client.createToken();

    // Send response
    res.status(StatusCodes.CREATED).json({
      token,
      _id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      birthDate: client.birthDate,
      contact: client.contact,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

module.exports = {
  changePassword,
  loginClient,
  getAllClients,
  getClientById,
  registerClient,
  updateClient,
  deleteClient,
};
