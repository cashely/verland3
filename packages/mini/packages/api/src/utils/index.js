import fs from 'node:fs';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

const TOKEN_SECRET ='secret';

/**
 * @name 加密token
 */

export function signToken(data) {
    return jwt.sign({
        data,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }, TOKEN_SECRET);
}

/**
 * @name 解密token
 */

export function verifyToken(token) {
    return jwt.verify(token, TOKEN_SECRET);
}

/**
 * @name 创建临时文件
 */
export function createTempFile(options = {
    ext: '.json'
}) {
    try {
        const dir = path.join(__dirname, './.temp')
        if (fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const filePath = `${dir}/${nanoid()}${options.ext}`;
        fs.writeFileSync(filePath, '')
        return filePath;
    } catch (error) {
        console.log(error)
    }
}

/**
 * @name 写入文件到文件夹
 */
export function writeFile(filePath, content, options) {
    fs.writeFileSync(filePath, content, options)
    return null
}

/**
 * @name 转换method为数字表示
 */

export function convertMethodToNumber(method) {
    switch (method) {
        case 'get':
            return 1;
        case 'post':
            return 2;
        case 'put':
            return 3;
        case 'delete':
            return 4;
        default:
            return 0;
    }
}

/**
 * @name 转换数字为method
 */

export function convertNumberToMethod(number) {
    switch (number) {
        case 1:
            return 'GET';
        case 2:
            return 'POST';
        case 3:
            return 'PUT';
        case 4:
            return 'DELETE';
        default:
            return 'ALL';
    }
}