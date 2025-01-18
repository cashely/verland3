import helloRouter from './hello';
import loginRouter from './login';

export default function routes(app) {
    app.use('/hello', helloRouter);
    app.use('/login', loginRouter);
}
