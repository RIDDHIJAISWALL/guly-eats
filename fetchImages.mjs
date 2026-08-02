import https from 'https';

const searchUnsplash = (query) => {
  return new Promise((resolve) => {
    https.get(`https://unsplash.com/s/photos/${query}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g);
        if(matches) resolve(matches[0]);
        else resolve('https://images.unsplash.com/photo-1524492412937-b28074a5d7da'); // default
      });
    });
  });
};

(async () => {
  console.log('Delhi:', await searchUnsplash('delhi'));
  console.log('Mumbai:', await searchUnsplash('mumbai-city'));
  console.log('Jaipur:', await searchUnsplash('jaipur'));
  console.log('Varanasi:', await searchUnsplash('varanasi'));
  console.log('Kolkata:', await searchUnsplash('kolkata'));
  console.log('Chennai:', await searchUnsplash('chennai'));
  console.log('Amritsar:', await searchUnsplash('amritsar'));
  console.log('Lucknow:', await searchUnsplash('lucknow'));
})();
