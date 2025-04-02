import z from 'zod';
import Router from '../middles/route';
import { signToken } from '../utils';
import validate from '../utils/validate';

const helloRouter = new Router({
    auth: false
});

helloRouter.get('/',validate(z.object({
    query: z.object({
        name: z.string().length().min(1).max(10),
        age: z.number().min(1).max(100)
    })
})), (req, res) => {
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