const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  //Finds user info by id
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).select('-__v -password');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {

    //Adds user
    addUser: async (parent, { username, email, password }) => {
      try{
        const user = await User.create({ username, email, password });
      const token = signToken(user);
      // console.log("----",user)
      return { token, user };
      }

      catch(error) {
        console.error(error)
      }
      
    },
    //login, with validation
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    //Saves book by an Id to a users saved books
    saveBook: async (parent, {bookData}, context) => {
      // console.log("context",context)
      // console.log("bookData", bookData)
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },//added_ to id
          {
            $push: {
              savedBooks: bookData ,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        // console.log("user", user)
        return user
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    //removes books by id from saved books
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },//added_ to id
          {
            $pull: {
              savedBooks: {
                bookId
              },
            },
          },
          { new: true }
        );
        return user
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  }
};

module.exports = resolvers;
