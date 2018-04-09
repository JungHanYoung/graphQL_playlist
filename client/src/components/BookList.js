import React, { Component } from 'react'
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

const getBooksQuery = gql`
      {
            books{
                  _id
                  name
                  genre
            }
      }
`

const Book = ({ book }) => (
  <li key={book._id}>
    {book.name} : {book.genre}
  </li>
);

class BookList extends Component {
      render() {
            console.log(this.props.data.books);
            return (
            <div>
                  <ul id="booklist">
                        {this.props.data.books ? this.props.data.books.map((book, index) => (
                              <Book key={index} book={book} />
                        )) : null}
                  </ul>
            </div>);
      }
}

export default graphql(getBooksQuery)(BookList);