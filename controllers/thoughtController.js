const { Thought, Reaction, User } = require("../models")

module.exports = {
  // GET /api/thoughts - Get All Thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err))
  },

  // GET /api/thoughts/:thoughtId - Get Single Thought by ID
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err))
  },

  // POST /api/thoughts - Create Thought
  createThought(req, res) {
    // Use data included in request's body to create the new thought
    Thought.create(req.body)
      .then((thought) => {
        // Find assigned user and add thought to their thoughts list
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        )
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought created, but found no user with that ID",
            })
          : res.json("Created the thought 🎉")
      )
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  },

  // PUT /api/thoughts/:thoughtId - Update Thought by ID
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      // Use data included in request's body to update the thought
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID!" })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  },

  // DELETE /api/thoughts/:thoughtId - Delete Thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID!" })
          : // Find user associated to thought and remove thought from their thoughts list
            User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "Thought deleted but no user with that ID!" })
          : res.json({ message: "Thought successfully deleted!" })
      )
      .catch((err) => res.status(500).json(err))
  },

  // POST /api/thoughts/:thoughtId/reactions- Add Reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err))
  },

  // DELETE /api/thoughts/:thoughtId/reactions/:reactionId - Remove Reaction
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err))
  },
}
