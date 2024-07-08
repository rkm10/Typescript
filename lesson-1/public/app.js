import { Invoice } from './modules/invoice.js';
import { Payments } from './modules/Payments.js';
// let docOne: HasFormatter;
// let docTwo: HasFormatter;
// docOne = new Invoice("rajkumar", "work on website", 250);
// docTwo = new Payments("lalitha", "work on database", 300);
// let docs: HasFormatter[] = [];
// docs.push(docOne);
// docs.push(docTwo);
// console.log(docs);
// const invOne = new Invoice("rajkumar", "work on website", 250);
// const invTwo = new Invoice("lalitha", "work on database", 300);
// let invoices: Invoice[] = []
// invoices.push(invOne);
// invoices.push(invTwo);
// invoices.forEach(inv => {
//     console.log(inv.format());
// })
const form = document.querySelector(".new-item-form");
const type = document.querySelector("#type");
const tofrom = document.querySelector("#tofrom");
const details = document.querySelector("#details");
const amount = document.querySelector("#amount");
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let doc;
    if (type.value === 'invoice') {
        doc = new Invoice(tofrom.value, details.value, amount.valueAsNumber);
    }
    else {
        doc = new Payments(tofrom.value, details.value, amount.valueAsNumber);
    }
    console.log(doc);
});
