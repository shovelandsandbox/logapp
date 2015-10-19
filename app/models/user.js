import * as sequelize from 'sequelize';

module.exports = () => {
    let User = sequelize.define('User', {
        email: sequelize.STRING,
        password: sequelize.STRING
    });
}
