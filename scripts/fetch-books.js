const fs = require('fs');
const path = require('path');
require('dotenv').config();

const hardcoverApiKey = process.env.HARDCOVER_API_KEY;

if (!hardcoverApiKey) {
  throw new Error('hardcoverApiKey is not defined in the .env file');
}

const query = `
{
  me {
    user_books(
      where: {status_id: {_eq: 3}, last_read_date: {_is_null: false}}
      order_by: {last_read_date: desc}
    ) {
      rating
      book {
        contributions {
          author {
            name
            slug
          }
        }
        image {
          url
        }
        slug
        title
        images {
          url
        }
      }
    }
  }
}`;

const OUTPUT_FILE = path.join(__dirname, '../src/assets', 'books.json');

async function fetchBooks() {
  try {
    fetch('https://api.hardcover.app/v1/graphql', {
      headers: {
        'content-type': 'application/json',
        authorization: hardcoverApiKey,
      },
      body: JSON.stringify({ query }),
      method: 'POST',
    })
      .then((response) => response.json())
      .then(({ data }) => {
        console.log(data);
        const books = data.me[0].user_books.slice(0, 10).map(el => ({
          title: el.book.title,
          contributors: el.book.contributions,
          rating: el.rating || 'N/A',
          image: el.book.images?.[0]?.url || el.book.image?.url || '',
          bookUrl: 'https://hardcover.app/books/' + el.book.slug,
          review: el.review_raw,
        }));

        // Save the books to books.json
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(books, null, 2));
        console.log(`Successfully updated ${OUTPUT_FILE}`);
      });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

fetchBooks();