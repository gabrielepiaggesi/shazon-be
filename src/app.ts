import express from 'express';
import { scrapeAmazonOffersList } from './amazon-scraper';
const app = express();
const port = 3000;

// scrapeAmazonOffersList(180);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/offers', async (req, res) => {
  res.send(await scrapeAmazonOffersList(0)).json();
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});