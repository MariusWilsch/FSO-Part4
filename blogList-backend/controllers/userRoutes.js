const userRouter = require("express").Router();
const bycrypt = require("bcrypt");
const User = require("../models/userSchema");

userRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", { title: 1, url: 1 });
	response.json(users);
});

userRouter.post("/", async (req, res) => {
	const { username, name, password } = req.body;

	// Convert password to hash
	const saltRounds = 10;
	const passwordHash = await bycrypt.hash(password, saltRounds);

	// Create new user using the User model
	const user = new User({
		username,
		name,
		passwordHash,
	});

	res.json(await user.save());
});

module.exports = userRouter;
