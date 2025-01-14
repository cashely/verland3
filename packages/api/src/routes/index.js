import helloRouter from './hello';

export default function routes(app) {
    app.use('/hello', helloRouter);
}
