const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blog'
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);