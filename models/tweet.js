var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
    body: { type: String, default: "", trim: true, maxlength: 280},
    user: { type: Schema.ObjectId, ref: "User" },
    comments: [
      {
        body: { type: String, default: "", maxlength: 280},
        user: { type: Schema.ObjectId, ref: "User" },
        commenterName: { type: String, default: "" },
        commenterPicture: { type: String, default: ""},
        createdAt: { type: Date, default: Date.now }
      }
    ],
  //  tags: { type: [], get: getTags, set: setTags },
    tags: [String],
    favorites: [{ type: Schema.ObjectId, ref: "User" }],
    favoriters: [{ type: Schema.ObjectId, ref: "User" }], // same as favorites
    favoritesCount: Number,
    createdAt: { type: Date, default: Date.now },
    createdOn: { type: String },    
    likes: [
        {
        user: { type: Schema.ObjectId, ref: "User" }
        }
     ]
  });

  module.exports = mongoose.model("Tweet", TweetSchema);