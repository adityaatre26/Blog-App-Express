const express = require("express");
const Blog = require("../models/blogs");
const router = express.Router();

router.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.render("blogs/index", { blogs });
});

router.post("/", async (req, res) => {
  const newBlog = new Blog(req.body.blog);
  newBlog.author = req.user._id;
  await newBlog.save();

  res.redirect("/blogs");
});

router.get("/new", (req, res) => {
  res.render("blogs/new");
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author");
  console.log(blog.author.username);
  // console.log(currentUser);
  if (!blog) {
    res.redirect("/blogs");
  } else {
    res.render("blogs/show", { blog, currentUser: req.user });
  }
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  res.render("blogs/edit", { blog, currentUser: req.user });
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndUpdate(id, { ...req.body.blog });
  res.redirect("/blogs");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  res.redirect("/blogs");
});

// router.post("/:id/bookmark", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const blog = await Blog.findById(id);
//     const user = req.user;

//     if (!user.bookmarkedBlogs.includes(blog._id)) {
//       user.bookmarkedBlogs.push(blog._id);
//       await user.save();

//       blog.bookmarks.push(user._id);
//       await blog.save();
//     }

//     res.redirect(`/blogs/${id}`);
//   } catch (error) {
//     console.error("Error bookmarking blog:", error);
//     res.status(400).send("Invalid blog ID");
//   }
// });

// // Show all bookmarked blogs
// router.get("/bookmarks", async (req, res) => {
//   if (!req.user) {
//     return res.redirect("/login");
//   }

//   try {
//     const user = await User.findById(req.user._id).populate("bookmarkedBlogs");
//     res.render("blogs/bookmarks", { blogs: user.bookmarkedBlogs });
//   } catch (error) {
//     console.error("Error retrieving bookmarks:", error);
//     res.status(400).send("Error retrieving bookmarks");
//   }
// });

module.exports = router;
