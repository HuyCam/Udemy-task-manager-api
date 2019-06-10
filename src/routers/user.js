const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const sharp = require('sharp');
const User = require('../model/user');

// make it possible to upload file
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/(jpg|jpeg|png)$/i)) {
            return cb(new Error('Please upload a file image'))
        }
        
        cb(undefined, true);
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar ) {
            res.status(404).send();
        }

        // remember to set Content-type when send it back
        // Note: you should also set Content-Type to image when send to server too.
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch(e) {
        res.status(500).send();
    }
})

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

// user post user avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send('Image has been upload');
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message});
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

router.patch('/users/me', auth, async (req, res) => {

    // send more information if the update data is not included in the scheme.
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' });
    }

    try {

        updates.forEach(update => {
            req.user[update] = req.body[update];
        });

        await req.user.save();

        // findByIdAndUpdate with new: true to make sure this method return new data that has been updated
        // runValidators is true to make sure update data is in the right format.
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

        res.send(req.user);
    } catch(e) {
        res.send(400).send(e);

        // if server can not connect
        // res.status(500).send(e);
    }
});

router.delete('/users/me', auth,async (req, res) => {
    try {
        await req.user.remove();

        res.send(req.user);
    } catch(e) {
        res.status(500).send();
    }
});

// delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    
    try {
        // set the field to undefined and it is automatically deleted on mongoDB
        req.user.avatar = undefined;
        await req.user.save();
        res.send({ msg: 'Delete user avatar succesfully.' });
    } catch(e) {
        res.status(400).send();
    }
})

module.exports = router;