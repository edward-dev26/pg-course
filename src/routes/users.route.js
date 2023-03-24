const express = require('express');
const usersRepo = require('../repositories/users.repository');

const router = express.Router();

router.get('', async (req, res) => {
    const users = await usersRepo.find();

    res.send(users);
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await usersRepo.findById(id);

        if (!user) {
            return res.status(404).send({error: 'Not Found'});
        }

        res.send(user);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
});

router.post('', async (req, res) => {
    try {
        const {bio, username} = req.body;
        const user = await usersRepo.insert({username, bio});

        res.status(201).send(user);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {username, bio} = req.body;
        const user = await usersRepo.update(id, {username, bio});

        if (!user) {
            return res.status(404).send({
                error: 'Not Found',
            });
        }

        res.send(user);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await usersRepo.delete(id);

        if (!user) {
            return res.status(404).send({
                error: 'Not Found'
            });
        }

        res.send({
            message: 'Success',
        });
    } catch (e) {
        res.status(500).send({error: e.message});
    }
});

module.exports = router;
