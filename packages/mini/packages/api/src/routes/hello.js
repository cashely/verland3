import Router from '../middles/route';
import { signToken } from '../utils';

const helloRouter = new Router({
    auth: true
});

helloRouter.get('/', (req, res) => {
    console.log(req.headers)
    res.response.success('Hello World!');
})
.get('/token', (req, res) => {
    const token = signToken({
        name: 'admin',
        age: 18
    });
    res.response.success(token);
})
.post('/token', (req, res) => {
    const user = req.user;
    res.response.success(user);
})

export default helloRouter;