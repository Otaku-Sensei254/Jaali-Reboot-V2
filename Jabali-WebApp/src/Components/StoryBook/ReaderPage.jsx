import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlay, FaPause, FaStop } from 'react-icons/fa';

const normalizeParagraphs = (text) => {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const deriveChapterTitle = (text, fallback) => {
  if (!text) return fallback;
  const match = text.match(/^(?:chapter\s+)?([A-Za-z0-9'\- ]{1,60})/i);
  if (match) {
    const title = match[1].trim();
    return title.length > 2 ? title : fallback;
  }
  return fallback;
};

const buildContents = (storyContent) => {
  const items = [{ id: 'cover', label: 'Cover', pageIndex: 0 }, { id: 'title', label: 'Title Page', pageIndex: 0 }];
  const fromContent = (storyContent || []).map((page, index) => {
    const fallback = `Chapter ${index + 1}`;
    const heading = deriveChapterTitle(page?.text || '', fallback);
    return { id: `chapter-${index + 1}`, label: heading, pageIndex: index };
  });

  return [
    ...items,
    ...fromContent,
  ];
};

const ReaderPage = ({
  selectedBook,
  storyContent,
  currentPageIndex,
  onBack,
  onPrev,
  onNext,
  onSpeak,
  onPause,
  onStop,
  speaking,
  currentContent,
  onNavigateToPage,
}) => {
  const currentPage = currentContent || {};
  const [contentsPage, setContentsPage] = useState(0);

  const contents = useMemo(() => buildContents(storyContent), [storyContent]);
  const contentsPerPage = 6;
  const totalContentsPages = Math.max(1, Math.ceil(contents.length / contentsPerPage));
  const activeContentIndex = currentPageIndex + 2;
  const visibleContents = useMemo(() => {
    const start = contentsPage * contentsPerPage;
    return contents.slice(start, start + contentsPerPage);
  }, [contents, contentsPage]);

  const chapterTitle = currentPage?.text ? deriveChapterTitle(currentPage.text, selectedBook?.title || 'Chapter') : selectedBook?.title || 'Chapter';
  const paragraphBlocks = useMemo(() => normalizeParagraphs(currentPage?.text || ''), [currentPage?.text]);

  useEffect(() => {
    const nextPage = Math.floor(activeContentIndex / contentsPerPage);
    setContentsPage(Math.min(nextPage, totalContentsPages - 1));
  }, [activeContentIndex, contentsPerPage, totalContentsPages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') onPrev();
      if (event.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext]);

  return (
    <div className="reader-shell">
      <aside className="reader-sidebar">
        <div className="reader-sidebar-top">
          <button className="reader-nav-btn" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <div>
            <div className="reader-sidebar-label">Contents</div>
            <h4>{selectedBook?.title || 'Story'}</h4>
          </div>
        </div>

        <div className="reader-contents">
          {visibleContents.map((item, index) => {
            const isActive = item.pageIndex === currentPageIndex;
            return (
              <button
                key={item.id}
                className={`contents-item ${isActive ? 'active' : ''}`}
                type="button"
                onClick={() => onNavigateToPage?.(item.pageIndex)}
              >
                <span>{contentsPage * contentsPerPage + index + 1}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="contents-pagination">
          <button type="button" className="contents-nav-btn" onClick={() => setContentsPage((page) => Math.max(0, page - 1))} disabled={contentsPage === 0}>
            <FaArrowLeft />
          </button>
          <span>{contentsPage + 1} / {totalContentsPages}</span>
          <button type="button" className="contents-nav-btn" onClick={() => setContentsPage((page) => Math.min(totalContentsPages - 1, page + 1))} disabled={contentsPage >= totalContentsPages - 1}>
            <FaArrowRight />
          </button>
        </div>
      </aside>

      <section className="reader-workspace">
        <header className="reader-header">
          <div>
            <div className="reader-header-label">Reading now</div>
            <h3>{selectedBook?.title || 'Story'}</h3>
          </div>
          <div className="reader-header-meta">
            {selectedBook?.age_range && <span>Age {selectedBook.age_range}</span>}
            {selectedBook?.category && <span>{selectedBook.category}</span>}
          </div>
        </header>

        <div className="narrator-dock">
          <div className="narrator-topline">
            <div className="narrator-title">
              <div className="narrator-icon">🤖</div>
              <div>
                <strong>AI Narrator</strong>
                <p>Kid Voice · Calm pacing</p>
              </div>
            </div>
            <div className="narrator-controls">
              <button type="button" className="narrator-control primary" onClick={onSpeak}>
                {speaking ? <FaPause /> : <FaPlay />}
              </button>
              <button type="button" className="narrator-control" onClick={speaking ? onPause : onStop}>
                {speaking ? <FaStop /> : <FaPlay />}
              </button>
            </div>
          </div>
          <div className="narrator-progress">
            <div className="narrator-progress-bar" />
          </div>
        </div>

        <div className="book-spread">

          <div className="book-page text-page">
            <div className="book-page-inner text-page-inner">
              <div className="story-page-heading">
                <div className="story-page-label">Chapter {currentPageIndex + 1}</div>
                <h4>{chapterTitle}</h4>
              </div>

              <div className="story-paragraphs">
                {paragraphBlocks.map((paragraph, paragraphIndex) => (
                  <p key={`${currentPageIndex}-${paragraphIndex}`}>
                    {paragraph.split(/(\s+)/).map((word, wordIndex) => (
                      <span key={`${currentPageIndex}-${paragraphIndex}-${wordIndex}`} className={wordIndex % 3 === 0 ? 'spoken' : ''}>
                        {word}
                      </span>
                    ))}
                  </p>
                ))}
              </div>

              <div className="page-foot">
                <span>{currentPageIndex + 1} / {storyContent?.length || 1}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="reader-navigation">
          <button className="nav-arrow" type="button" onClick={onPrev}>
            <FaArrowLeft />
          </button>
          <div className="book-nav-label">Open Book</div>
          <button className="nav-arrow" type="button" onClick={onNext}>
            <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ReaderPage;
