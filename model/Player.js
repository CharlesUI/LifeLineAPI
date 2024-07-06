const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Custom ID generator function
function generateCustomId() {
  const digits = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';

  // Generate 11 random digits
  for (let i = 0; i < 11; i++) {
    id += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  // Append a random capital letter
  id += letters.charAt(Math.floor(Math.random() * letters.length));

  return id;
}

const playerSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String },
    // Add more fields as needed
  },
  { timestamps: true }
);

// Pre-save middleware to generate a custom ID and hash the password before saving
playerSchema.pre("save", async function (next) {
  // Generate custom ID if not already set
  if (!this.customId) {
    let isUnique = false;
    while (!isUnique) {
      const newId = generateCustomId();
      const existingPlayer = await mongoose.models.Player.findOne({ customId: newId });
      if (!existingPlayer) {
        this.customId = newId;
        isUnique = true;
      }
    }
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Methods for creating a token
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
