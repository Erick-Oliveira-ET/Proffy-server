import express from 'express'; //It has to be installed as @types/express
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(express.json());

//Alow different ports to access the API
app.use(cors());

app.use(routes);


app.listen(3333);