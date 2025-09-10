// Use OpenSheet to fetch data from Google Sheets
const PUBLIC_SHEET_ID = "2PACX-1vTP8awohbDH5EJBxJeHzsymKCqyYRSvSzIR-1GgTXNdjibDS4O_DWG8bMmsyIjhva08o97OY77dAraG";

let allServices = [];
let allSales = [];
let allProperties = [];

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  document.getElementById("sale-form").addEventListener("submit", handleSaleUpload);
  document.getElementById("searchInput").addEventListener("input", handleSearch);
});

async function loadData() {
  try {
    const services = await fetch(`https://opensheet.elk.sh/${PUBLIC_SHEET_ID}/Services`).then(r => r.json());
    const sales = await fetch(`https://opensheet.elk.sh/${PUBLIC_SHEET_ID}/Things for Sale`).then(r => r.json());
    const properties = await fetch(`https://opensheet.elk.sh/${PUBLIC_SHEET_ID}/Properties`).then(r => r.json());

    allServices = services;
    allSales = sales;
    allProperties = properties;

    renderServices(services);
    renderSales(sales);
    renderProperties(properties);
  } catch (err) {
    console.error("Error loading data from Google Sheets:", err);
  }
}

function renderServices(services) {
  const list = document.getElementById("services-list");
  list.innerHTML = "";
  services.forEach(service => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${service.Name || ""}</h3>
      <p><strong>Phone:</strong> ${service.Phone || ""}</p>
      <p><strong>Email:</strong> ${service.Email || ""}</p>
      <p><strong>Website:</strong> <a href="${service.Website || "#"}" target="_blank">${service.Website || ""}</a></p>
      <p>${service.Description || ""}</p>
      <p>⭐ ${"★".repeat(parseInt(service.Stars || 0))}</p>
      ${service.Photo ? `<img src="${service.Photo}" alt="Service photo">` : ""}
    `;
    list.appendChild(div);
  });
}

function renderSales(sales) {
  const list = document.getElementById("sales-list");
  list.innerHTML = "";
  sales.forEach(item => {
    const photos = item.Photos ? item.Photos.split(",").map(p => `<img src="${p.trim()}" alt="Item photo">`).join("") : "";
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${item.Title || ""}</h3>
      <p>${item.Description || ""}</p>
      <p><strong>Price:</strong> ${item.Price || ""}</p>
      ${photos}
    `;
    list.appendChild(div);
  });
}

function renderProperties(properties) {
  const list = document.getElementById("properties-list");
  list.innerHTML = "";
  properties.forEach(property => {
    const photos = property.Photos ? property.Photos.split(",").map(p => `<img src="${p.trim()}" alt="Property photo">`).join("") : "";
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${property.Title || ""}</h3>
      <p><strong>Type:</strong> ${property.Type || ""}</p>
      <p><strong>Square meters:</strong> ${property.SquareMeters || ""}</p>
      <p><strong>Years old:</strong> ${property.YearsOld || ""}</p>
      <p><strong>Phone:</strong> ${property.Phone || ""}</p>
      <p>${property.Description || ""}</p>
      ${photos}
    `;
    list.appendChild(div);
  });
}

// Simple admin-only demo form (local only)
function handleSaleUpload(event) {
  event.preventDefault();
  const title = document.getElementById("sale-title").value;
  const description = document.getElementById("sale-description").value;
  const price = document.getElementById("sale-price").value;
  const photosInput = document.getElementById("sale-photos").files;

  let photoURLs = [];
  for (let file of photosInput) {
    photoURLs.push(URL.createObjectURL(file));
  }

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <p><strong>Price:</strong> ${price}</p>
    ${photoURLs.map(url => `<img src="${url}" alt="Uploaded photo">`).join("")}
  `;
  document.getElementById("sales-list").appendChild(div);

  event.target.reset();
}

function handleSearch(event) {
  const term = event.target.value.toLowerCase();
  const filtered = allServices.filter(s =>
    (s.Name || "").toLowerCase().includes(term) ||
    (s.Description || "").toLowerCase().includes(term)
  );
  renderServices(filtered);
}
