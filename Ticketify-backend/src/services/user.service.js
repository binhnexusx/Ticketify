const userRepository = require("../repositories/user.repository");
const pool = require("../config/db");
const userService = {
  getUserById: async (userId) => {
    return await userRepository.getUserById(userId);
  },

  updateUser: async (userId, userData) => {
    await userRepository.updateUser(userId, userData);
    const updatedUser = await userRepository.getUserById(userId);
    return updatedUser;
  },
  
  createUser: async (userData) => {
    return await userRepository.createUser(userData);
  },

  getUserByEmail: async (email) => {
    return await userRepository.getUserByEmail(email);
  },
};

module.exports = userService;