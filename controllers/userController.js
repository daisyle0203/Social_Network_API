const { User, Thought } = require("../models")

module.exports = {
  // GET /api/users - Get All Users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err))
  },

  // GET /api/users/:userId - Get Single User by ID and populated thought and friend data
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts friends")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err))
  },

  // POST /api/users - Create User
  createUser(req, res) {
    // Use data included in request's body to create the new user
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err))
  },

  // PUT /api/users/:userId - Update User by ID
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      // Use data included in request's body to update the user
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID!" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  },

  // DELETE /api/users/:userId - Delete User by ID and Remove a user's associated Thoughts when deleted
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : // Delete all thoughts that were connected to that user
            Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({ message: "User and associated thoughts deleted!" })
      )
      .catch((err) => res.status(500).json(err))
  },

  // POST /api/users/:userId/friends/:friendId - Add Friend to a user's friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err))
  },

  // DELETE /api/users/:userId/friends/:friendId - Remove Friend to a user's friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err))
  },
}
