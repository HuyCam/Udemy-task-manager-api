const mongoose = require('mongoose');
const validator = require('validator');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(val) {
            if (val < 0) {
                throw new Error('Unvalid age');
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if(!validator.isEmail(val)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(val) {
            if (val.match(/password/ig)) {
                throw new Error('Password can not contain \'password\' phrase');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// create a temporary relationship between localField id and
// foreignField: owner of Task
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',     //
    foreignField: 'owner' // the field that other model reference this model
})
// note that this is not arrow function. Instance method
userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: 600 });

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

// toJSON is a function automatically call when server send data to client
userSchema.methods.toJSON = function() {
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// set up your own prototype method. Model method.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcript.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// add middleware, standard function should be provided here instead
// of arrow function
userSchema.pre('save', async function(next) {
    const user =this;

    if (user.isModified('password')) {
        user.password = await bcript.hash(user.password, 8);
    }

    // next to let the program know it should continue.
    next();
})

userSchema.pre('remove', async function(next) {
    const user = this;

    await Task.deleteMany({ owner: user._id });
    console.log('predete');

    next();
})

// User scheme or model
const User = mongoose.model('User', userSchema);

module.exports = User;