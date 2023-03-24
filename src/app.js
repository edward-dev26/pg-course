const express = require("express");
const usersRouter = require('./routes/users.route');

module.exports = () => {
    const app = express();

    app.use(express.json());
    app.use('/users', usersRouter);

    app.get('/', (req, res) => {
        res.send(`<h1>Hello World!</h1>`);
    });

    return app;
};
