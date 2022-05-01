const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  },
  Mutation: {
    // looks good
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },


    saveBook: async (parent, args, context) => {
      if (context.user) {
        //   const savedBook = await Book.create({ ...args, username: context.user.username });

        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.input } },
          { new: true, runValidators: true }
        );

      }

      throw new AuthenticationError('You need to be logged in!');
    },



    // looks good
    removeBook: async (parent, args, context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );

      }

      throw new AuthenticationError('You need to be logged in!');

    },
  },
};


module.exports = resolvers;
