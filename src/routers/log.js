const logEvent = require('../events/myEmitter')

const logRoute = (req, res,next) => {
    logEvent.emit('APP-INFO', {
        logTitle: 'ROUTE-TRACK',
        logMessage: `${req.originalUrl} was requested`
    });
    next();
};
module.exports = logRoute