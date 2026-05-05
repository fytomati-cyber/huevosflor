const form = document.getElementById('ventaForm');
const tabla = document.getElementById('tablaVentas').querySelector('tbody');
const totalCartones = document.getElementById('total');
const totalVentas = document.getElementById('totalVentas'); // nuevo total en dinero
let acumuladoCartones = 0;
let acumuladoVentas = 0;

// Valores por tamaño
const precios = {
  "Chico": 3500,
  "Mediano": 4500,
  "Grande": 5500
};

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const tamanoSeleccionado = document.querySelector('input[name="tamano"]:checked');
  const cantidad = parseInt(document.getElementById('cantidad').value);

  if (!tamanoSeleccionado || cantidad <= 0) return;

  const tamano = tamanoSeleccionado.value;
  const precioUnitario = precios[tamano];
  const subtotal = precioUnitario * cantidad;

  // Crear fila con botón eliminar
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

  form.reset();
});

// Delegación de eventos para eliminar ventas
tabla.addEventListener('click', function(event) {
  if (event.target.classList.contains('eliminar')) {
    const fila = event.target.closest('tr');
    const cantidad = parseInt(fila.children[1].textContent);
    const subtotal = parseInt(fila.children[2].textContent.replace('$',''));

    acumuladoCartones -= cantidad;
    acumuladoVentas -= subtotal;

    totalCartones.textContent = acumuladoCartones;
    totalVentas.textContent = `$${acumuladoVentas}`;

    fila.remove();
  }
});

