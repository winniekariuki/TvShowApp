const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentTvShowSchema = new Schema(
  {
    comment: String,
    watchScheduleId: {
      type: Schema.Types.ObjectId,
      ref: "WatchSchedule",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommentTvShow", CommentTvShowSchema);