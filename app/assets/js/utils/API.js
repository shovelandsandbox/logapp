import * as request from 'superagent';

const ROOTURL = 'http://applesauce-staging.herokuapp.com';

export default class API {
    constructor(user) {
        this.accessToken = '';
        this.user = user;

        this.authenticate(user);
    }

    authenticate(user) {
        request
            .post(`${ROOTURL}/users/auth`)
            .send(user)
            .set('Content-Type', 'application/json')
            .end((error, response) => {
                console.log(JSON.stringify(response.body));
                if (!response.body.token) {
                    console.log(`Authentication failed: ` + JSON.stringify(response.body));
                } else {
                    console.log(`Successfully authenticated ${user.email}`);
                    this.accessToken = response.body.token;
                }
            });
    }

    addUser(user) {
        request
            .post(`${ROOTURL}/users`)
            .send(user)
            .set('Content-Type', 'application/json')
            .end((error, response) => {
                console.log(response.body.message);
                if (response.body.status !== '303') {
                    console.log(`User was not added: ${response.body.message}`);
                } else {
                    console.log(`Successfully added ${user.email}`);
                    this.accessToken = response.body.token;
                }
            });
    }
}
