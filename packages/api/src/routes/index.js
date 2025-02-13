import helloRouter from './hello';
import loginRouter from './login';
import adminUserRouter from './adminUser.router';
import fileRouter from './file.router';
import bookGoodRouter from './bookGood.router';
import adviseRouter from './advise.router';
import book from './book.router';
import user from './user.router';
// 小程序路由
import mpAdviseRouter from './mp/mp.advise.router';
import mpBookRouter from './mp/mp.book.router';
import mpPet from './mp/mp.pet.router';
import mpTicket from './mp/mp.ticket.router';
import mpUser from './mp/mp.user.router';
import mpBookGood from './mp/mp.bookGood.router';

export default function routes(app) {
    app.use('/hello', helloRouter);
    app.use('/login', loginRouter);
    app.use('/adminUser', adminUserRouter);
    app.use('/file', fileRouter);
    app.use('/bookGood', bookGoodRouter);
    app.use('/advise', adviseRouter);
    app.use('/book', book);
    app.use('/user', user);
    // 小程序路由
    app.use('/mp/advise', mpAdviseRouter);
    app.use('/mp/book', mpBookRouter);
    app.use('/mp/pet', mpPet);
    app.use('/mp/ticket', mpTicket);
    app.use('/mp/user', mpUser);
    app.use('/mp/bookGood', mpBookGood);
}
