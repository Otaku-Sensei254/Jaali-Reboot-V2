const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/:bookId/content', async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log(`Fetching metadata for book ${bookId}`);

    const response = await axios.get(`https://gutendex.com/books/${bookId}`);
    const metadata = response.data;
    const formats = metadata.formats || {};

    console.log('Available formats:', formats);

    const textKey = Object.keys(formats).find(k => k.includes('text/plain; charset=utf-8')) ||
                   Object.keys(formats).find(k => k.includes('text/plain')) ||
                   Object.keys(formats).find(k => k.includes('text'));

    if (!textKey) {
      console.log('No suitable text format found');
      return res.json({
        success: false,
        error: 'No plain text format available',
        metadata: metadata
      });
    }

    console.log(`Attempting to fetch content from: ${formats[textKey]}`);

    try {
      const textResponse = await axios.get(formats[textKey], {
        timeout: 10000,
        headers: {
          'Accept': 'text/plain,text/html',
          'User-Agent': 'Jabali-Educational-App/1.0'
        },
        responseType: 'text'
      });

      if (typeof textResponse.data === 'string') {
        res.json({
          success: true,
          content: textResponse.data,
          metadata: metadata
        });
      } else {
        throw new Error('Invalid content type received');
      }
    } catch (fetchError) {
      console.error('Error fetching text content:', fetchError.message);
      const alternateTextKey = Object.keys(formats).find(k => k.includes('text') && k !== textKey);

      if (alternateTextKey) {
        console.log(`Trying alternate format: ${formats[alternateTextKey]}`);
        const alternateResponse = await axios.get(formats[alternateTextKey], {
          timeout: 10000,
          headers: {
            'Accept': 'text/plain,text/html',
            'User-Agent': 'Jabali-Educational-App/1.0'
          },
          responseType: 'text'
        });

        if (typeof alternateResponse.data === 'string') {
          res.json({
            success: true,
            content: alternateResponse.data,
            metadata: metadata
          });
          return;
        }
      }

      res.json({
        success: false,
        error: 'Failed to fetch text content',
        metadata: metadata
      });
    }
  } catch (error) {
    console.error('Book content error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch book content: ' + error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://gutendex.com/books/', {
      params: { ...req.query },
      timeout: 15000
    });
    res.json(response.data);
  } catch (error) {
    console.error('Book search error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch books'
    });
  }
});

module.exports = router;