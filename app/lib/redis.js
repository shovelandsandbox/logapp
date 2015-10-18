module.exports = function(redis) {
    /*
    =   Redis client events
    */
    redis.on('connected', () => {
        // @TODO Applesauce: log event
        console.log('connected');
    });

    redis.set('framework', 'express', (error, reply) => {
        if (!error) {
            // @TODO Applesauce: log event
        } else {
            // @TODO Applesauce: log event
            console.log(`Redis error: ${error}`);
        }
    });
}
