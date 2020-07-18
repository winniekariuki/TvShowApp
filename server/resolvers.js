const { paginateResults } = require("./utils");
const jwt = require("jsonwebtoken");
const User = require("./models/users");
const WatchSchedule = require("./models/watchSchedule");
const CommentTvShow = require("./models/comments");

module.exports = {
  Query: {
    tvshows: async (_, { pageSize, after }, { dataSources }) => {
      const allTVShows = await dataSources.TvShowAPI.getAllTVShows();
      // we want these in reverse chronological order
      allTVShows.reverse();
      // return { results: allTVShows }
      const tvshows = paginateResults({
        after,
        pageSize,
        results: allTVShows,
      });
      return {
        tvshows,
        cursor: tvshows.length ? tvshows[tvshows.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: tvshows.length
          ? tvshows[tvshows.length - 1].cursor !==
            allTVShows[allTVShows.length - 1].cursor
          : false,
      };
    },
    tvshow: async (_, { id }, { dataSources }) => {
      return await dataSources.TvShowAPI.getTVShowById(id);
    },
    users: (_, __, { dataSources }) => dataSources.userAPI.getUsers(),

    // get user watch schedule
    getWatchSchedule: async (_, { email }, {}) => {
      let response = {};

      // check if user exists
      await WatchSchedule.aggregate([
        { $match: { userEmail: email } },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]).then((schedule) => {
        if (!schedule || schedule.length === 0) {
          response = {
            message: "User Doesn't exist",
            status: "error",
          };
        }
        response = {
          message: "User Watch Schedule",
          status: "success",
          getWatchSchedule: schedule,
        };
      });
      return response;
    },

    // get single watch schedule
    getSingleWatchSchedule: async (_, { id }, {}) => {
      let response = {};

      // check if user exists
      await WatchSchedule.findById({ _id: id }).then((schedule) => {
        // no schedule found
        if (!schedule) {
          response = {
            status: "error",
            message: "You don't have any watch schedule",
          };
          return response;
        }

        // return single watch schedule
        response = {
          status: "success",
          message: "Single TV Show",
          url: schedule.url,
          name: schedule.name,
          image: schedule.image,
          summary: schedule.summary,
          rating: schedule.rating,
          favorite: schedule.favorite,
          _id: schedule._id,
        };
        return response;
      });
      return response;
    },

    // get all comments on a specific tv show on the user watch schedule
    getTvShowComment: async (_, { watchScheduleId }, {}) => {
      let response = {};

      await CommentTvShow.find({ watchScheduleId }).sort({createdAt:-1}).then((comments) => {
        if (comments.length === 0) {
          response = {
            status: "error",
            message: "TV Show Doesn't exists",
          };
          return response;
        }

        response = {
          status: "success",
          message: "Comments on this TV Show",
          getTvShowComment: comments,
        };

        return response;
      });
      return response;
    },

    // search tv show by name
    searchTvShowByName: async(_, { name },  { dataSources }) => {
      const res = await dataSources.TvShowAPI.searchTVShowByName(name)
      return {
        tvshows: res
      }
    }
  },
  Mutation: {
    login: async (_, { email, password }, {}) => {
      let response = {};
      await User.findOne({ email }).then((user) => {
        if (!user) {
          response = { message: "Email Does not exists", status: "failed" };
          return response;
        }

        // ensure password match
        if (user.password !== password) {
          response = { message: "Wrong Password", status: "failed" };
          return response;
        }

        // details correct, generate token and login user
        const token = jwt.sign(
          { id: user._id, email: user.email },
          "secret_key",
          { expiresIn: 60 * 60 }
        );
        response = { token, message: "Login successful", status: "success" };
        return response;
      });
      return response;
    },
    createUSer: async (_, { email, password, username }, {}) => {
      let response = {};

      // check if user exist
      await User.findOne({ email }).then((user) => {
        if (user) {
          response = { message: "Email Already exists" };
          return response;
        }

        // create/register new user
        const newUser = new User({ email, password, username });
        newUser.save();
        response = {
          message: "User Created Successfully",
        };
        return response;
      });
      return response;
    },
    favoriteTvShow: async (_, { id }, {}) => {
      let response = {};
      // check if tv show exists in db
      await WatchSchedule.findByIdAndUpdate(
        { _id: id },
        { favorite: true }
      ).then((updatedSchedule) => {
        if (!updatedSchedule) {
          response = {
            status: "error",
            message: "TV Show isn't in your schedule.",
          };
          return response;
        }

        // if it has already been added
        if (updatedSchedule.favorite === true) {
          response = {
            status: "collision",
            message: "TV Show is already in favorites!!!!!!!",
          };
          return response;
        }

        response = {
          status: "success",
          message: "TV Show Added to favorites",
        };
        return response;
      });
      return response;
    },
    createWatchSchedule: async (
      _,
      { url, email, name, image, summary, rating },
      {}
    ) => {
      let response = {};

      // check if user exist
      await User.findOne({ email }).then((user) => {
        if (!user) {
          response = { message: "User Does not Exist", status: "error" };
          return response;
        }

        // tv show details
        if (name === "" || url === "") {
          response = {
            message: "TV Show url and name are required",
            status: "error",
          };
        }

        const newSchedule = new WatchSchedule({
          userEmail: email,
          url,
          name,
          image,
          summary,
          rating,
        });
        newSchedule.save();

        // update watch schedule of the existing user
        response = {
          message: "TV Show Added to the watch schedule",
          status: "success",
          url,
          name,
          image,
          summary,
          rating,
          email,
        };
        return response;
      });
      return response;
    },

    // allow user to comment on the tv show user has favorite
    createTVShowComment: async (_, { watchScheduleId, comment }, {}) => {
      let response = {};

      // Watch schedule id is required
      if (watchScheduleId === "") {
        response = {
          status: "error",
          message: "TV Show must be in your watch schedule",
        };
        return response;
      }

      // check if tvshow has been favorited
      await WatchSchedule.findById({ _id: watchScheduleId }).then(
        (schedule) => {
          if (schedule === null) {
            response = {
              status: "error",
              message: "TV Show has not been added to the watch schedule",
            };
            return response;
          }

          if (comment === "") {
            response = {
              status: "error",
              message: "Kindly write down your comment",
            };
            return response;
          }

          // create comment
          const newComment = new CommentTvShow({ comment, watchScheduleId });
          newComment.save();
          response = {
            status: "success",
            message: "comment has been created",
            comment,
            watchScheduleId,
          };
          return response;
        }
      );
      return response;
    },
  },
};