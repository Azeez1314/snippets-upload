const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const moviesController = require("../controllers/movies");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Movie Routes - simplified for now
router.get("/:id", ensureAuth, moviesController.getMovie);

router.post("/createMovie/:id", upload.single("file"), moviesController.createMovie);

router.put("/likeMovie/:id", moviesController.likeMovie);

router.delete("/deleteMovie/:id", moviesController.deleteMovie);

module.exports = router;
