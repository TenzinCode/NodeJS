// GENRE.JS

// Project

const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// const genreSchema = new mongoose.Schema({
//   // db manages the id property.
//   name: {
//     type: String,
//     required: true,
//     min: 5,
//     max: 50,
//   },
// });

// const Genre = new mongoose.model("Genre", genreSchema);
const Genre = mongoose.model(
  "Genre",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 5,
      max: 50,
    },
  })
);

// const genres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Horror" },
//   { id: 3, name: "Romance" },
// ];

// return all genre in db.
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // const genre = {
  //   id: genres.length + 1,
  //   name: req.body.name,
  // };
  // let, to reset genre.
  let genre = new Genre({ name: req.body.name });
  // genres.push(genre);
  await genre.save();
  res.send(genre);
});

// using update first approach.
router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // { ... } the update object and {} options object to get updated object.
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  // Moved to top
  // const { error } = validateGenre(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  // genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  // const index = genres.indexOf(genre);
  // genres.splice(index, 1);
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
}

module.exports = router;
