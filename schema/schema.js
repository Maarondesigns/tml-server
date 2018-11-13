const graphql = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");
const Book = require("../models/book");
const Author = require("../models/author");
const Todo = require("../models/todo");
const Grocery = require("../models/grocery");
const Recipe = require("../models/recipe");
const User = require("../models/user");

var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

//DEFINING THE TYPES

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    googleId: { type: GraphQLString },
    facebookId: { type: GraphQLString },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
    bio: { type: GraphQLString },
    links: { type: new GraphQLList(GraphQLString) }
  })
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: new GraphQLList(GraphQLString) },
    userId: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    order: { type: GraphQLInt },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    userId: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    deadline: { type: GraphQLDate },
    userId: { type: GraphQLString },
    completed: { type: GraphQLBoolean }
  })
});

const GroceryType = new GraphQLObjectType({
  name: "Grocery",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    quantity: { type: GraphQLString },
    userId: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    order: { type: GraphQLInt }
  })
});

const RecipeType = new GraphQLObjectType({
  name: "Recipe",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    instructions: { type: GraphQLString },
    ingredients: { type: new GraphQLList(GraphQLString) },
    userId: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    order: { type: GraphQLInt }
  })
});

//DEFINING ALL OF THE ROOT QUERIES

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        username: { type: GraphQLString }
      },
      resolve(parent, args, req) {
        if (req.user.id) {
          return User.findById(req.user.id);
        } else {
          let user = {};
          if (args.id) user["_id"] = args.id;
          if (args.email) user["email"] = args.email;
          if (args.username) user["username"] = args.username;
          return User.findOne(user);
        }
      }
    },
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, req) {
        return Book.findOne({ _id: args.id, userId: req.user.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, req) {
        return Author.findOne({ _id: args.id, userId: req.user.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args, req) {
        return Book.find({ userId: req.user.id });
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args, req) {
        return Author.find({ userId: req.user.id });
      }
    },
    todo: {
      type: TodoType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, req) {
        return Todo.findOne({ _id: args.id, userId: req.user.id });
      }
    },
    todos: {
      type: new GraphQLList(TodoType),
      resolve(parent, args, req) {
        return Todo.find({ userId: req.user.id });
      }
    },
    grocery: {
      type: GroceryType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, req) {
        return Grocery.findOne({ _id: args.id, userId: req.user.id });
      }
    },
    groceries: {
      type: new GraphQLList(GroceryType),
      resolve(parent, args, req) {
        return Grocery.find({ userId: req.user.id });
      }
    },
    recipe: {
      type: RecipeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, req) {
        return Recipe.findOne({ _id: args.id, userId: req.user.id });
      }
    },
    recipes: {
      type: new GraphQLList(RecipeType),
      resolve(parent, args, req) {
        return Recipe.find({ userId: req.user.id });
      }
    }
  }
});

//DEFINING ALL OF THE MUTATIONS

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args, req) {
        let author = new Author({
          name: args.name,
          userId: req.user.id,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLList(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args, req) {
        let book = new Book({
          name: args.name,
          userId: req.user.id,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: new GraphQLList(GraphQLString) },
        completed: { type: GraphQLBoolean },
        order: { type: GraphQLInt }
      },
      resolve(parent, args, req) {
        let book = {};
        if (args.name) book["name"] = args.name;
        if (args.genre) book["genre"] = args.genre;
        if (args.order) book["order"] = args.order;
        if (args.completed || args.completed === false)
          book["completed"] = args.completed;
        return Book.findOneAndUpdate({ _id: args.id }, book);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        password: { type: GraphQLString },
        hash: { type: GraphQLString },
        new_pass: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        googleId: { type: GraphQLString },
        facebookId: { type: GraphQLString },
        avatar: { type: GraphQLString },
        bio: { type: GraphQLString },
        links: { type: new GraphQLList(GraphQLString) }
      },
      resolve(parent, args, req) {
        let noPassword;
        if (args.googleId) noPassword = args.googleId;
        if (args.facebookId) noPassword = args.facebookId;
        if (
          bcrypt.compareSync(args.password, args.hash) ||
          args.hash === noPassword
        ) {
          let update = {};
          if (args.new_pass)
            update["password"] = bcrypt.hashSync(args.new_pass, salt);
          if (args.username) update["username"] = args.username;
          if (args.email) update["email"] = args.email;
          if (args.avatar) update["avatar"] = args.avatar;
          if (args.bio) update["bio"] = args.bio;
          if (args.links) update["links"] = args.links;
          return User.findOneAndUpdate({ _id: args.id }, update);
        } else {
          return;
        }
      }
    },
    removeBook: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findByIdAndDelete(args.id);
      }
    },
    removeAuthor: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findByIdAndDelete(args.id);
      }
    },
    removeTodo: {
      type: TodoType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Todo.findByIdAndDelete(args.id);
      }
    },
    addTodo: {
      type: TodoType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        deadline: { type: new GraphQLNonNull(GraphQLDate) },
        userId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args, req) {
        let todo = new Todo({
          name: args.name,
          description: args.description,
          deadline: args.deadline,
          userId: req.user.id
        });
        return todo.save();
      }
    },
    updateTodo: {
      type: TodoType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        deadline: { type: GraphQLDate },
        completed: { type: GraphQLBoolean }
      },
      resolve(parent, args, req) {
        let todo = {};
        if (args.name) todo["name"] = args.name;
        if (args.description) todo["description"] = args.description;
        if (args.deadline) todo["deadline"] = args.deadline;
        if (args.completed || args.completed === false)
          todo["completed"] = args.completed;
        return Todo.findOneAndUpdate({ _id: args.id }, todo);
      }
    },
    removeGrocery: {
      type: GroceryType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Grocery.findByIdAndDelete(args.id);
      }
    },
    addGrocery: {
      type: GroceryType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args, req) {
        let grocery = new Grocery({
          name: args.name,
          userId: req.user.id,
          quantity: args.quantity
        });
        return grocery.save();
      }
    },
    updateGrocery: {
      type: GroceryType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        quantity: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
        order: { type: GraphQLInt }
      },
      resolve(parent, args, req) {
        let grocery = {};
        if (args.name) grocery["name"] = args.name;
        if (args.quantity) grocery["quantity"] = args.quantity;
        if (args.order) grocery["order"] = args.order;
        if (args.completed || args.completed === false)
          grocery["completed"] = args.completed;

        return Grocery.findByIdAndUpdate(args.id, grocery);
      }
    },
    removeRecipe: {
      type: RecipeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Recipe.findByIdAndDelete(args.id);
      }
    },
    addRecipe: {
      type: RecipeType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        instructions: { type: new GraphQLNonNull(GraphQLString) },
        ingredients: { type: new GraphQLList(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args, req) {
        let recipe = new Recipe({
          name: args.name,
          userId: req.user.id,
          instructions: args.instructions,
          ingredients: args.ingredients
        });
        return recipe.save();
      }
    },
    updateRecipe: {
      type: RecipeType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        ingredients: { type: new GraphQLList(GraphQLString) },
        instructions: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
        order: { type: GraphQLInt }
      },
      resolve(parent, args, req) {
        let recipe = {};
        if (args.name) recipe["name"] = args.name;
        if (args.ingredients) recipe["ingredients"] = args.ingredients;
        if (args.instructions) recipe["instructions"] = args.instructions;
        if (args.order) recipe["order"] = args.order;
        if (args.completed || args.completed === false)
          recipe["completed"] = args.completed;

        return Recipe.findByIdAndUpdate(args.id, recipe);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
