const mongoose = require('mongoose');
const validator = require('validator');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    }]
});

// note that this is not arrow function. Instance method
userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse', { expiresIn: '10 seconds'});

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
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


// User scheme or model
const User = mongoose.model('User', userSchema);



module.exports = User;