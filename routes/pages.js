const express = require('express');

function setup(router) {
    const gameRoute = require('../routes/game');
    const authRoute = require('../routes/auth');

    router.get('/', (request, response) => {
        if (request.userInfo) {
            let userName = request.userInfo.name;
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
            response.render('home', {
                name: `${userName}`,
                title: `Welcome ${userName}`,
            });
        } else {
            response.render('home', {
                title: 'Home',
            });
        }
    });

    router.get('/login', (request, response) => {
        response.render('login', {
            title: 'Login',
        });
    });

    router.get('/register', (request, response) => {
        response.render('register', {
            title: 'Register',
        });
    });

    router.get('/logout', (request, response) => {
        response.clearCookie('jwt');
        response.redirect('/');
    });

    router.use('/game', gameRoute);

    router.use('/auth', authRoute);
}

module.exports = setup;
