const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Movie = require("../models/Movie");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const movies = await Movie.find({ user: req.user.id });
      res.render("profile.ejs", { movies: movies, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeedMovie: async (req, res) => {
    try {
      //! Changed sort order to desc because it makes more sense
      const movies = await Movie.find().sort({ createdAt: "desc" }).lean();
      res.render("feedMovie.ejs", { movies: movies });
    } catch (err) {
      console.log(err);
    }
  },
  getMovie: async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "asc" }).lean();
      res.render("movie.ejs", { movie: movie, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createMovie: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Movie.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Movie has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likeMovie: async (req, res) => {
    try {
      await Movie.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/movie/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteMovie: async (req, res) => {
    try {
      // Find post by id
      let movie = await Movie.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(movie.cloudinaryId);
      // Delete post from db
      await Movie.remove({ _id: req.params.id });
      console.log("Deleted Movie");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};