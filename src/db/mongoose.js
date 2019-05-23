/**************************************************************
 To validate input in a scheme, add method validate(value).
 To make it easier to validate common thing like phone number,
 password, email address etc. Use validator npm package.
 Validate method of mongoose model can trim string, lowercase
 string, etc.
***************************************************************/


const mongoose = require('mongoose');
// mongod url/dabase-name
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,    // create index so mongoose can access data quicker
    useFindAndModify: false  // to cancel notification of deprication on useFindAndModify
});



// create new user
// const me = new User({
//     name: '    David  ',
//     age: 23,
//     email: 'huycam@gmail.com',
//     password: '        hel      '
// });

// use save() method that return a promise
// me.save().then(() => {
//     console.log(me);
// }).catch((err) => {
//     console.log(err);
// })

