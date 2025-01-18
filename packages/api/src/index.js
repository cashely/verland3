import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import response from "./middles/response";
import routes from './routes';
import prisma from "./configs/prisma";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(response);

routes(app);

app.listen(process.env.PORT, () => {
    console.log(`server is running at URL_ADDRESS:${process.env.PORT}`);
});