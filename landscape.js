const fetch = require('node-fetch');
const fs = require('fs');

// TODO: add Neek and function that will filter duplicates out of output file

// Change this to the desired amount of requests
// each request returns 24 urls which are appended
let count = 3;

// name of file that will either be created or appended to with 1 URL per line
const outputFile = 'landscapes.txt';

// Use any value from the pairs object below as argument 1
// landscape
// landscape2
// etc.
const category = 'landscape';
search(category, count);

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

// fetch images from artbreeder
function search(category, count) {
  if (count === 0) return;
  count--;

  // for more info about artbreeder:
  // 1. navigate to https://artbreeder.com/browse
  // 2. open network tab in dev tools
  // 3. switch to 'random' tab
  // 4. view network data

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

        fs.appendFile(outputFile, url, (err) => {
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

// simple HTTP Post function
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
