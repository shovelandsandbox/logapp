module.exports = (router) => {
    router.get('/', (request, response) => {
        response.render('index', {
            title: 'Buttlog'
        });
    });
}
