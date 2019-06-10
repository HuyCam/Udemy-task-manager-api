const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT;

// parse incoming json
app.use(express.json());
// set up router
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server started on port ' + port);
});
