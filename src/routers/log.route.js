const logEvent = require('../events/myEmitter')

const logRoute = (req, res,next) => {
    logEvent.emit('APP-INFO', {
        logTitle: 'ROUTE-TRACK',
        logMessage: `${req.originalUrl} was requested with method ${req.method}`
    });
    next();
};
module.exports = logRoute