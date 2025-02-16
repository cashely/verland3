import multer from 'multer';
import path from 'node:path';
import Router from '../middles/route';
import prisma from '../configs/prisma';

const fileRouter = new Router({
    auth: false
})

const UPLOAD_FOLDER = path.join(__dirname, '../static/images/');

fileRouter.post('/', (_, _, next) => {
    const staticPath = path.join(process.cwd(), 'src/static');

    // 检查static文件夹是否存在
    if (!fs.existsSync(staticPath)) {
        // 如果不存在，则创建
        fs.mkdirSync(staticPath);
    }

    // 检查static下面的images文件夹是否存在
    const imagesPath = path.join(staticPath, 'images');
    // 如果文件夹不存在创建文件夹
    if (!fs.existsSync(imagesPath)) {
        fs.mkdirSync(imagesPath);
    }
    next();
}, multer({
    dest: UPLOAD_FOLDER,
    storage: multer.diskStorage({
        destination(_req, _file, _cb) {
            _cb(null, UPLOAD_FOLDER)
        },
        filename(_req, _file, _cb) {
            _cb(null, `${_file.originalname}`)
        }
    })
}).single('file'), async (req, res) => {
    const { file } = req;

    if (!file) {
        res.response.error('file字段不能为空');
        return;
    }
    
    // 获取文件基于image的路径
    const filePath = path.relative(path.join(process.cwd(), 'src/static'), file.path)
    try {
        const fileResult = await prisma.image.create({
            data: {
                path: filePath,
                title: file.filename
            },
            select: {
                id: true,
                path: true,
                title: true
            }
        })
        res.response.success(fileResult);
    } catch (error) {
        res.response.error(error.message);
    }
})

export default fileRouter;