const logEvent = require('../events/myEmitter')

const noRoute = (req, res) => {
    logEvent.emit('APP-ERROR', {
        logTitle: 'ROUTE-FAILED',
        logMessage: `${req.originalUrl} was requested with method ${req.method}`
    });
    res.status(404);
    res.json({message: 'Page Not Found.'});
};
module.exports = noRoute;