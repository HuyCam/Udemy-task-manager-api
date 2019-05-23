require('../src/db/mongoose');
const User = require('../src/model/user');
const Task = require('../src/model/task');

// User.findByIdAndUpdate('5cd30ecab7fc965470b9849a', {
//     age: 1
// }).then(user => {
//     console.log(user);

//     return User.countDocuments({ age: 1});
// }).then(result => console.log(result)).catch(e => console.log(e));

// Task.findByIdAndDelete('5cce5ece8df87e00e80fd40d').then(task => {
//     console.log(task);

//     return Task.countDocuments({ completed: false });
// }).then(result => {
//     console.log('Incompleted tasks: ', result);
// }).catch(e => console.log(e));

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, { age });
//     const count = await User.countDocuments({ age });
//     return count;
// }

// updateAgeAndCount('5cd0bf383a04815dfcc4559c', 2).then(count => {
//     console.log(count);
// }).catch(e => {
//     console.log(e);
// });

// const deleteTaskAndCount = async () => {
//     await Task.findOneAndDelete({ completed: false }).then( task => {
//         console.log(task);
//     }).catch(e => {
//         console.log(e);
//     });

//     const count = await Task.countDocuments({ completed: false });
//     return count;
// };

// deleteTaskAndCount().then(count => {
//     console.log(count);
// }).catch(e => {
//     console.log(e);
// });

const something = async () => {
    const user = await User.find({});
    console.log(user);
}

