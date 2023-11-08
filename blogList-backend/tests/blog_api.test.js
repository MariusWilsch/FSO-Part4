const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Import your express app
const Blog = require("../models/blogDB"); // Import your Blog model
const User = require("../models/userSchema"); // Import your User model
const bcrypt = require("bcrypt");
const helper = require("../utils/test_helper"); // Import your test helper

const api = supertest(app);

// This will be run before each test
beforeEach(async () => {
  await Blog.deleteMany({}); // Clear the database
  await Blog.insertMany(helper.initialBlogs); // Insert initial blogs
});

describe("GET /api/blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    // Use the helper function to get the number of blogs in the database
    const blogsInDatabase = await helper.blogsInDb();
    expect(response.body).toHaveLength(blogsInDatabase.length);
  });

  test('unique identifier property of the blog post is named "id"', async () => {
    const response = await api.get("/api/blogs");

    // Check that the first blog has an 'id' property and does not have an '_id' property
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBeUndefined();
  });
});

describe("POST /api/blogs", () => {
  let token = null;

  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      name: "Root User",
      passwordHash,
    });

    await user.save();

    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });

    token = response.body.token;
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "New Blog",
      author: "Test Author",
      url: "https://test.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsInDb = await helper.blogsInDb();
    expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsInDb.map((b) => b.title);
    expect(titles).toContain("New Blog");
  });

  test("blog without token is not added", async () => {
    const newBlog = {
      title: "New Blog",
      author: "Test Author",
      url: "https://test.com",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsInDb = await helper.blogsInDb();
    expect(blogsInDb).toHaveLength(helper.initialBlogs.length);
  });
});

// * Refactor this test (Using SKIP to skip the test)
describe("DELETE /api/blogs/:id", () => {
  test.skip("a blog can be deleted", async () => {
    // First, add a new blog
    const newBlog = {
      title: "Blog to delete",
      author: "Test Author",
      url: "http://example.com/delete-blog",
      likes: 0,
    };
    const addedBlog = await helper.createBlog(newBlog);

    // Then, delete the blog
    await api.delete(`/api/blogs/${addedBlog.body.id}`).expect(204);

    // Check that the blog was deleted
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const titles = blogsAtEnd.map((n) => n.title);
    expect(titles).not.toContain(newBlog.title);
  });
});

// * Refactor this test (Using SKIP to skip the test)
describe("PUT /api/blogs/:id", () => {
  test.skip("a blog can be updated", async () => {
    // First, add a new blog
    const newBlog = {
      title: "Blog to update",
      author: "Test Author",
      url: "http://example.com/update-blog",
      likes: 0,
    };

    const addedBlog = await helper.createBlog(newBlog);

    // Then, update the blog
    const updatedBlogData = {
      title: "Updated Blog",
      author: "Updated Author",
      url: "http://example.com/updated-blog",
      likes: 10,
    };
    const updatedBlog = await api
      .put(`/api/blogs/${addedBlog.body.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Check that the blog was updated
    expect(updatedBlog.body).toEqual(expect.objectContaining(updatedBlogData));
  });
});

describe("POST /api/login", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      name: "Root User",
      passwordHash,
    });

    await user.save();
  });
  test("responds with token, username, and name when given valid credentials", async () => {
    const validUser = {
      username: "root",
      password: "sekret",
    };

    const response = await api
      .post("/api/login")
      .send(validUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe(validUser.username);
    expect(response.body.name).toBeDefined();
  });

  test("responds with status code 401 and error message when given invalid credentials", async () => {
    const invalidUser = {
      username: "root",
      password: "wrongpassword",
    };

    const response = await api
      .post("/api/login")
      .send(invalidUser)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toBe("invalid username or password");
  });
});

// describe("when there is initially one user in db", () => {
//   beforeEach(async () => {
//     await User.deleteMany({});

//     const user = {
//       username: "root",
//       password: "sekret",
//     };

//     await helper.createUser(user);
//   });

//   test("creation succeeds with a fresh username", async () => {
//     const usersAtStart = await helper.usersInDb();

//     const newUser = {
//       username: "mluukkai",
//       name: "Matti Luukkainen",
//       password: "salainen",
//     };

//     await helper.createUser(newUser);

//     const usersAtEnd = await helper.usersInDb();
//     expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

//     const usernames = usersAtEnd.map((u) => u.username);
//     expect(usernames).toContain(newUser.username);
//   });
// });

// This will be run after all tests
afterAll(() => {
  mongoose.connection.close();
});
