import config from 'config';

module.exports = function(Sequelize) {
    return new Sequelize(config.get('database.database'), config.get('database.username'), config.get('database.password'), {
        host: config.get('database.host'),
        dialect: 'postgres',
        pool: {
            max: config.get('database.pool.max'),
            min: config.get('database.pool.min'),
            idle: config.get('database.pool.idle')
        },
        define: {
            hooks: {
                create: () => {
                    // @TODO Applesauce: log event
                },
                destroy: () => {
                    // @TODO Applesauce: log event
                },
                update: () => {
                    // @TODO Applesauce: log event
                }
            }
        }
    });
}
