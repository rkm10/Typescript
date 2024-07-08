//interfaces
interface isPerson {
    name: string;
    age: number;
    speak(a: string): void;
    spend(a: number): number
}

const me: isPerson = {
    name: "raj",
    age: 30,
    speak(text: string): void {
        console.log(text);
    },
    spend(amount: number): number {
        console.log('I spent', amount);
        return amount
    }
};
console.log(me);




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