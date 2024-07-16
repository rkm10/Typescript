let submitBtn = document.querySelector(".submitBtn");
let toast = document.querySelector(".toast");
let printRequestId = "";

frappe.ready(function () {
    console.clear();
    main();
});

function main() {
    fetchData();

    submitBtn.addEventListener("click", updateStatus);
};

//Getting all Print Request data
async function fetchData() {
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Print Request",
            fields: ['name', 'full_name', 'status', 'customer', 'location'],
            limit_page_length: 0,
        },
        callback: function (response) {
            response.message.forEach((res, index) => {
                if (res.status === "Pending") {
                    constructTable(res, index + 1, "tableBody");
                } else {
                    constructTable(res, index + 1, "tableBodyAccOrReg");
                }
            });
        }
    });
};

//Show single Print request data
function showDetails(id) {
    my_modal_3.showModal();
    submitBtn.disabled = false;
    toast.style.display = "none";
    printRequestId = id;
    fetchSingleData(id);
};

//Fetch single Print request data
async function fetchSingleData(id) {
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Print Request",
            name: id,
        },
        callback: function (response) {
            appendDetails(response.message);
            if (response.message.status === "Completed") {
                submitBtn.disabled = true;
            }
        }
    })
};

//Inserting data to single details form
function appendDetails(data) {
    document.querySelector(".pass-id").innerHTML = data.name;
    document.getElementById("email-field").innerHTML = data.user;
    document.getElementById("description-field").innerHTML = data.description;
    document.getElementById("fullname-field").innerHTML = data.full_name;
    document.getElementById("phone-field").innerHTML = data.phone_number;
    document.getElementById("company-field").innerHTML = data.customer;
    document.getElementById("price-field").innerHTML = data.customer;
    document.getElementById("date-field").innerHTML = data.modified.split(" ")[0];
    document.getElementById("time-field").innerHTML = data.modified.split(" ")[1].split(".")[0];
    document.querySelector(".tableBodyOfItems").innerHTML = "";

    // let negativeDiv = document.querySelector(".negative");
    // negativeDiv.style.display = "none"
    // document.querySelector("#due-field").innerHTML = data.due_date;

    let statusDiv = document.querySelector(".status");
    statusDiv.innerHTML = data.status;

    switch (data.status) {
        case "Pending":
            statusDiv.style.backgroundColor = "#ff7300";
            // negativeDiv.style.display = "block";
            break;
        case "Completed":
            statusDiv.style.backgroundColor = "green";
            break;
        default:
            statusDiv.style.backgroundColor = "green";
            // negativeDiv.style.display = "block";
            break;
    }

    data.print_request_items.forEach((item, index) => {
        constructTable(item, index + 1, "tableBodyOfItems");
    })
}

//Utility function to create tables
function constructTable(data, slNo, tableName) {
    let tableBody = document.querySelector(`.${tableName}`);

    let tableRow = document.createElement("tr");
    tableRow.classList.add("hover", "tableRow");

    if (tableName === "tableBody" || tableName === "tableBodyAccOrReg") {
        tableRow.setAttribute("onClick", `showDetails('${data.name}')`);
        tableRow.innerHTML = `
            <th>${slNo}</th>
            <td>${data.name}</td>
            <td>${data.full_name}</td>
            <td>${data.customer}</td>
            <td>${data.location}</td>
            <td>${data.status}</td>
        `;
    } else {
        tableRow.innerHTML = `
            <th>${data.idx}</th>
            <td>${data.type}</td>
            <td>${data.pages}</td>
            <td>${data.copies}</td>
            <td><a href=${data.attachment} target="_blank" rel="noopener">${data.attachment.split('/')[2]}</a></td>
            <td>${data.price}</td>
        `;
    }
    tableBody.appendChild(tableRow);
}

//Updating status on click of submit
async function updateStatus() {
    //Status drop down value
    let dropdown = document.querySelector(".statusDropdown").value;

    if (dropdown !== "Pending") {
        frappe.call({
            method: "frappe.client.set_value",
            args: {
                doctype: "Print Request",
                name: printRequestId,
                fieldname: "status",
                value: dropdown
            },
            callback: function (response) {
                toast.style.display = "contents";
                submitBtn.disabled = true;
                window.location.reload();
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}