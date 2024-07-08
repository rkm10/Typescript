import { Invoice } from './modules/invoice.js';

const invOne = new Invoice("rajkumar", "work on website", 250);
const invTwo = new Invoice("lalitha", "work on database", 300);

let invoices: Invoice[] = []
invoices.push(invOne);
invoices.push(invTwo);

invoices.forEach(inv => {
    console.log(inv.format());
})

const form = document.querySelector(".new-item-form") as HTMLFormElement;

const type = document.querySelector("#type") as HTMLSelectElement;
const tofrom = document.querySelector("#tofrom") as HTMLInputElement;
const details = document.querySelector("#details") as HTMLInputElement;
const amount = document.querySelector("#amount") as HTMLInputElement;

form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    console.log(
        type.value,
        tofrom.value,
        details.value,
        amount.value
    );

})