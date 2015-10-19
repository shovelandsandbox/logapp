module.exports = function(redis) {
    /*
    =   Redis client events
    */
    redis.on('connected', () => {
        // @TODO Applesauce: log event
        console.log('REDIS: Connected');
    });

    redis.on('ready', () => {
        // @TODO Applesauce: log event
    });

    redis.on('idle', () => {
        // @TODO Applesauce: log event
    });

    redis.on('error', (error) => {
        // @TODO Applesauce: log event
        console.log(`REDIS: ${error}`);
    });
}
