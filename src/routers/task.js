const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../model/task');

router.get('/tasks', auth,async (req, res) => {
    match = {};

    if (req.query.completed) {
        // I have to assign this because the completed val sent from client
        // is string, not boolean. => I convert it to boolean
        match.completed = req.query.completed === 'true';
    }
    try {
        // Two ways to fetch tasks belong to a user
        // first
        // const tasks = await Task.find({ owner: req.user._id});
        // res.send(tasks);

        // second
        await req.user.populate({
            path: 'tasks',
            match
        }).execPopulate();
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById({ _id });
        const task = await Task.findOne({ _id, owner: req.user._id});
        
        if (!task) {
            res.status(404).send('Task not found');
        }

        res.send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.put('/tasks/:id', async (req, res) => {
    console.log(req.body);
});

router.patch('/tasks/:id', auth,async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every( update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates! '});
    }
    
    try {
        /*
        We have to manually get a task, modified it and save it because
        if we use middleware pre('save', function(){}). It is bypass by findByIdAndUpdate();
        In conclusion, this is quite inconsistent.
        */
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});
        console.log('ee')
        if (!task) {
            res.status(404).send('Task not found');
        }

        updates.forEach(update => {
            task[update] = req.body[update];
        });

        await task.save();

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        

        res.send(task);
    } catch(e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch(E) {
        res.status(500).send();
    }
})



module.exports = router;