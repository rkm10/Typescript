let data = [];

frappe.ready(function () {
    sub();
})

function sub() {
    let url = window.location.href;
    let parts = url.split('/');
    let id = parts[parts.length - 1];
    fetchData(id);
};

async function fetchData(id) {
    frappe.call({
        method: "gate_pass_by_id",
        args: {
            id: id,
        },
        callback: function (response) {
            // console.log(response.message);
            showDetails(response.message);
        }
    })
};


function showDetails(data) {
    document.getElementById("fullname-field").innerHTML = data.full_name;
    document.getElementById("email-field").innerHTML = data.user;
    document.getElementById("alternative-field").innerHTML = data.another_email;
    document.getElementById("company-field").innerHTML = data.customer;
    document.getElementById("date-field").innerHTML = data.date;
    document.getElementById("time-field").innerHTML = data.time.split(".")[0];

    const passStatusElement = document.getElementById("pass-status");
    passStatusElement.innerHTML = data.status;

    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    console.log(getFormattedDate());


    if (data.status === "Approved") {

        data.valid_upto >= getFormattedDate() ? document.querySelector("#pass-status").innerHTML = "Approved" : document.querySelector("#pass-status").innerHTML = "Expired";
        console.log(data.valid_upto)

    }

    // Change background color based on the status
    if (passStatusElement.innerHTML === "Approved") {
        passStatusElement.style.backgroundColor = "green";
    } else {
        passStatusElement.style.backgroundColor = "red";
    }


    tableDetails(data.gate_pass_items);
}

function tableDetails(item) {
    item.forEach((res, index) => {
        constructTable(res, index + 1);
    })

}

function constructTable(items, slNo) {
    let tableBody = document.querySelector(".Bodytable");

    let tableRow = document.createElement("tr");
    tableRow.classList.add("hover", "tableRow");

    tableRow.innerHTML = `
        <th>${slNo}</th>
        <td>${items.type}</td>
        <td>${items.name1}</td>
        <td>${items.quantity}</td>
    `;

    tableBody.appendChild(tableRow);
}


