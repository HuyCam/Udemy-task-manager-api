const bcrypt = require('bcryptjs');

const myFunc = async () => {
    const pass = 'Huy1234';
    const salt = 8;
    const hashed = await bcrypt.hash(pass, salt);

    const result = await bcrypt.compare(pass, hashed);
    console.log(hashed, result);
};

myFunc();