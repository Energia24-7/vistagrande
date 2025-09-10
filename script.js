// 👇 Replace with your real Google Sheet ID
const PUBLIC_SHEET_ID = '2PACX-1vTP8awohbDH5EJBxJeHzsymKCqyYRSvSzIR-1GgTXNdjibDS4O_DWG8bMmsyIjhva08o97OY77dAraG';

let allServices = [];
let allSales = [];
let allProperties = [];

document.addEventListener("DOMContentLoaded", () => {
  Tabletop.init({
    key: PUBLIC_SHEET_ID,
    callback: loadData,
    simpleSheet: false
  });

  document.getElementById("sale-form").addEventListener("submit", handleSaleUpload);
  document.getElementById("searchInput").addEventListener("input", handleSearch);
});

function loadData(data) {
  const services = data["Services"]?.elements || [];
  const sales = data["Things for Sale"]?.elements || [];
  const properties = data["Properties"]?.elements || [];

  allServices = services;
  allSales = sales;
  allProperties = properties;

  renderServices(services);
  renderSales(sales);
  renderProperties(properties);
}

function renderServices(data) {
  const c = document.getElementById("services-container");
  c.innerHTML = "";
  data.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    let imgs = "";
    for (let i = 1; i <= 5; i++) {
      const url = s[`Photo${i}`];
      if (url) imgs += `<img src="${url}" alt="Foto ${i} de ${s.Name}">`;
    }
    card.innerHTML = `
      <h3>${s.Name}</h3>
      ${imgs ? `<div class="photos">${imgs}</div>` : ""}
      <p><strong>Categoría:</strong> ${s.Category}</p>
      <p><strong>Tel:</strong> ${s.Phone}</p>
      <p><strong>Email:</strong> ${s.Email}</p>
      ${s.Website ? `<p><a href="${s.Website}" target="_blank">Sitio Web</a></p>` : ""}
      <p><strong>Recomendación:</strong> ${s.Recommendation}</p>
      <p><strong>Calidad:</strong> ${"★".repeat(s.Rating)}${"☆".repeat(5 - s.Rating)}</p>
    `;
    c.appendChild(card);
  });
}

function renderSales(data) {
  const c = document.getElementById("sale-gallery");
  c.innerHTML = "";
  data.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    let imgs = "";
    for (let i = 1; i <= 5; i++) {
      const url = s[`Photo${i}`];
      if (url) imgs += `<img src="${url}" alt="Foto ${i}">`;
    }
    card.innerHTML = `
      <h3>${s.Description}</h3>
      <p><strong>Categoría:</strong> ${s.Category}</p>
      <p><strong>Precio:</strong> ${s.Price} ${s.Currency}</p>
      ${imgs ? `<div class="photos">${imgs}</div>` : ""}
    `;
    c.appendChild(card);
  });
}

function renderProperties(data) {
  const c = document.getElementById("properties-container");
  c.innerHTML = "";
  data.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    let imgs = "";
    for (let i = 1; i <= 5; i++) {
      const u = p[`Photo${i}`];
      if (u) imgs += `<img src="${u}" alt="Foto ${i} de ${p.Name}">`;
    }
    card.innerHTML = `
      <h3>${p.Name} – ${p.Action}</h3>
      <p><strong>Tipo:</strong> ${p.Type}</p>
      <p><strong>Área:</strong> ${p.SquareMeters} m²</p>
      <p><strong>Años:</strong> ${p.YearsOld}</p>
      <p><strong>Tel:</strong> ${p.ContactPhone}</p>
      <p><strong>Precio:</strong> ${p.Price} ${p.Currency}</p>
      <p><strong>Descripción:</strong> ${p.Description}</p>
      ${imgs ? `<div class="photos">${imgs}</div>` : ""}
    `;
    c.appendChild(card);
  });
}

function handleSaleUpload(e) {
  e.preventDefault();
  const form = e.target;
  const desc = form.querySelector('input[type="text"]').value;
  const files = form.querySelector('input[type="file"]').files;
  const gallery = document.getElementById("sale-gallery");

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<p>${desc}</p><img src="${reader.result}" style="width:100%;">`;
      gallery.appendChild(card);
    };
    reader.readAsDataURL(file);
  });

  form.reset();
}

function handleSearch(e) {
  const term = e.target.value.toLowerCase();
  const filtered = allServices.filter(s =>
    s.Name.toLowerCase().includes(term) || s.Category.toLowerCase().includes(term)
  );
  renderServices(filtered);
}

function validateAdmin() {
  const password = document.getElementById("admin-pass").value;
  if (password === "admin123") {
    document.getElementById("sale-form").style.display = "block";
    document.getElementById("admin-login").style.display = "none";
  } else {
    alert("Contraseña incorrecta.");
  }
}
