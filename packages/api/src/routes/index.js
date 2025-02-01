import helloRouter from './hello';
import loginRouter from './login';
import adminUserRouter from './adminUser.router';
import fileRouter from './file.router';
import bookGoodRouter from './bookGood.router';

export default function routes(app) {
    app.use('/hello', helloRouter);
    app.use('/login', loginRouter);
    app.use('/adminUser', adminUserRouter);
    app.use('/file', fileRouter);
    app.use('/bookGood', bookGoodRouter);
}
