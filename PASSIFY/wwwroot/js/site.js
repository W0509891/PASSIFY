// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

let tablerows = document.querySelectorAll("tbody tr");

let description = document.querySelectorAll("th:nth-of-type(2), td:nth-of-type(2)");


let url = window.location.href
console.log(url.split("/"));
let controller = url.split("/").pop();
console.log(controller);
tablerows.forEach(row => {
	row.addEventListener('click', function () {
		const id = this.getAttribute('data-id');
		console.log(getPreviousPage());
		switch (controller) {
			case "Organizers":
				goToPage("Organizers", "Details", id);
				break;

			case "Categories":
				goToPage("Categories", "Details", id);
				break;
				
			case "Purchases":
				goToPage("Purchases", "Edit", id);
				break;

			default:
				goToPage("Activities", "Details", id);
		}
		storeCookie("lastPage", getPreviousPage())
	});
});


function handleTableRowClick(title) {
	console.log('Clicked row with title:', title);
}

function goToPage(controller, action, id) {
	let page = `/${controller}/${action}/${id}`
	window.location.href = page;
}

function storeCookie(name, value) {
	document.cookie = `${name}=${value}; path=/`;
}

function getPreviousPage() {
	return document.URL.valueOf();
}

function searchTable(value) {
	const table = document.querySelector("table");
	const rows = document.querySelectorAll("tbody tr");
	const existingMessage = document.getElementById("no-results");

	let results = 0;

	rows.forEach(row => {
		const rowData = row.textContent.toLowerCase();

		if (rowData.includes(value.toLowerCase())) {
			row.style.display = "";
			results++;
		} else {
			row.style.display = "none";
		}
	});

	if (results === 0) {
		if (!existingMessage) {
			const p = document.createElement("p");
			p.className = "text-center text-danger bg mt-3 p-3";
			p.id = "no-results";
			p.textContent = "No results found";

			table.insertAdjacentElement("afterend", p);
		}
	} else {
		existingMessage?.remove();
	}
}