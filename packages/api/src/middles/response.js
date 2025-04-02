import console from '../utils/console';
function Response(req, res) {
    this.res = res;
}

Response.prototype.success = function (data = true) {
    this.res.status(200).json({
        code: 200,
        message:'success',
        data: data
    });
};

Response.prototype.error = function (error, code = 400) {
    console.log(error, 'error')
    this.res.json({
        code: code,
        message: error.message
    });
};

Response.prototype.noLogin = function (message) {
    this.res.status(200).json({
        code: 401,
        message: message ?? 'no login'
    });
};

export default function (req, res, next) {
    res.response = new Response(req, res);
    req.uuid = 1;
    next();
}