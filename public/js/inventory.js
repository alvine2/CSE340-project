'use strict'

let classificationList = document.querySelector("#classificationList")

if (classificationList) {
    console.log("Found classification list element");
    
    classificationList.addEventListener("change", function () { 
        let classification_id = classificationList.value 
        
        if (!classification_id) {
            console.log("No classification selected");
            return;
        }
        
        console.log(`classification_id is: ${classification_id}`) 
        
        let inventoryDisplay = document.getElementById("inventoryDisplay");
        if (inventoryDisplay) {
            inventoryDisplay.innerHTML = '<p>Loading inventory...</p>';
        }
        
        let classIdURL = "/inv/getInventory/" + classification_id 
        console.log("Fetching URL:", classIdURL);
        
        fetch(classIdURL) 
        .then(function (response) { 
            if (response.ok) { 
                return response.json(); 
            } 
            throw Error("Network response was not OK"); 
        }) 
        .then(function (data) { 
            console.log("Data received:", data); 
            buildInventoryList(data); 
        }) 
        .catch(function (error) { 
            console.log('There was a problem: ', error.message);
            let inventoryDisplay = document.getElementById("inventoryDisplay");
            if (inventoryDisplay) {
                inventoryDisplay.innerHTML = '<p class="error">Error loading inventory. Please try again.</p>';
            }
        }) 
    })
} else {
    console.error("Classification list element not found");
}
 
function buildInventoryList(data) { 
    let inventoryDisplay = document.getElementById("inventoryDisplay"); 
    
    if (!inventoryDisplay) {
        console.error("Inventory display element not found");
        return;
    }
    
    inventoryDisplay.innerHTML = "";
    
    if (!data || data.length === 0) {
        inventoryDisplay.innerHTML = '<p class="no-data">No vehicles found for this classification.</p>';
        return;
    }
    
    let table = document.createElement('table');
    table.className = 'inventory-table';
    
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    
    let headers = ['Vehicle Name', 'Year', 'Price', 'Actions'];
    headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    let tbody = document.createElement('tbody');
    
    data.forEach(function (element) { 
        console.log(`Processing vehicle: ${element.inv_id}, ${element.inv_make} ${element.inv_model}`);
        
        let row = document.createElement('tr');
        
        let nameCell = document.createElement('td');
        nameCell.textContent = `${element.inv_make} ${element.inv_model}`;
        row.appendChild(nameCell);
        
        let yearCell = document.createElement('td');
        yearCell.textContent = element.inv_year;
        row.appendChild(yearCell);
        
       
        let priceCell = document.createElement('td');
        priceCell.textContent = `$${parseFloat(element.inv_price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        row.appendChild(priceCell);
        
        
        let actionsCell = document.createElement('td');
        actionsCell.className = 'actions';
      
        let modifyLink = document.createElement('a');
        modifyLink.href = `/inv/edit/${element.inv_id}`;
        modifyLink.title = 'Click to update';
        modifyLink.textContent = 'Modify';
        modifyLink.className = 'btn modify-btn';
        actionsCell.appendChild(modifyLink);
        
        actionsCell.appendChild(document.createTextNode(' '));
        
        let deleteLink = document.createElement('a');
        deleteLink.href = `/inv/delete/${element.inv_id}`;
        deleteLink.title = 'Click to delete';
        deleteLink.textContent = 'Delete';
        deleteLink.className = 'btn delete-btn';
        actionsCell.appendChild(deleteLink);
        
        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    inventoryDisplay.appendChild(table);
}

// Optional: Trigger change event on page load if there's a default selection
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inventory management page loaded');
    
    // Check if classification list has a value and trigger change
    if (classificationList && classificationList.value) {
        console.log('Triggering initial load for selected classification');
        classificationList.dispatchEvent(new Event('change'));
    }
});