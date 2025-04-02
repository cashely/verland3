import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

expand(dotenv.config({
    path: `./.env.${process.env.NODE_ENV}`,
    override: true
}));

async function start() {
    try {
        await import('./src');
    } catch (error) {
        console.error(error);
    }
}

start();

