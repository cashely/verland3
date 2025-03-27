import log4js from "log4js";

log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: { type: 'file', filename: 'logs/app.log' },
    },
    categories: {
        default: { appenders: ['file'], level: 'info' },
    },
})


class Console {
    constructor() {
        this.logger = log4js.getLogger('console');
        this.logger.level = log4js.levels.ALL;
    }
    log(message) {
        this.logger.info(message);
    }
    error(message) {
        this.logger.error(message);
    }
    warn(message) {
        this.logger.warn(message);
    }
    debug(message) {
        this.logger.debug(message);
    }
}

const con = new Console();
export default con;