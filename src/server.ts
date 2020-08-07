import express from 'express'; //It has to be installed as @types/express

const app = express();

app.use(express.json());

app.get('/', (req,res) =>{

});


app.listen(3333);