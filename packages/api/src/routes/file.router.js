import multer from 'multer';
import path from 'node:path';
import Router from '../middles/route';
import prisma from '../configs/prisma';

const fileRouter = new Router({
    auth: false
})

const UPLOAD_FOLDER = path.join(__dirname, '../static/images/');

fileRouter.post('/', multer({
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