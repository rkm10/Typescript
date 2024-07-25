let submitBtn = document.querySelector(".submitBtn");
let toast = document.querySelector(".toast");
let gatePassId = "";
let currentPagePending = 1; // Current page number for pending gate passes
let totalPagesPending = 1; // Total pages for pending gate passes
let currentPageApproved = 1; // Current page number for approved gate passes
let totalPagesApproved = 1; // Total pages for approved gate passes
const itemsPerPage = 10; // Number of items per page for pending gate passes
const itemsPerApprovedPage = 5; // Number of items per page for approved gate passes

frappe.ready(function () {
    console.clear();
    user = frappe.session.user;
    if (user === "Guest" || user === "guest") {
        my_modal_1.showModal()
        return;
    }
    main();
});

function main() {
    fetchTotalPages(); // Fetch total pages first
    fetchData(currentPagePending, currentPageApproved);

    submitBtn.addEventListener("click", updateStatus);

    // Pagination controls for pending gate passes
    document.querySelector(".prev-page-pending").addEventListener("click", () => {
        if (currentPagePending > 1) {
            currentPagePending--;
            fetchData(currentPagePending, currentPageApproved);
            document.querySelector("#current-page-pending").innerHTML = currentPagePending; // Update the current page number
        }
    });

    document.querySelector(".next-page-pending").addEventListener("click", () => {
        if (currentPagePending < totalPagesPending) {
            currentPagePending++;
            fetchData(currentPagePending, currentPageApproved, true);
            document.querySelector("#current-page-pending").innerHTML = currentPagePending; // Update the current page number
        }
    });

    // Pagination controls for approved gate passes
    document.querySelector(".prev-page-approved").addEventListener("click", () => {
        if (currentPageApproved > 1) {
            currentPageApproved--;
            fetchData(currentPagePending, currentPageApproved);
            document.querySelector("#current-page-approved").innerHTML = currentPageApproved; // Update the current page number
        }
    });

    document.querySelector(".next-page-approved").addEventListener("click", () => {
        if (currentPageApproved < totalPagesApproved) {
            currentPageApproved++;
            fetchData(currentPagePending, currentPageApproved, true);
            document.querySelector("#current-page-approved").innerHTML = currentPageApproved; // Update the current page number
        }
    });
}

// Fetch total pages for pending and approved gate passes
async function fetchTotalPages() {
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Gate Pass",
            fields: ['name'],
            filters: [['status', '=', 'Pending']]
        },
        callback: function (response) {
            let totalPendingRecords = response.message.length;
            totalPagesPending = Math.ceil(totalPendingRecords / itemsPerPage);
            document.querySelector("#total-pages-pending").innerHTML = totalPagesPending; // Display total pages for pending gate passes
        }
    });

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Gate Pass",
            fields: ['name'],
            filters: [['status', '=', 'Approved']]
        },
        callback: function (response) {
            let totalApprovedRecords = response.message.length;
            totalPagesApproved = Math.ceil(totalApprovedRecords / itemsPerApprovedPage);
            document.querySelector("#total-pages-approved").innerHTML = totalPagesApproved; // Display total pages for approved gate passes
            // console.log(totalPagesApproved);
        }
    });
}

// Fetching gate pass data
async function fetchData(pagePending, pageApproved, checkData = false) {
    // Fetch Pending Gate Passes
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Gate Pass",
            fields: ['name', 'status', 'customer', 'location'],
            limit_start: (pagePending - 1) * itemsPerPage, // Start from the previous page
            limit_page_length: itemsPerPage, // Number of items per page
            filters: [['status', '=', 'Pending']] // Filter by status
        },
        callback: function (response) {
            if (response.message.length === 0 && checkData) {
                currentPagePending--; // Decrement the current page number if no data is found
                return;
            }

            document.querySelector(".tableBody").innerHTML = "";

            response.message.forEach((res, index) => {
                constructTable(res, index + 1, "tableBody"); // Construct the table
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
            limit_start: (pageApproved - 1) * itemsPerApprovedPage, // Start from the previous page
            limit_page_length: itemsPerApprovedPage, // Number of items per page
            filters: [['status', '=', 'Approved']] // Filter by status
        },
        callback: function (response) {
            if (response.message.length === 0 && checkData) {
                currentPageApproved--; // Decrement the current page number if no data is found
                return;
            }

            document.querySelector(".tableBodyAccOrReg").innerHTML = "";

            response.message.forEach((res, index) => {
                constructTable(res, index + 1, "tableBodyAccOrReg"); // Construct the table
            });

            togglePaginationButtons('approved', response.message.length);
        }
    });
}

// Toggle pagination buttons
function togglePaginationButtons(type, dataLength) {
    if (type === 'pending') {
        document.querySelector(".prev-page-pending").disabled = currentPagePending === 1; // Disable the previous button if on the first page
        document.querySelector(".next-page-pending").disabled = currentPagePending === totalPagesPending; // Disable the next button if on the last page
    } else if (type === 'approved') {
        document.querySelector(".prev-page-approved").disabled = currentPageApproved === 1; // Disable the previous button if on the first page
        document.querySelector(".next-page-approved").disabled = currentPageApproved === totalPagesApproved; // Disable the next button if on the last page
    }
}

// Show single gate pass data
function showDetails(id) {
    my_modal_3.showModal();
    submitBtn.disabled = false;
    toast.style.display = "none";
    gatePassId = id;
    fetchSingleData(id);
}

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
            // console.log(response.message);
            if (response.message.status === "Approved") {
                submitBtn.disabled = true;
            }
        }
    });
}

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

    // Set status color based on status
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
        constructTable(item, index + 1, "tableBodyOfItems"); // Construct the table
    });
}

// Utility function to create tables
function constructTable(data, slNo, tableName) {
    let tableBody = document.querySelector(`.${tableName}`);
    console.log(data);

    let tableRow = document.createElement("tr");
    tableRow.classList.add("hover", "tableRow");


    // Set onClick attribute based on table name
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

// Update status
async function updateStatus() {
    submitBtn.disabled = true;

    frappe.call({
        method: "frappe.client.set_value",
        args: {
            doctype: "Gate Pass",
            name: gatePassId,
            fieldname: {
                status: "Approved"
            }
        },
        callback: function (response) {
            toast.style.display = "block";
            toast.innerHTML = "Gate pass updated successfully.";
            submitBtn.disabled = true;
            fetchData(currentPagePending, currentPageApproved); // Refresh data
        }
    });
}
