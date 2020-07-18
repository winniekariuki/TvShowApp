const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchScheduleSchema = new Schema(
  {
    userEmail: String,
    name: String,
    url: String,
    rating: String,
    summary: String,
    image: String,
    favorite: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WatchSchedule", watchScheduleSchema)