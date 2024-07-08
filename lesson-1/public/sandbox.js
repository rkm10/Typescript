"use strict";
//---------------------------------Type Aliases----------------------------------//
// type StringOrNum = string | number; /// 
// type objWithName = { name: StringOrNum, uid: StringOrNum }
// let greet = (user: objWithName) => {
//     console.log(`${user.name} says hello!`);
// }
// console.log(greet({ name: 20, uid: "1" }));
//---------------------------------Type Aliases----------------------------------//
let great;
great = (name, greeting) => {
    console.log(`${name} says ${greeting}`);
};
console.log(great("raj", "hello....!"));
let calc;
calc = (numOne, numTwo, action) => {
    if (action === "add") {
        return numOne + numTwo;
    }
    else {
        return numOne - numTwo;
    }
};
let logDetails;
logDetails = (ninja) => {
    console.log(`${ninja.name} is ${ninja.age} years old`);
};
logDetails({ name: "raj", age: 20 });
