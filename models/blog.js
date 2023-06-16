const { string } = require("joi");
const mongoose = require("mongoose");

//Complete "creator_id" which is reference to another Mongoose model user.

const blogSchema = mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  tags: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

