import React, { useState, useEffect } from 'react';
import { fetchChildrenBooks, fetchBookContent } from '../services/StoryService';
import BookLibrary from './BookLibrary';
import ReaderPage from './ReaderPage';
import storiesIllustration from '../../Assets/stories.png';
import mobileStoriesIllustration from '../../Assets/mobile_stories.png';
import '../../styles/storybook.css';

const StoryBook = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [storyContent, setStoryContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [speaking, setSpeaking] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                setLoading(true);
                const booksData = await fetchChildrenBooks();
                setBooks(booksData);
            } catch (err) {
                setError('Failed to load books');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, []);

    const selectBook = async (book) => {
        try {
            setLoading(true);
            setError(null);
            const content = await fetchBookContent(book.id);
            setSelectedBook(book);

            if (content && content.content) {
                setStoryContent(content.content);
                setCurrentPage(0);
            } else {
                setError('Story content not available. Please try another book.');
                setStoryContent(null);
            }
        } catch (err) {
            setError('Failed to load story content. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentPageContent = () => {
        if (!storyContent || !storyContent[currentPage]) return null;
        return storyContent[currentPage];
    };

    const totalPages = () => {
        return storyContent ? storyContent.length : 0;
    };

    const clearSelection = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setSelectedBook(null);
        setStoryContent(null);
        setSpeaking(false);
        setError(null);
        setCurrentPage(0);
    };

    const startSpeaking = () => {
        const currentContent = getCurrentPageContent();
        if (!currentContent) return;

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentContent.text);
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => {
                setSpeaking(false);
                setError('Text-to-speech failed');
            };
            window.speechSynthesis.speak(utterance);
            setSpeaking(true);
        } else {
            setError('Text-to-speech is not supported in your browser');
        }
    };

    const pauseSpeaking = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.pause();
            setSpeaking(false);
        }
    };

    const stopSpeaking = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    };

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <div className="storybook-container">
            <section className="storybook-hero">
                <div className="storybook-hero-copy">
                    <div className="eyebrow">Gentle stories for calm reading</div>
                    <h2>Interactive Storybooks</h2>
                    <p>Pick a story, settle in, and enjoy a soft, book-style reading experience with read-aloud support.</p>
                </div>
                <img className="storybook-hero-image" src={storiesIllustration} alt="Storybook illustration" />
                <img className="storybook-hero-image mobile" src={mobileStoriesIllustration} alt="Storybook illustration" />
            </section>

            {error && <div className="error-message">{error}</div>}

            {loading && !selectedBook && <div className="loading">Loading...</div>}

            {selectedBook ? (
                <ReaderPage
                    selectedBook={selectedBook}
                    storyContent={storyContent}
                    currentPageIndex={currentPage}
                    onBack={clearSelection}
                    onPrev={() => setCurrentPage((page) => Math.max(0, page - 1))}
                    onNext={() => setCurrentPage((page) => Math.min(totalPages() - 1, page + 1))}
                    onSpeak={speaking ? pauseSpeaking : startSpeaking}
                    onPause={pauseSpeaking}
                    onStop={stopSpeaking}
                    speaking={speaking}
                    currentContent={getCurrentPageContent()}
                    onNavigateToPage={(pageIndex) => setCurrentPage(pageIndex)}
                />
            ) : (
                <BookLibrary books={books} loading={loading} onSelectBook={selectBook} />
            )}
        </div>
    );
};

export default StoryBook;