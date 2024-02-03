const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');

const userService = new UserService();

exports.register = async (request, response) => {
    const { name, email, password, confirmPassword } = request.body;
    const result = await userService.getEmail(email);

    if (result.length > 0) {
        return response.render('register', {
            message: 'That email is already in use',
        });
    }

    if (!email || !name || !password || !confirmPassword) {
        return response.render('register', {
            message: 'Fill in all the fields',
        });
    }

    if (password !== confirmPassword) {
        return response.render('register', {
            message: 'Passwords do not match',
        });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    await userService.insertUserInDb(name, email, hashedPassword);
    response.render('login', {
        message: 'User registered',
    });
};

exports.login = async (request, response) => {
    const { email, password } = request.body || {};

    if (!email || !password) {
        return response.status(400).render('login', {
            message: 'Please provide an email and password',
        });
    }

    const result = await userService.getUserByEmail(email);
    console.log('result',result)
    if (
        !result.length ||
        !(await bcrypt.compare(password, result[0].password))
    ) {
        return response.status(401).render('login', {
            message: 'Email or Password incorrect',
        });
    } else {
        const id = result[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60
            ),
            httpOnly: true,
        };
        response.cookie('jwt', token, cookieOptions);

        return response.status(200).redirect('/');
    }
};
