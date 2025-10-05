/ --- CLIENTE SUPABASE ---
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- REFERENCIAS A ELEMENTOS HTML ---
const reporteContainer = document.getElementById('reporte-container');
const cargandoDiv = document.getElementById('cargando');
const botonVolver = document.getElementById('boton-volver');
const botonInstalar = document.getElementById('boton-instalar');
const headerTitle = document.getElementById('header-title');
const lastUpdated = document.getElementById('last-updated');
const sucursalModal = document.getElementById('sucursal-modal');
const botonAbrirModal = document.getElementById('boton-abrir-modal');
const cerrarModal = document.getElementById('cerrar-modal');
const sucursalList = document.getElementById('sucursal-list');
const iosInstallModal = document.getElementById('ios-install-modal');

// --- ALMACÉN DE DATOS Y ESTADO ---
let reporteCompleto = {}; 
let deferredInstallPrompt;
let updateInterval = null;
let slideshowInterval = null;
let sucursalKeys = [];
let slideIndex = 0;

// --- LÓGICA DE INSTALACIÓN PWA (sin cambios) ---
window.addEventListener('beforeinstallpromptevent', (e) => { e.preventDefault(); deferredInstallPrompt = e; botonInstalar.style.display = 'flex'; });
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) { botonInstalar.style.display = 'flex'; }
botonInstalar.addEventListener('click', () => {
    if (isIOS) { iosInstallModal.style.display = 'flex'; }
    else if (deferredInstallPrompt) { deferredInstallPrompt.prompt(); deferredInstallPrompt.userChoice.then((c) => { if (c.outcome === 'accepted') { botonInstalar.style.display = 'none'; } deferredInstallPrompt = null; }); }
});
document.querySelector('.modal-button-ios').addEventListener('click', () => { iosInstallModal.style.display = 'none'; });

// --- LÓGICA DE VISUALIZACIÓN ---
function crearTarjetaSucursalHTML(nombre, datos, esSlide = false) {
    let itemsHTML = '';
    const metodosOrdenados = datos.metodos ? Object.keys(datos.metodos).sort() : [];
    for (const metodo of metodosOrdenados) { itemsHTML += `<div class="list-item"><span class="metodo">${metodo}</span><span class="monto">$${datos.metodos[metodo].toFixed(2)}</span></div>`; }
    itemsHTML += `<div class="list-item total-general"><span>TOTAL</span><span>$${(datos.TOTAL || 0).toFixed(2)}</span></div>`;
    return `<div class="sucursal-card ${esSlide ? 'slide' : ''}" data-sucursal="${nombre}"><div class="sucursal-header">${nombre}</div>${itemsHTML}</div>`;
}

function renderizarVistaCompleta() {
    stopSlideshow();
    reporteContainer.innerHTML = ''; botonVolver.style.display = 'none'; headerTitle.textContent = 'Ventas de Hoy';
    let hayVentas = false;
    sucursalKeys = Object.keys(reporteCompleto).sort();
    sucursalKeys.forEach(nombreSucursal => {
        const datosSucursal = reporteCompleto[nombreSucursal];
        if (datosSucursal && datosSucursal.TOTAL > 0) {
            reporteContainer.innerHTML += crearTarjetaSucursalHTML(nombreSucursal, datosSucursal, true);
            hayVentas = true;
        }
    });
    if (!hayVentas) { reporteContainer.innerHTML = `<div class="sucursal-card"><p style="padding: 20px; text-align: center;">No hay ventas registradas hoy.</p></div>`; }
    else { startSlideshow(); }
}

function renderizarVistaUnica(nombreSucursal) {
    stopSlideshow();
    reporteContainer.innerHTML = ''; botonVolver.style.display = 'block'; headerTitle.textContent = nombreSucursal;
    const datosSucursal = reporteCompleto[nombreSucursal];
    if (datosSucursal && datosSucursal.TOTAL > 0) { reporteContainer.innerHTML = crearTarjetaSucursalHTML(nombreSucursal, datosSucursal); }
    else { reporteContainer.innerHTML = `<div class="sucursal-card"><p style="padding: 20px; text-align: center;">No hay ventas registradas hoy en ${nombreSucursal}.</p></div>`; }
}

// --- LÓGICA DEL SLIDESHOW ---
function startSlideshow() {
    stopSlideshow(); // Asegurarse de que no hay otro slideshow corriendo
    const slides = document.querySelectorAll('.slide');
    if (slides.length < 2) {
        if (slides.length === 1) slides[0].classList.add('active');
        return; // No iniciar slideshow si hay 1 o 0 slides
    }
    slideIndex = 0;
    slides.forEach(slide => slide.classList.remove('active'));
    slides[slideIndex].classList.add('active');
    
    slideshowInterval = setInterval(() => {
        slides[slideIndex].classList.remove('active');
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('active');
    }, 5000); // Cambia de slide cada 5 segundos
}

function stopSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = null;
}

// --- LÓGICA DE ACTUALIZACIÓN ---
async function actualizarReporte() {
    lastUpdated.textContent = 'Actualizando...';
    try {
        const { data, error } = await supabaseClient.rpc('generar_reporte_diario');
        if (error) throw error;
        reporteCompleto = data || {};
        
        // Re-renderizar la vista actual con los datos frescos
        const isSingleView = botonVolver.style.display === 'block';
        if (isSingleView) { renderizarVistaUnica(headerTitle.textContent); } 
        else { renderizarVistaCompleta(); }
        
        lastUpdated.textContent = `Última actualización: ${new Date().toLocaleTimeString('es-PA')}`;
    } catch (error) { console.error('Error al actualizar:', error); lastUpdated.textContent = 'Error al actualizar.'; }
}

// --- LÓGICA DE INICIO ---
async function iniciarApp() {
    cargandoDiv.style.display = 'flex';
    
    await actualizarReporte(); // Llama a la función que ahora obtiene TODOS los datos

    // Poblar la lista del modal de sucursales
    sucursalList.innerHTML = '';
    Object.keys(reporteCompleto).sort().forEach(nombre => {
        const btn = document.createElement('button');
        btn.className = 'sucursal-btn';
        btn.textContent = nombre;
        btn.onclick = () => {
            renderizarVistaUnica(nombre);
            sucursalModal.style.display = 'none';
        };
        sucursalList.appendChild(btn);
    });
    
    cargandoDiv.style.display = 'none';
    
    // Iniciar el auto-refresco
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(actualizarReporte, 60000);
}

// --- EVENTOS ---
botonVolver.addEventListener('click', renderizarVistaCompleta);
botonAbrirModal.addEventListener('click', () => { sucursalModal.style.display = 'flex'; });
cerrarModal.addEventListener('click', () => { sucursalModal.style.display = 'none'; });
document.addEventListener('DOMContentLoaded', iniciarApp);
