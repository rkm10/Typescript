let submitBtn = document.querySelector(".submitBtn");
let toast = document.querySelector(".toast");
let gatePassId = "";
let currentPagePending = 1; // Current page number
let currentPageApproved = 1;  // Current page number
const itemsPerPage = 10; // Number of items per page for pending
const itemsPerApprovedpage = 5; //  Number of items per page for approved

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
            // fetchData(currentPagePending, currentPageApproved);

            document.querySelector(".current-page-pending").innerHTML = currentPagePending - 1;
        }
    });

    document.querySelector(".next-page-pending").addEventListener("click", () => {
        currentPagePending++;
        // fetchData(currentPagePending, currentPageApproved, true);
        document.querySelector(".current-page-pending").innerHTML = currentPagePending + 1;
    });

    document.querySelector(".prev-page-approved").addEventListener("click", () => {
        if (currentPageApproved > 1) {
            currentPageApproved--;
            fetchData(currentPagePending, currentPageApproved);

            document.querySelector(".current-page-approved").innerHTML = currentPageApproved - 1;
        }
    });

    document.querySelector(".next-page-approved").addEventListener("click", () => {
        currentPageApproved++;
        fetchData(currentPagePending, currentPageApproved, true);
        document.querySelector(".current-page-approved").innerHTML = currentPageApproved + 1;

    });
};

// Getting all gate pass data
async function fetchData(pagePending, pageApproved, checkData = false) {
    // Fetch Pending Gate Passes
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Gate Pass",
            fields: ['name', 'status', 'customer', 'location'],
            limit_start: (pagePending - 1) * itemsPerPage,
            limit_page_length: itemsPerPage,
            filters: [['status', '=', 'Pending']]
        },
        callback: function (response) {
            if (response.message.length === 0 && checkData) {
                currentPagePending--;
                return;
            }

            document.querySelector(".tableBody").innerHTML = "";

            response.message.forEach((res, index) => {
                constructTable(res, index + 1, "tableBody");
            });

            togglePaginationButtons('pending', response.message.length);
        }
    });

    // Fetch Approved Gate Passes
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Gate Pass",
            fields: ['name', 'status', 'customer', 'location'],
            limit_start: (pageApproved - 1) * itemsPerApprovedpage,
            limit_page_length: itemsPerApprovedpage,
            filters: [['status', '=', 'Approved']]
        },
        callback: function (response) {
            if (response.message.length === 0 && checkData) {
                currentPageApproved--;
                return;
            }

            document.querySelector(".tableBodyAccOrReg").innerHTML = "";

            response.message.forEach((res, index) => {
                constructTable(res, index + 1, "tableBodyAccOrReg");
            });

            togglePaginationButtons('approved', response.message.length);
        }
    });
};

// Toggle pagination buttons
function togglePaginationButtons(type, dataLength) {
    if (type === 'pending') {
        document.querySelector(".prev-page-pending").disabled = currentPagePending === 1;
        document.querySelector(".next-page-pending").disabled = dataLength < itemsPerPage;
    } else if (type === 'approved') {
        document.querySelector(".prev-page-approved").disabled = currentPageApproved === 1;
        document.querySelector(".next-page-approved").disabled = dataLength < itemsPerApprovedpage;
    }
}

// Show single gate pass data
function showDetails(id) {
    my_modal_3.showModal();
    submitBtn.disabled = false;
    toast.style.display = "none";
    gatePassId = id;
    fetchSingleData(id);
};

// Fetch single gate pass data
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

// Inserting data to single details form
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
    statusDiv.innerHTML = data.status;

    switch (data.status) {
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

// Utility function to create tables
function constructTable(data, slNo, tableName) {
    let tableBody = document.querySelector(`.${tableName}`);

    let tableRow = document.createElement("tr");
    tableRow.classList.add("hover", "tableRow");

    if (tableName === "tableBody" || tableName === "tableBodyAccOrReg") {
        tableRow.setAttribute("onClick", `showDetails('${data.name}')`);
        tableRow.innerHTML = `
            <td>${data.name}</td>
            <td>${data.customer}</td>
            <td>${data.status}</td>
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

// Updating status on click of submit
async function updateStatus() {
    // Status drop down value
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
        gatePassDoc.status = dropdown;

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
