// Store package data
const packages = [];

function validatePackageData(name, packageID, address, weight) {
    const errors = [];
    if (!name || /[^a-zA-Z\s]/.test(name)) errors.push("Invalid Recipient Name.");
    if (!packageID || isNaN(packageID)) errors.push("Package ID must be numeric.");
    if (!address || /\d/.test(address)) errors.push("Invalid Delivery Address.");
    if (!weight || isNaN(weight) || weight <= 0) errors.push("Weight must be a positive number.");
    return errors;
}

function generateTrackingCode(packageID, weight) {
    return (parseInt(packageID) << 3) | Math.round(weight);
}

function displayErrors(errors) {
    const messageDiv = document.getElementById("messages");
    messageDiv.innerHTML = `<p class="error">${errors.join("<br>")}</p>`;
}

function displaySuccess(message) {
    const messageDiv = document.getElementById("messages");
    messageDiv.innerHTML = `<p class="success">${message}</p>`;
}

function updateTable() {
    const tableBody = document.querySelector("#packageTable tbody");
    tableBody.innerHTML = ""; // Clear the table
    const sortedPackages = packages.sort((a, b) => a.weight - b.weight);
    sortedPackages.forEach(pkg => {
        const row = `<tr>
            <td>${pkg.name}</td>
            <td>${pkg.packageID}</td>
            <td>${pkg.address}</td>
            <td>${pkg.weight}</td>
            <td>${pkg.trackingCode}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

document.getElementById("packageForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById("recipientName").value;
    const packageID = document.getElementById("packageID").value;
    const address = document.getElementById("deliveryAddress").value;
    const weight = parseFloat(document.getElementById("weight").value);

    const errors = validatePackageData(name, packageID, address, weight);
    if (errors.length > 0) {
        displayErrors(errors);
        return;
    }

    const trackingCode = generateTrackingCode(packageID, weight);
    packages.push({ name, packageID, address, weight, trackingCode: "0b" + trackingCode.toString(2) });

    displaySuccess(`Package added successfully! Tracking Code: 0b${trackingCode.toString(2)}`);
    updateTable();

    // Clear form
    document.getElementById("packageForm").reset();
});
