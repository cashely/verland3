import Router from '../middles/route';

const helloRouter = new Router({
    auth: true
});

helloRouter.get('/', (req, res) => {
    res.response.success('Hello World!');
});

export default helloRouter;