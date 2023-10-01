// import user model
const { User } = require("../models");
// import sign token function from auth
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');


const resolvers = {
  Query: {
    users: async () => {
      return await User.find({}).populate('savedBooks');
    },
    // get a single user by either their id or their username
    getSingleUser: async (parent, { id, username }, context) => {
      const foundUser =  await User.findOne({
        $or: [{ _id: context.user ? context.user._id : id }, { username: username }],
      });
      if (!foundUser) {
        throw new AuthenticationError('Cannot find a user with this id!');
      }
      return foundUser;
    },
  },

  Mutation: {
    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    createUser: async (parent, args) => {
      const user = await User.create(args);
      if (!user) {
        throw new AuthenticationError('User cannot be created. See Resolver.');
      }
      const token = signToken(user);
      return ({ token, user });
    },
    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    saveBook: async (parent, args) => {
      return await User.findOneAndUpdate(
        { _id: args.id },
        {
          $addToSet: {
            savedBooks: {
              authors: args.authors,
              description: args.description,
              bookId: args.bookId,
              image: args.image,
              link: args.link,
              title: args.title,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },
    // remove a book from `savedBooks`
    deleteBook: async (parent, { id, bookId }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new AuthenticationError("Couldn't find user with this id!");
      }
      return updatedUser;
    },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    login: async (parent, args) => {
      const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
      if (!user) {
        throw new AuthenticationError("Can't find this user in resolver");
      }
  
      const correctPw = await user.isCorrectPassword(args.password);
  
      if (!correctPw) {
        throw new AuthenticationError('Wrong password as checked by resolver.');
      }
      const token = signToken(user);
      return ({ token, user });
    },
  },
};

module.exports = resolvers;
