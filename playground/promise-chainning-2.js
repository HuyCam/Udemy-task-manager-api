/* async await make it easier to work with asynchronous code*/
/***************************************************
 Async always return a promise that includes what
 a function return.
****************************************************/
const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b > 0) {
                reject('Numbers must be positive');
            }

            resolve(a + b);
        }, 2000)
    });
}

const doWork = async () => {
    // we can use await because add() return a promise
    const sum = await add(1, 99);
    const sum2 = await add(sum, -22);
    const sum3 = await add(sum2, 3);
    return sum3;
};

doWork().then(result => {
    console.log(result)
}).catch(e => {
    console.log(e);
});