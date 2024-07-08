//---------------------------------Type Aliases----------------------------------//

// type StringOrNum = string | number; /// 
// type objWithName = { name: StringOrNum, uid: StringOrNum }


// let greet = (user: objWithName) => {
//     console.log(`${user.name} says hello!`);
// }

// console.log(greet({ name: 20, uid: "1" }));

//---------------------------------Type Aliases----------------------------------//

let great: (a: string, b: string) => void;
great = (name: string, greeting: string) => {
    console.log(`${name} says ${greeting}`);
}

console.log(great("raj", "hello....!"));


let calc: (a: number, b: number, c: string) => number;
calc = (numOne: number, numTwo: number, action: string) => {
    if (action === "add") {
        return numOne + numTwo;
    } else {
        return numOne - numTwo;
    }
}

let logDetails: (obj: { name: string, age: number }) => void;

type person = {
    name: string, age: number
}

logDetails = (ninja: person) => {
    console.log(`${ninja.name} is ${ninja.age} years old`);
}

logDetails({ name: "raj", age: 20 })