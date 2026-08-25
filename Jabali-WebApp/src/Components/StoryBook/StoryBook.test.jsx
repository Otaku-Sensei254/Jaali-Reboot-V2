import { render, screen } from '@testing-library/react';
import StoryBook from './StoryBook';
import { fetchChildrenBooks } from '../services/StoryService';

jest.mock('../services/StoryService', () => ({
  fetchChildrenBooks: jest.fn(),
  fetchBookContent: jest.fn(),
}));

describe('StoryBook', () => {
  beforeEach(() => {
    fetchChildrenBooks.mockResolvedValue([
      {
        id: 'book-1',
        title: 'The Moon and the River',
        authorNames: 'Amina',
        thumbnail: 'https://example.com/cover.jpg',
      },
    ]);
  });

  it('renders the story library intro for available books', async () => {
    render(<StoryBook />);

    expect(await screen.findByText('Story Library')).toBeInTheDocument();
    expect(screen.getByText(/Choose a book and open the reading space/i)).toBeInTheDocument();
  });
});
