// src/Components/services/StoryService.js
import storiesData from '../../Assets/stories/stories.json';

const API_BASE = '/api/books';
const PAGE_SIZE = 2000;

const CHILD_FRIENDLY_SHELVES = [
    'Children & Young Adult Reading',
    "Children's Fiction",
    "Children's Literature",
    "Children's Myths, Fairy Tales, etc.",
];

const getCoverImage = (formats) => {
    if (!formats) return '';
    return formats['image/jpeg'] || formats['image/png'] || '';
};

const getFormatUrl = (formats, mimeTypes) => {
    if (!formats) return null;
    const keys = Object.keys(formats);
    for (const mime of mimeTypes) {
        const key = keys.find(k => k.includes(mime));
        if (key) return formats[key];
    }
    return null;
};

const getTextUrl = (formats) => {
    return getFormatUrl(formats, ['text/plain; charset=utf-8', 'text/plain']) ||
           getFormatUrl(formats, ['text']);
};

const isChildFriendly = (book) => {
    const shelves = book.bookshelves || [];
    const isChildShelf = shelves.some(s =>
        CHILD_FRIENDLY_SHELVES.some(kid => s.includes(kid))
    );
    if (isChildShelf) return true;

    const subjects = (book.subjects || []).join(' ').toLowerCase();
    if (subjects.includes('children') || subjects.includes('juvenile') || subjects.includes('fairy tale')) {
        return true;
    }

    return false;
};

const stripFrontMatter = (text) => {
    const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
    if (paragraphs.length === 0) return text;

    let startIndex = 0;

    for (let i = 0; i < Math.min(paragraphs.length, 20); i++) {
        const para = paragraphs[i];
        const lines = para.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length === 0) { startIndex = i + 1; continue; }

        // Skip "Produced by" / production credits
        if (/^[Pp]roduced by\s/.test(lines[0])) {
            startIndex = i + 1;
            continue;
        }

        // Skip standalone title (all caps, short)
        if (lines.length === 1 && /^[A-Z][A-Z\s]+$/.test(lines[0]) && lines[0].length < 60) {
            startIndex = i + 1;
            continue;
        }

        // Skip "By Author Name" lines
        if (lines.length === 1 && /^[Bb]y\s[A-Z][a-zA-Z\s]+\.?$/.test(lines[0])) {
            startIndex = i + 1;
            continue;
        }

        // Skip "Contents" / "TABLE OF CONTENTS" and everything until first chapter
        if (lines.length === 1 && /^(?:Contents|TABLE OF CONTENTS)\.?$/i.test(lines[0])) {
            const remaining = paragraphs.slice(i + 1);
            const chapterIdx = remaining.findIndex(p =>
                /^(?:[Cc]hapter\s+[IVXLCDM0-9]+|I\.|II\.|III\.|IV\.|V\.|VI\.|VII\.|VIII\.|IX\.|X\.)\s/.test(p.split('\n')[0].trim())
            );
            if (chapterIdx >= 0) {
                startIndex = i + 1 + chapterIdx;
            } else {
                startIndex = i + 1;
            }
            break;
        }

        // Skip Roman numeral chapter listings in TOC (I., II., III., etc.)
        if (lines.length === 1 && /^[IVXLCDM]+\.\s/.test(lines[0])) {
            startIndex = i + 1;
            continue;
        }

        // Skip dedication paragraphs (multiple lines starting with "To ")
        if (lines.length <= 5 && lines.length > 1 && lines.every(l => l.startsWith('To '))) {
            startIndex = i + 1;
            continue;
        }

        // Skip "Illustration" captions
        if (/^[Ii]llustration.*[.!]*$/i.test(para)) {
            startIndex = i + 1;
            continue;
        }

        // Found actual chapter start - this is where story begins
        const chapterMatch = lines[0].match(/^(?:[Cc]hapter\s+[IVXLCDM0-9]+|I\.|II\.|III\.|IV\.|V\.|VI\.|VII\.|VIII\.|IX\.|X\.)\s/i);
        if (chapterMatch) {
            startIndex = i;
            break;
        }

        // Skip early short metadata-like paragraphs (title, author, etc.)
        if (startIndex <= 3 && lines.length <= 4 && lines.every(l => l.length < 80)) {
            startIndex = i + 1;
            continue;
        }

        // If we hit a substantial paragraph that's not matched above, we're at content
        break;
    }

    const result = paragraphs.slice(startIndex);
    return result.length > 0 ? result.join('\n\n') : text;
};

