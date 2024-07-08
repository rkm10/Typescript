let character: string;
let age: number;
let isLoggedIn: boolean;

age = 22;
character = "raj";
isLoggedIn = true;


console.log('character', character, 'age', age, 'isLoggedIn', isLoggedIn);


let ninjas: string[] = [];
ninjas.push('raj');
ninjas = ['kumar', 'malluri'];
console.log(ninjas);


let mixed: (string | number | boolean)[] = [];
mixed.push('raj');
mixed.push(1);
mixed.push(true);
console.log(mixed);

mixed = ['kumar', 2, true];
console.log(mixed);
