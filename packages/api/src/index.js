import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from 'node:path';
import response from "./middles/response";
import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './static')));

app.use(response);

routes(app);

app.listen(process.env.PORT, () => {
    console.log(`server is running at URL_ADDRESS:${process.env.PORT}`);
});