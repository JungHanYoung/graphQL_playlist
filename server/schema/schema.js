const graphql = require('graphql');
const _= require('lodash');

// MongoDB Schema
const Book = require('../models/Book');
const Author = require('../models/Author');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
        author: {
            type: AuthorType,
            resolve(parent, args, source, fieldASTs){
                // var projections = getProjection(fieldASTs);
                // return new Promise((resolve, reject) => {
                //     // console.log(parent);
                //     // Author.findById(parent.authorId, projections, (err, author) => {
                //     //     err ? reject(err) : resolve(author);
                //     // });
                // });
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args, source, fieldASTs){
                // var projections = getProjection(fieldASTs);
                // return new Promise((resolve, reject) => {
                //     Book.findById(parent.books, projections, (err, books) => {
                //         err ? reject(err) : resolve(books);
                //     });
                // });
                return Book.find({ authorId: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }, source, fieldASTs){
                // code to get data from db / other source
                // var projections = getProjection(fieldASTs);
                // var foundBook = new Promise((resolve, reject) => {
                //     Book.findById(id, projections, (err, book) => {
                //         err ? reject(err) : resolve(book);
                //     })
                // });
                // return foundBook;
                return Book.findById(id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }, source, fieldASTs){
                // var projections = getProjection(fieldASTs);
                // return new Promise((resolve, reject) => {
                //     Author.findById(id, projections, (err, author) => {
                //         err ? reject(err) : resolve(author);
                //     });
                // });
                return Author.findById(id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args, source, fieldASTs){
                //console.log(parent);
                //console.log(fieldASTs);
                // var projections = getProjection(fieldASTs);
                // //console.log(projections);
                // return new Promise((resolve, reject) => {
                //     Book.find({}, projections, (err, books) => {
                //         err ? reject(err) : resolve(books);
                //     })
                // });
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args, source, fieldASTs){
                // var projections = getProjection(fieldASTs);
                // return new Promise((resolve, reject) => {
                //     Author.find({}, projections, (err, authors) => {
                //         err ? reject(err) : resolve(authors);
                //     });
                // });
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});