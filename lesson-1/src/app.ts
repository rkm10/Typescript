import { Invoice } from './modules/invoice.js';
import { Payments } from './modules/Payments.js';
import { HasFormatter } from './modules/HasFormatter.js';
import { ListTemplate } from './modules/ListTemplate.js';

const form = document.querySelector(".new-item-form") as HTMLFormElement;

const type = document.querySelector("#type") as HTMLSelectElement;
const tofrom = document.querySelector("#tofrom") as HTMLInputElement;
const details = document.querySelector("#details") as HTMLInputElement;
const amount = document.querySelector("#amount") as HTMLInputElement;

const list = new ListTemplate(document.querySelector('ul')!);

form.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    let doc: HasFormatter;
    if (type.value === 'invoice') {
        doc = new Invoice(tofrom.value, details.value, amount.valueAsNumber);
    }
    else {
        doc = new Payments(tofrom.value, details.value, amount.valueAsNumber);
    }

    list.render(doc, type.value, 'end');

})