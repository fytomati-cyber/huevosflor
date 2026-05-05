const form = document.getElementById('ventaForm');
const tabla = document.getElementById('tablaVentas').querySelector('tbody');
const totalCartones = document.getElementById('total');
const totalVentas = document.getElementById('totalVentas');
const configForm = document.getElementById('configMenu');
let acumuladoCartones = 0;
let acumuladoVentas = 0;

// --- 1. Cargar precios desde LocalStorage o usar valores por defecto ---
let precios = JSON.parse(localStorage.getItem("precios")) || {
  chico: 3500,
  mediano: 4500,
  grande: 5500,
  jumbo: 6500
};

// Mostrar valores en el formulario de configuración
document.getElementById("precioChico").value = precios.chico;
document.getElementById("precioMediano").value = precios.mediano;
document.getElementById("precioGrande").value = precios.grande;
document.getElementById("precioJumbo").value = precios.jumbo;

// --- 2. Guardar cambios de configuración ---
configForm.addEventListener("submit", function(e) {
  e.preventDefault();
  precios.chico = parseInt(document.getElementById("precioChico").value);
  precios.mediano = parseInt(document.getElementById("precioMediano").value);
  precios.grande = parseInt(document.getElementById("precioGrande").value);
  precios.jumbo = parseInt(document.getElementById("precioJumbo").value);

  localStorage.setItem("precios", JSON.stringify(precios));
  alert("Configuración guardada correctamente ✅");
});

// --- 3. Cargar historial de ventas ---
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
ventas.forEach(v => agregarFila(v.tamano, v.cantidad, v.subtotal));

// --- Función para agregar fila ---
function agregarFila(tamano, cantidad, subtotal) {
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${tamano}</td>
    <td>${cantidad}</td>
    <td>$${subtotal}</td>
    <td><button class="eliminar" style="background-color:#e63946;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">🗑️ Eliminar</button></td>
  `;
  tabla.appendChild(fila);

  acumuladoCartones += cantidad;
  acumuladoVentas += subtotal;

  totalCartones.textContent = acumuladoCartones;
  totalVentas.textContent = `$${acumuladoVentas}`;
}

// --- Registrar nueva venta ---
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const tamanoSeleccionado = document.querySelector('input[name="tamano"]:checked');
  const cantidad = parseInt(document.getElementById('cantidad').value);

  if (!tamanoSeleccionado || cantidad <= 0) return;

  const tamano = tamanoSeleccionado.value.toLowerCase();
  const precioUnitario = precios[tamano];
  const subtotal = precioUnitario * cantidad;

  // Guardar en historial
  const venta = { tamano, cantidad, subtotal };
  ventas.push(venta);
  localStorage.setItem("ventas", JSON.stringify(ventas));

  agregarFila(tamano, cantidad, subtotal);
  form.reset();
});

// --- Eliminar ventas ---
tabla.addEventListener('click', function(event) {
  if (event.target.classList.contains('eliminar')) {
    const fila = event.target.closest('tr');
    const tamano = fila.children[0].textContent.toLowerCase();
    const cantidad = parseInt(fila.children[1].textContent);
    const subtotal = parseInt(fila.children[2].textContent.replace('$',''));

    acumuladoCartones -= cantidad;
    acumuladoVentas -= subtotal;

    totalCartones.textContent = acumuladoCartones;
    totalVentas.textContent = `$${acumuladoVentas}`;

    // Actualizar historial
    ventas = ventas.filter(v => !(v.tamano === tamano && v.cantidad === cantidad && v.subtotal === subtotal));
    localStorage.setItem("ventas", JSON.stringify(ventas));

    fila.remove();
  }
});

// --- 4. Filtro por tamaño ---
function filtrarVentas(tamano) {
  tabla.innerHTML = "";
  acumuladoCartones = 0;
  acumuladoVentas = 0;

  const filtradas = ventas.filter(v => v.tamano === tamano.toLowerCase());
  filtradas.forEach(v => agregarFila(v.tamano, v.cantidad, v.subtotal));
}