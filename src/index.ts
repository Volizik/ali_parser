import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path'

import controllers from './controllers';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, '..', 'public')))

app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'pug')

app.get('/', controllers.root);

app.get('/test', controllers.test);

app.get('/product', controllers.product);

app.get('/links', controllers.links);

app.get('/similar', controllers.similar);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
