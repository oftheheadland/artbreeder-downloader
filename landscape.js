const fetch = require('node-fetch');
const fs = require('fs');

// landscapes
// landscapes_sg2
let count = 3;

search('landscape', count);

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function search(category, count) {
  if (count === 0) return;
  count--;

  // for more info about artbreeder:
  // 1. navigate to https://artbreeder.com/browse
  // 2. open network tab in dev tools
  // 3. switch to 'random' tab
  // 4. view network data

  // all models available through artbreeder API
  const allModels = [
    'general',
    'portraits_sg2',
    'characters',
    'landscapes',
    'landscapes_sg2',
    'sci_bio_art',
    'albums',
    'furries',
    'anime_portraits',
  ];

  // map models to a category for ease of typing it out
  const pairs = {
    general: 'general',
    portrait: 'portraits_sg2',
    character: 'characters',
    landscape: 'landscapes',
    landscape2: 'landscapes_sg2',
    scifi: 'sci_bio_art',
    album: 'albums',
    furry: 'furries',
    anime: 'anime_portraits',
  };

  const models = category ? [pairs[category]] : allModels;

  const body = {
    models: models,
    offset: 0,
    limit: 24, // maximum of 24
    order_by: 'random',
  };

  postData('https://artbreeder.com/images', body)
    .then((data) => {
      if (!data || data.length === 0) {
        console.log('error getting data');
      }

      data.forEach((image) => {
        const url = `https://artbreeder.b-cdn.net/imgs/${image.key}.jpeg\n`;

        fs.appendFile('landscapes.txt', url, (err) => {
          // throws an error, you could also catch it here
          if (err) throw err;

          // success case, the file was saved
          console.log(url);
        });
      });
      search('landscape', count);
    })
    .catch((error) => {
      console.log(error);
    });
}
