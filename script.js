let submitBtn = document.querySelector(".submitBtn");
let toast = document.querySelector(".toast");
let printRequestId = "";
let currentPagePending = 1; // Current page number
let currentPageApproved = 1;  // Current page number
const itemsPerPage = 10; // Number of items per page for pending
const itemsPerApprovedpage = 5; //  Number of items per page for approved

frappe.ready(function () {
    console.clear();
    main();
});

function main() {
    fetchData();

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
        currentPagePending++;
        fetchData(currentPagePending, currentPageApproved, true);
        document.querySelector("#current-page-pending").innerHTML = currentPagePending; // Update the current page number
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
        currentPageApproved++;
        fetchData(currentPagePending, currentPageApproved, true);
        document.querySelector("#current-page-approved").innerHTML = currentPageApproved; // Update the current page number

    });
};

// //Getting all Print Request data
// async function fetchData() {
//     frappe.call({
//         method: "frappe.client.get_list",
//         args: {
//             doctype: "Print Request",
//             fields: ['name', 'full_name', 'status', 'customer', 'location'],
//             limit_page_length: 0,
//         },
//         callback: function (response) {
//             response.message.forEach((res, index) => {
//                 if (res.status === "Pending") {
//                     constructTable(res, index + 1, "tableBody");
//                 } else {
//                     constructTable(res, index + 1, "tableBodyAccOrReg");
//                 }
//             });
//         }
//     });
// };

// Getting all gate pass data
async function fetchData(pagePending, pageApproved, checkData = false) {
    // Fetch Pending Gate Passes
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Print Request",
            fields: ['name', 'full_name', 'status', 'customer', 'location'],
            limit_start: (pagePending - 1) * itemsPerPage, // Start from the previous page
            limit_page_length: itemsPerPage,             // Number of items per page
            filters: [['status', '=', 'Pending']]         // Filter by status
        },
        callback: function (response) {
            if (response.message.length === 0 && checkData) {
                currentPagePending--;       // Decrement the current page number if no data is found
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
            doctype: "Print Request",
            fields: ['name', 'full_name', 'status', 'customer', 'location'],
            limit_start: (pageApproved - 1) * itemsPerApprovedpage,         // Start from the previous page
            limit_page_length: itemsPerApprovedpage,    // Number of items per page
            filters: [['status', '!=', 'pending']]         // Filter by status
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
};




// Toggle pagination buttons
function togglePaginationButtons(type, dataLength) {
    if (type === 'pending') {
        document.querySelector(".prev-page-pending").disabled = currentPagePending === 1;  // Disable the previous button if on the first page
        document.querySelector(".next-page-pending").disabled = dataLength < itemsPerPage;  // Disable the next button if there are no more items
    } else if (type === 'approved') {
        document.querySelector(".prev-page-approved").disabled = currentPageApproved === 1; // Disable the previous button if on the first page
        document.querySelector(".next-page-approved").disabled = dataLength < itemsPerApprovedpage; // Disable the next button if there are no more items
    }
}

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
    document.getElementById("price-field").innerHTML = data.total_price;
    document.getElementById("date-field").innerHTML = data.modified.split(" ")[0];
    document.getElementById("time-field").innerHTML = data.modified.split(" ")[1].split(".")[0];
    document.querySelector(".tableBodyOfItems").innerHTML = "";

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