import React from 'react';
import { FaBookOpen } from 'react-icons/fa';

const BookLibrary = ({ books, loading, onSelectBook }) => {
  if (loading) {
    return <div className="library-state">Loading stories...</div>;
  }

  if (!books.length) {
    return <div className="library-state">No stories are available right now.</div>;
  }

  return (
    <div className="library-shell">
      <div className="library-intro">
        <div className="library-badge">Story Library</div>
        <h3>Choose a book and open the reading space</h3>
        <p>Every title is presented as a calm, inviting storybook experience.</p>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <button key={book.id} className="book-card" onClick={() => onSelectBook(book)}>
            {book.thumbnail ? (
              <img src={book.thumbnail} alt={book.title} />
            ) : (
              <div className="no-cover">
                <FaBookOpen />
              </div>
            )}
            <div className="book-card-copy">
              <h4>{book.title}</h4>
              <p>{book.authorNames || 'Jabali Original'}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookLibrary;
