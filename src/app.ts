import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import { initJobs } from './cron-jobs';
import { getOffers, getProducts } from './feed';
import { scrapeAmazonProducts } from './amazon-scraper';
process.env.TZ = 'Europe/Rome';

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json({limit: 52428800}));
app.use(bodyParser.urlencoded({limit: 52428800, extended: true, parameterLimit: 50000}));
initJobs(app);


// port === 8000 && setTimeout(() => {
//   scrapeAmazonProducts(1);
// }, 2000);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/offers/:page?', async (req, res) => {
  res.json(await getOffers(+req.params.page || 0));
});

app.get('/products/:page?', async (req, res) => {
  res.json(await getProducts(+req.params.page || 0));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});