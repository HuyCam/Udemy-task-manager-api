const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

// parse incoming json
app.use(express.json());
// set up router
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server started on port ' + port);
});

// const bcrypt = require('bcryptjs');

// const myFunction = async () => {
//     const password = 'Red12345!';

//     const hashedPassword = await bcrypt.hash(password, 8);
//     const hashedPasssword2 = await bcrypt.hash(password, 8);

//     console.log(hashedPasssword2);
//     console.log(hashedPassword);

//     const isMatch = await bcrypt.compare(password, hashedPasssword2);
//     console.log(isMatch);
// }

// myFunction();

// jsonwebtoken authentication instruction

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {

//     // provide a token for user
//     const token = jwt.sign({ _id: 'abc123'}, 'thisismynewcourse', { expiresIn: '1 seconds'});
//     console.log(token);

//     const data = jwt.verify(token , 'thisismynewcourse');
//     console.log(data);
    
// }

// myFunction();