const cleanGutenbergText = (text) => {
    if (!text || typeof text !== 'string') return '';

    let cleaned = text;

    // Strip Project Gutenberg header
    const startMatch = cleaned.match(/\*\*\*\s*START OF (?:THE |PROJECT GUTENBERG.*? )?(?:PROJECT GUTENBERG|EBOOK|THIS E.?BOOK).*?\*\*\*/i);
    if (startMatch) {
        cleaned = cleaned.slice(startMatch.index + startMatch[0].length);
    }

    // Strip Project Gutenberg footer
    const endMatch = cleaned.match(/\*\*\*\s*END OF (?:THE |PROJECT GUTENBERG.*? )?(?:PROJECT GUTENBERG|EBOOK|THIS E.?BOOK).*?\*\*\*/i);
    if (endMatch) {
        cleaned = cleaned.slice(0, endMatch.index);
    }

    // Normalize line endings
    cleaned = cleaned
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/^\s*\n+/g, '')
        .replace(/\n+\s*$/g, '');

    // Strip front matter (dedication, TOC, production credits, etc.)
    cleaned = stripFrontMatter(cleaned);

    // Final cleanup
    return cleaned
        .trim()
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\s*\n+/g, '')
        .replace(/\n+\s*$/g, '');
};

const chunkTextToPages = (text, coverImage) => {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return [{
            page: 1,
            text: 'Content not available for this book.',
            image: coverImage || undefined,
        }];
    }

    const cleaned = cleanGutenbergText(text);
    const paragraphs = cleaned.split(/\n\s*\n/).filter(p => p.trim());

    if (paragraphs.length === 0) {
        return [{
            page: 1,
            text: cleaned,
            image: coverImage || undefined,
        }];
    }

    const pages = [];
    let currentPageText = '';
    let pageNum = 1;

    const flushPage = () => {
        if (currentPageText.trim()) {
            pages.push({
                page: pageNum,
                text: currentPageText.trim(),
                image: pageNum === 1 && coverImage ? coverImage : undefined,
            });
            pageNum++;
        }
        currentPageText = '';
    };

    for (const para of paragraphs) {
        if (currentPageText.length + para.length + 2 > PAGE_SIZE && currentPageText.length > 0) {
            flushPage();
        }
        currentPageText += para.trim() + '\n\n';
    }
    flushPage();

    if (pages.length === 0) {
        pages.push({
            page: 1,
            text: cleaned,
            image: coverImage || undefined,
        });
    }

    return pages;
};

const getAuthorsString = (authors) => {
    if (!authors || authors.length === 0) return '';
    return authors.map(a => a.name).join(', ');
};

const getAgeRange = (book) => {
    const subjects = (book.subjects || []).join(' ').toLowerCase();
    if (subjects.includes('fairy') || subjects.includes('tale') || subjects.includes('fable')) {
        return '4-8';
    }
    return '6-12';
};

const getCategory = (book) => {
    return (book.subjects && book.subjects[0]) ||
           (book.bookshelves && book.bookshelves[0]?.replace('Category: ', '')) ||
           'Children';
};

const mapToStoryBook = (book) => ({
    id: book.id,
    title: book.title,
    authors: book.authors || [],
    description: (book.summaries && book.summaries[0]) || '',
    age_range: getAgeRange(book),
    category: getCategory(book),
    thumbnail: getCoverImage(book.formats),
    formats: book.formats || {},
    bookshelves: book.bookshelves || [],
    subjects: book.subjects || [],
    authorNames: getAuthorsString(book.authors),
});

export const fetchChildrenBooks = async () => {
    try {
        const response = await fetch(`${API_BASE}?search=children&languages=en`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const results = (data.results || []).filter(book => {
            const formats = book.formats || {};
            const hasText = getTextUrl(formats) !== null;
            return hasText && isChildFriendly(book);
        });

        return results.map(mapToStoryBook);
    } catch (error) {
        console.error('Error fetching books from API:', error);

        const fallback = storiesData.stories.map(story => ({
            id: story.id,
            title: story.title,
            authors: [{ name: 'Jabali Original' }],
            description: story.description,
            age_range: story.age_range,
            category: story.category,
            thumbnail: story.thumbnail,
            formats: { 'image/jpeg': story.thumbnail },
            bookshelves: [],
            subjects: [],
            authorNames: 'Jabali Original',
        }));

        return fallback;
    }
};

export const fetchBookContent = async (bookId) => {
    try {
        const response = await fetch(`${API_BASE}/${bookId}/content`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch book content');
        }

        const metadata = data.metadata || {};
        const coverImage = getCoverImage(metadata.formats || {});
        const pages = chunkTextToPages(data.content, coverImage);

        return {
            content: pages,
            meta: {
                title: metadata.title || 'Untitled',
                description: (metadata.summaries && metadata.summaries[0]) || '',
                age_range: getAgeRange(metadata),
                category: getCategory(metadata),
                thumbnail: coverImage,
            },
        };
    } catch (error) {
        console.error('Error fetching book content:', error);

        const story = storiesData.stories.find(s => s.id === bookId);
        if (story) {
            return {
                content: story.content,
                meta: {
                    title: story.title,
                    description: story.description,
                    age_range: story.age_range,
                    category: story.category,
                    thumbnail: story.thumbnail,
                },
            };
        }

        return {
            content: [{
                page: 1,
                text: 'Unable to load book content. Please try again later.',
                image: undefined,
            }],
            meta: {
                title: 'Error Loading Book',
                description: '',
                age_range: '',
                category: 'Error',
                thumbnail: '',
            },
        };
    }
};

const storyService = {
    fetchChildrenBooks,
    fetchBookContent,
};

export default storyService;
