const blogRouter = require("express").Router();
const Blog = require("../models/blogDB");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

function getTokenFrom(req) {
  // Get the token from the Authorization header
  const authorization = req.get("authorization");
  // If the token exists and starts with 'Bearer ', return the token
  if (authorization && authorization.startsWith("Bearer "))
    return authorization.substring(7);
  return null;
}

blogRouter.get("/", async (req, res, next) => res.json(await Blog.find({})));

blogRouter.post("/", async (req, res) => {
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  // If the user id is not found, return an error
  if (!decodedToken.id) next(error);

  // Get the user from the database
  const user = User.findById(decodedToken.id);

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: user._id,
  });

	// WHY IS THE TOJSON NOT BEING CALLED BUT IN MY NOTES APPLICATION IT'S WORKING WITHOUT CALLING THE TSJON
	const savedBlog = await blog.save();
	console.log(savedBlog);
  user.blog = user.blog.concat(savedBlog._id);
  await user.save();
  res.status(201).json();
});

blogRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogRouter.put("/:id", async (req, res) => {
  const { title, author, url, likes } = req.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" }
  );
  updatedBlog ? res.json(updatedBlog) : res.status(404).end();
});

module.exports = blogRouter;
