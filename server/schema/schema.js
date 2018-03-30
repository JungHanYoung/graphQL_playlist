const graphql = require('graphql');
const _= require('lodash');

// MongoDB Schema
const Book = require('../models/Book');
const Author = require('../models/Author');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */
export function getProjection (fieldASTs) {
    return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
      projections[selection.name.value] = true;
      return projections;
    }, {});
}

var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1'},
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2'},
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3'},
    { name: 'The Hero of Ages', aenre: 'Fantasy', id: '4', authorId: '2'},
    { name: 'The Colour of Magic', aenre: 'Fantasy', id: '5', authorId: '3'},
    { name: 'The Light Fantastic', aenre: 'Fantasy', id: '6', authorId: '3'}
];

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1'},
    { name: 'Brandon Sanderson', age: 42, id: '2'},
    { name: 'Terry Partchett', age: 66, id: '3'}
];

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
                var projections = getProjection(fieldASTs);
                return new Promise((resolve, reject) => {
                    // console.log(parent);
                    Author.findById(parent.authorId, projections, (err, author) => {
                        err ? reject(err) : resolve(author);
                    });
                });
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
                var projections = getProjection(fieldASTs);
                return new Promise((resolve, reject) => {
                    Book.findById(parent.books, projections, (err, books) => {
                        err ? reject(err) : resolve(books);
                    });
                });
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
            resolve(parent, {id}, source, fieldASTs){
                // code to get data from db / other source
                var projections = getProjection(fieldASTs);
                var foundBook = new Promise((resolve, reject) => {
                    Book.findById(id, projections, (err, book) => {
                        err ? reject(err) : resolve(book);
                    })
                });
                return foundBook;
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }, source, fieldASTs){
                var projections = getProjection(fieldASTs);
                return new Promise((resolve, reject) => {
                    Author.findById(id, projections, (err, author) => {
                        err ? reject(err) : resolve(author);
                    });
                });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args, source, fieldASTs){
                //console.log(parent);
                //console.log(fieldASTs);
                var projections = getProjection(fieldASTs);
                //console.log(projections);
                return new Promise((resolve, reject) => {
                    Book.find({}, projections, (err, books) => {
                        err ? reject(err) : resolve(books);
                    })
                });
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args, source, fieldASTs){
                var projections = getProjection(fieldASTs);
                return new Promise((resolve, reject) => {
                    Author.find({}, projections, (err, authors) => {
                        err ? reject(err) : resolve(authors);
                    });
                });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});