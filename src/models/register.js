const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//token generation.........
registerSchema.methods.generateToken = async function () {
  try {
    console.log("data", this);
    const token = jwt.sign(
      { _id: this._id },
      "mmnnmmnhhghhyyyyyyyyyyyyyyyyydree456u6756rrrrrrrddd"
    );
    console.log("token", token);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    console.log(e);
  }
};
//hashing/...........
registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`${this.password}`);
  }

  next();
});
const Register = new mongoose.model("REGISTER", registerSchema);
module.exports = Register;
