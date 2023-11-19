const userRouter = require("express").Router();
const bycrypt = require("bcrypt");
const User = require("../models/userSchema");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("notes", { content: 1, date: 1 });
  response.json(users);
});

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bycrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save(user);

  response.json(savedUser);
});

module.exports = userRouter;
