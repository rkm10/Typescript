// script.js file

function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


domReady(function () {

    function onScanSuccess(decodeText, decodeResult) {
        return new Promise((resolve, reject) => {
            try {
                gatePass = decodeText;
                document.getElementById('overlay').style.display = 'block';
                document.getElementById('popup').style.display = 'block';

                //resolve(decodeText);
                resolve(gatePass);

            } catch (error) {
                //reject if cant decode
                reject(error);
            }

        })

    }


    // Usage of the Promise
    domReady(function () {
        let htmlscanner = new Html5QrcodeScanner(
            "my-qr-reader",
            { fps: 10, qrbox: 250 }
        );

        htmlscanner.render((decodeText, decodeResult) => {
            onScanSuccess(decodeText, decodeResult).then((gatePass) => {
                console.log("Scanned code:", gatePass);

                // Fetch and display data using the gatePass
                sub(gatePass);
            }).catch((error) => {
                console.error("Error scanning QR code:", error);
            });
        });

        document.getElementById('popup-close').addEventListener('click', function () {
            closePopup();
        });

        document.getElementById('popup-close1').addEventListener('click', function () {
            closePopup();
        });

        function closePopup() {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('popup').style.display = 'none';
            window.location.reload();
        }
    });
});

function sub(gatePass) {
    fetchData(gatePass);
};

if (gatePass) {
    frappe.ready(function () {
        sub();
    })
}

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


