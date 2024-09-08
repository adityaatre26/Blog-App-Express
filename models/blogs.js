const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./users");

const blogSchema = new Schema({
  title: String,
  description: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Blog", blogSchema);
