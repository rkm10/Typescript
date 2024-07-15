let submitBtn = document.querySelector(".submitBtn");
let toast = document.querySelector(".toast");
let gatePassId = "";
let currentPagePending = 1;
let currentPageApproved = 1;
const itemsPerPage = 10;
const itemsPerApprovedpage = 5;

frappe.ready(function () {
    console.clear();
    main();
});

function main() {
    fetchData(currentPagePending, currentPageApproved);

    submitBtn.addEventListener("click", updateStatus);

    document.querySelector(".prev-page-pending").addEventListener("click", () => {
        if (currentPagePending > 1) {
            currentPagePending--;
            fetchData(currentPagePending, currentPageApproved);
        }
    });

    document.querySelector(".next-page-pending").addEventListener("click", () => {
        currentPagePending++;
        fetchData(currentPagePending, currentPageApproved);
    });

    document.querySelector(".prev-page-approved").addEventListener("click", () => {
        if (currentPageApproved > 1) {
            currentPageApproved--;
            fetchData(currentPagePending, currentPageApproved);
        }
    });

    document.querySelector(".next-page-approved").addEventListener("click", () => {
        currentPageApproved++;
        fetchData(currentPagePending, currentPageApproved);
    });
};

//Getting all gate pass data
async function fetchData(pagePending, pageApproved) {
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Gate Pass",
            fields: ['name', 'gate_pass_status', 'customer', 'location'],
            limit_start: (pagePending - 1) * itemsPerPage,
            limit_page_length: itemsPerPage,
            filters: [['gate_pass_status', '=', 'Pending']]
        },
        callback: function (response) {
            document.querySelector(".tableBody").innerHTML = "";

            response.message.forEach((res, index) => {
                constructTable(res, index + 1, "tableBody");
            });
        }
    });

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Gate Pass",
            fields: ['name', 'gate_pass_status', 'customer', 'location'],
            limit_start: (pageApproved - 1) * itemsPerApprovedpage,
            limit_page_length: itemsPerApprovedpage,
            filters: [['gate_pass_status', '=', 'Approved']]
        },
        callback: function (response) {
            document.querySelector(".tableBodyAccOrReg").innerHTML = "";

            response.message.forEach((res, index) => {
                constructTable(res, index + 1, "tableBodyAccOrReg");
            });
        }
    });
};

//Show single gate pass data
function showDetails(id) {
    my_modal_3.showModal();
    submitBtn.disabled = false;
    toast.style.display = "none";
    gatePassId = id;
    fetchSingleData(id);
};

//Fetch single gate pass data
async function fetchSingleData(id) {
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Gate Pass",
            name: id,
        },
        callback: function (response) {
            appendDetails(response.message);
            console.log(response.message)
            if (response.message.status === "Approved") {
                submitBtn.disabled = true;
            }
        }
    })
};

//Inserting data to single details form
function appendDetails(data) {
    document.querySelector(".pass-id").innerHTML = data.name;
    document.querySelector("#leadId").innerHTML = data.lead_id;
    document.querySelector("#leasing_status").innerHTML = data.leasing_status;
    document.getElementById("email-field").innerHTML = data.user;
    document.getElementById("fullname-field").innerHTML = data.full_name;
    document.getElementById("alternative-field").innerHTML = data.another_email;
    document.getElementById("company-field").innerHTML = data.customer;
    document.getElementById("date-field").innerHTML = data.date;
    document.getElementById("location_field").innerHTML = data.location;
    document.getElementById("time-field").innerHTML = data.time.split(".")[0];
    document.querySelector(".tableBodyOfItems").innerHTML = "";

    let statusDiv = document.querySelector(".status");
    statusDiv.innerHTML = data.gate_pass_status;

    switch (data.gate_pass_status) {
        case "Pending":
            statusDiv.style.backgroundColor = "#ff7300";
            break;
        case "Approved":
            statusDiv.style.backgroundColor = "green";
            break;
        default:
            statusDiv.style.backgroundColor = "red";
            break;
    }

    data.gate_pass_items.forEach((item, index) => {
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
            
            <td>${data.name}</td>
            <td>${data.customer}</td>
            <td>${data.gate_pass_status}</td>
            <td>${data.location}</td>
        `;
    } else {
        tableRow.innerHTML = `
            <th>${slNo}</th>
            <td>${data.type}</td>
            <td>${data.name1}</td>
            <td>${data.quantity}</td>
        `;
    }
    tableBody.appendChild(tableRow);
}

//Updating status on click of submit
async function updateStatus() {
    //Status drop down value
    let dropdown = document.querySelector(".statusDropdown").value;

    if (dropdown !== "Pending") {
        let gatePassDoc = await frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Gate Pass",
                name: gatePassId,
            }
        });

        gatePassDoc = gatePassDoc.message;

        gatePassDoc.changed_by_cr = 1;
        gatePassDoc.gate_pass_status = dropdown;

        let updatedGatePassDoc = await frappe.call({
            method: "frappe.client.save",
            args: {
                doc: gatePassDoc
            }
        });

        if (updatedGatePassDoc) {
            toast.style.display = "contents";
            submitBtn.disabled = true;
            window.location.reload();
        }
    }
}
