import logEvent from '../events/myEmitter'
const logRoute = (req, res,next) => {
    logEvent.emit('APP-INFO', {
        logTitle: 'ROUTE-TRACK',
        logMessage: `${req.originalUrl} was requested`
    });
    next();
};
export default logRoute