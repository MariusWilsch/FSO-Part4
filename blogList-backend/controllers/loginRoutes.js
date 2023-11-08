const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/userSchema");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  // Find user in database
  const user = await User.findOne({ username });

  // Check if password is correct
  const isPasswordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user || !isPasswordCorrect) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  // Create a json web token containing
  // 1. user's username
  // 2. user's id
  const tokenPayload = {
    username: user.username,
    id: user._id,
  };

  // Sign the token with the secret key and expiration time
  const webToken = jwt.sign(
    tokenPayload,
    process.env.SECRET,
    { expiresIn: 60 * 60 } // 1 hour
  );

  response
    .status(200) // 200 = OK
    .send({ token: webToken, username: user.username, name: user.name });
});

module.exports = loginRouter;
