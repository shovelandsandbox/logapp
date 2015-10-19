module.exports = function(router) {
    router.get('/session/set/:value', (request, response) => {
        request.session.redSession = request.params.value;
        response.send('session written in Redis successfully');
    });

    router.get('/session/get/', (request, response) => {
        if(request.session.redSession)
            response.send('the session value stored in Redis is: ' + request.session.redSess);
        else
            response.send("no session value stored in Redis ");
    });
}
