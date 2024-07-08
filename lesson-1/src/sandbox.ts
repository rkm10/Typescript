type StringOrNum = string | number; /// 
type objWithName = { name: StringOrNum, uid: StringOrNum }


let greet = (user: objWithName) => {
    console.log(`${user.name} says hello!`);
}

console.log(greet({ name: 20, uid: "1" }));
