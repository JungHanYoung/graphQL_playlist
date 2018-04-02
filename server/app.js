const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//const Book = require('./models/schema');
const NewBook = require('./models/Book');
const Author = require('./models/Author');

//keys..
const keys = require('./keys');

const app = express();

mongoose.connect(keys.mongodb.url);
mongoose.connection.once('open', () => {
    console.log('mongodb connected..');
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.get('/', (req, res) => {
    Author.find().then((result) => {
        console.log(result);
        res.render('home', { result });
    });
});

app.post('/', (req, res) => {
    Author.findById(req.body.authorId).then((author) => {
        new NewBook({
            name: req.body.name,
            genre: req.body.genre,
            authorId: author._id
        }).save().then((book) => {

            author.books.push(book._id);
            author.save((err, updatedAuthor) => {
                if(err) console.log(err);
                console.log(updatedAuthor);
            })

            // Author.update({ _id: author._id },
            //     { books: { $push: book._id }},
            //     (err, updatedAuthor) => {
            //         console.log(updatedAuthor);
            //     }
            // )

            console.log('new Book insert succeed!');
        })
        .catch((err) => {
            console.log(err);
        });
    })
    // var book = new Book({
    //     name: req.body.name,
    //     genre: req.body.genre,
    // });
    // book.save().then(() => {
    //     console.log('book data insert success..');
    // });
    res.redirect('/');
});

app.post('/author', (req, res) => {
    
    var author = new Author({
        name: req.body.name,
        age: parseInt(req.body.age)
    });
    author.save().then(() => {
        console.log('author data insert success..');
    });
    res.redirect('/');
});

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});