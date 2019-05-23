const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

const User = require('../model/user');

router.get('/users/me', auth ,async (req, res) => {
    res.send(req.user);
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    try {
        // await newUser.save();
        const token = await user.generateAuthToken();
        
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
});

// this rout to check user login is legit
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        // we working on create a token for a specific user so that we dont use Uppercase user
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send('Log out successful');
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token === req.token;
        });

        await req.user.save();

        res.status(200).send('Log out all successfully');
    } catch(e) {
        res.status(500).send();
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById({ _id });
        if (!user) {
            res.status(404).send('User not found');
        }

        res.send(user);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.patch('/users/:id', async (req, res) => {

    // send more information if the update data is not included in the scheme.
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        updates.forEach(update => {
            user[update] = req.body[update];
        });

        const newUser = await user.save();

        // findByIdAndUpdate with new: true to make sure this method return new data that has been updated
        // runValidators is true to make sure update data is in the right format.
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

        res.send(newUser);
    } catch(e) {
        res.send(400).send(e);

        // if server can not connect
        // res.status(500).send(e);
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send('User not found to be deleted');
        }

        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;