import helloRouter from './hello';
import loginRouter from './login';
import adminUserRouter from './adminUser.router';
import fileRouter from './file.router';
import bookGoodRouter from './bookGood.router';
import adviseRouter from './advise.router';
// 小程序路由
import mpAdviseRouter from './mp/mp.advise.router';
import mpBookRouter from './mp/mp.book.router';

export default function routes(app) {
    app.use('/hello', helloRouter);
    app.use('/login', loginRouter);
    app.use('/adminUser', adminUserRouter);
    app.use('/file', fileRouter);
    app.use('/bookGood', bookGoodRouter);
    app.use('/advise', adviseRouter);
    // 小程序路由
    app.use('/mp/advise', mpAdviseRouter);
    app.use('/mp/book', mpBookRouter);
}
