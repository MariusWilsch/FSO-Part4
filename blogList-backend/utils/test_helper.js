const Blog = require("../models/blogDB");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

const initialBlogs = [
  {
    title: "First Blog",
    author: "John Doe",
    url: "http://example.com/first-blog",
    likes: 5,
  },
  {
    title: "Second Blog",
    author: "Jane Doe",
    url: "http://example.com/second-blog",
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "Test",
    url: "http://example.com/test",
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const getAddedBlog = (blogsInDb, newBlog) => {
  return blogsInDb.find((blog) => blog.title === newBlog.title);
};

const createBlog = async (blogData) => {
  const response = await api
    .post("/api/blogs")
    .send(blogData)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  return response.body;
};

const createUser = async (userData) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);

  const user = new User({
    username: userData.username,
    name: userData.name,
    passwordHash,
  });

  const savedUser = await user.save();
  return savedUser;
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  getAddedBlog,
  createBlog,
  createUser,
};
