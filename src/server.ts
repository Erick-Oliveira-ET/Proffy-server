import express from 'express'; //It has to be installed as @types/express
import routes from './routes';

const app = express();

app.use(express.json());

app.use(routes);


app.listen(3333);