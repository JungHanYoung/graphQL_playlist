import React, { Component, Fragment } from 'react';
import BookList from './components/BookList';


class App extends Component {
  render() {
    return (
      <Fragment>
        <h1>Ninja Book List</h1>
        <BookList />
      </Fragment>
    );
  }
}

export default App;
