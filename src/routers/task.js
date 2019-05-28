const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../model/task');

router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.send(500).send(e);
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

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById({ _id });
        
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

router.patch('/tasks/:id', async (req, res) => {
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
        const task = await Task.findById(req.params.id);

        updates.forEach(update => {
            task[update] = req.body[update];
        });

        await task.save();

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!task) {
            res.status(404).send('Task not found');
        }

        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findById(req.params.id);
        console.log(task, req.params.id);

        if (!task) {
            return res.status(404).send();
        }

        if (task.owner.toString() !== req.user._id.toString()) {
            return res.status(400).send({
                error: 'Authorization denied'
            })
        }
        task.delete();
        res.send(task);
    } catch(E) {
        res.status(500).send();
    }
})



module.exports = router;