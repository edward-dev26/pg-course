const createApp = require('./app');
const pool = require('./pool');
const PORT = 3000;

pool.connect({
    host: 'localhost',
    port: 5432,
    database: 'social-network',
    username: 'eshvetsov',
    password: '',
})
    .then((res) => {
        console.log(`${pool.getValidateQuery()} = ${res.rows[0].result}`);

        createApp().listen(PORT, () => {
            console.log(`Server is working on port ${PORT}`);
        });
    })
    .catch(e => {
        console.error(e.message);
    });
