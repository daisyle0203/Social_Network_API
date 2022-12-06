const { User, Thought } = require('../models');

// GET /api/users - Get All Users

// GET /api/users/:userId - Get Single User by ID and populated thought and friend data

// POST /api/users - Create User

// PUT /api/users/:userId - Update User by ID

// DELETE /api/users/:userId - Delete User by ID and Remove a user's associated Thoughts when deleted

// POST /api/users/:userId/friends/:friendId - Add Friend to a user's friend list

// DELETE /api/users/:userId/friends/:friendId - Remove Friend to a user's friend list