const me = {
    name: "raj",
    age: 26,
    speak(text) {
        console.log(text);
    },
    spend(amount) {
        console.log('I spent', amount);
        return amount;
    }
};
const greetPerson = (person) => {
    console.log(`hello ${person.name} you are ${person.age} years old`);
};
greetPerson(me);
console.log(me);
import { Invoice } from './modules/invoice.js';
const invOne = new Invoice("rajkumar", "work on website", 250);
const invTwo = new Invoice("lalitha", "work on database", 300);
let invoices = [];
invoices.push(invOne);
invoices.push(invTwo);
invoices.forEach(inv => {
    console.log(inv.format());
});
const form = document.querySelector(".new-item-form");
const type = document.querySelector("#type");
const tofrom = document.querySelector("#tofrom");
const details = document.querySelector("#details");
const amount = document.querySelector("#amount");
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(type.value, tofrom.value, details.value, amount.value);
});
