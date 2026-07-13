/**
 * PORTERO SEGURO - Control de Estaciones
 * Motor de Operaciones Conectado a Supabase Cloud
 */

(function () {
    'use strict';

    // 🔑 CREDENCIALES CONFIGURADAS DE TU PROYECTO SUPABASE
    const SUPABASE_URL = 'https://sxwrqubwudaswylgyqwr.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_KgO5as2wy56z-NKg-d2jjA_ts4ZeM1o';

    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };

    // 📥 BASE DE DATOS INTEGRADA PARA EL DESPLEGABLE DE ASESORES
    const EXCEL_DATABASE = [
      { "dni": "74175497", "nombre": "Luis Martin Julian Barreto", "area": "Vigilancia" },
      { "dni": "70988326", "nombre": "Jimenez Villanueva Mirian Paola", "area": "Vigilancia" },
      { "dni": "70887845", "nombre": "José Luis Romero Valdivia", "area": "Vigilancia" },
      { "dni": "48559388", "nombre": "Gustavo Adolfo Camisan Juarez", "area": "Vigilancia" },
      { "dni": "007280177", "nombre": "Ortiz Chavarría María Eugenia", "area": "Vigilancia" },
      { "dni": "42279562", "nombre": "Susan Juárez Avalos", "area": "Vigilancia" },
      { "dni": "41774675", "nombre": "Patricia Panduro Cardenas", "area": "ATC" },
      { "dni": "7495214", "nombre": "Wendy Valle Vidales", "area": "Fidelización" },
      { "dni": "75500377", "nombre": "Diego Pastor Arenas Ortiz", "area": "Vigilancia" },
      { "dni": "76472751", "nombre": "César Sebastian Porras Urbina", "area": "Vigilancia" },
      { "dni": "78008029", "nombre": "Carlos Enrique Cruz Garcia", "area": "Vigilancia" },
      { "dni": "77098771", "nombre": "Angie Liz Aguilar Valles", "area": "Vigilancia" },
      { "dni": "72359708", "nombre": "Regina Giribaldi Carrasco", "area": "Vigilancia" },
      { "dni": "48005722", "nombre": "Bani Carrera Ruiz", "area": "Vigilancia" },
      { "dni": "74436356", "nombre": "Bryan Jiménez Loarte", "area": "Vigilancia" },
      { "dni": "70779115", "nombre": "Eliseo Gabriel Toledo Albarran", "area": "Vigilancia" },
      { "dni": "75270256", "nombre": "Alejandro Omar Salas Torres", "area": "Vigilancia" },
      { "dni": "74941466", "nombre": "Henry Montalvo Alvino", "area": "Vigilancia" },
      { "dni": "72878142", "nombre": "Claudia Onelia Vignolo Espinoza", "area": "Vigilancia" },
      { "dni": "40718937", "nombre": "Aurora Jessica Leiva Malaver", "area": "Vigilancia" },
      { "dni": "46606079", "nombre": "Bernad Felipe Almonacid Alarcón", "area": "Vigilancia" },
      { "dni": "75462153", "nombre": "Mabella Betsabet Monserrat", "area": "Vigilancia" },
      { "dni": "72663652", "nombre": "Dylan Gustavo Tam Canaval", "area": "Vigilancia" },
      { "dni": "71469692", "nombre": "Ricardo Eugenio Caceres Vasquez", "area": "Vigilancia" },
      { "dni": "48441300", "nombre": "Sergio Francois Gómez Vergara", "area": "Vigilancia" },
      { "dni": "72725681", "nombre": "Brenda Idelsa Julca Calixto", "area": "Vigilancia" },
      { "dni": "42298205", "nombre": "Yolanda Pacheco De la cruz", "area": "Vigilancia" },
      { "dni": "46503231", "nombre": "Jorge Luis Chuchon Artica", "area": "Vigilancia" },
      { "dni": "75897443", "nombre": "Alessandra Yangua Barrios", "area": "Vigilancia" },
      { "dni": "74021987", "nombre": "Jessica Armandina Quino Luque", "area": "Vigilancia" },
      { "dni": "72683381", "nombre": "Ricardo Arturo Rojas Ormeño", "area": "Vigilancia" },
      { "dni": "42374456", "nombre": "Ramos Baldeon José Carlos", "area": "Vigilancia" },
      { "dni": "75074398", "nombre": "Altamirano Tello Nilbert Briyan", "area": "Vigilancia" },
      { "dni": "78547583", "nombre": "Chavarria Carrasco Flavio Andre", "area": "Vigilancia" },
      { "dni": "61360652", "nombre": "Macedo Garate Jazmin Ariana", "area": "Vigilancia" },
      { "dni": "74564562", "nombre": "Cruz Garcia Fabrizio", "area": "Vigilancia" },
      { "dni": "02821405", "nombre": "Oballe Gozzing Juan Carlos", "area": "Vigilancia" },
      { "dni": "40904512", "nombre": "Price Granda Kelly Anthuanet", "area": "Vigilancia" }
    ];

    let appState = {
        currentUserRole: null,
        stations: []
    };

    let DOM = {};
    let selectedStatusTmp = 'ACTIVA';
    let isManualInputMode = false;

    function init() {
        DOM = {
            loginOverlay: document.getElementById('login-overlay'),
            loginRoleSelector: document.getElementById('login-role-selector'),
            loginAdminForm: document.getElementById('login-admin-form'),
            btnSelectAdmin: document.getElementById('btn-select-admin'),
            btnLoginViewer: document.getElementById('btn-login-viewer'),
            btnBackToRoles: document.getElementById('btn-back-to-roles'),
            inputUser: document.getElementById('login-user'),
            inputPassword: document.getElementById('login-password'),
            loginErrorMsg: document.getElementById('login-error-msg'),
            appContainer: document.getElementById('app-container'),
            btnLogout: document.getElementById('btn-logout'),
            sessionRoleIcon: document.getElementById('session-role-icon'),
            sessionRoleText: document.getElementById('session-role-text'),
            searchInput: document.getElementById('search-input'),
            lastUpdateTime: document.getElementById('last-update-time'),
            gridCC1: document.getElementById('grid-cc1'),
            gridCC2: document.getElementById('grid-cc2'),
            counterActive: document.getElementById('counter-active'),
            counterDisabled: document.getElementById('counter-disabled'),
            counterFree: document.getElementById('counter-free'),
            editModal: document.getElementById('edit-modal'),
            editForm: document.getElementById('edit-station-form'),
            modalCloseBtn: document.getElementById('modal-close-btn'),
            modalCancelBtn: document.getElementById('btn-cancel-edit'),
            modalStationId: document.getElementById('modal-station-id'),
            modalStationCode: document.getElementById('modal-station-code'),
            modalAdvisorName: document.getElementById('modal-advisor-name'),
            modalAdvisorText: document.getElementById('modal-advisor-text'),
            btnToggleInputMode: document.getElementById('btn-toggle-input-mode')
        };

        setupEventListeners();
        populateExcelDatalist();
    }

    // 🌐 OBTENER LOS DATOS DESDE SUPABASE CLOUD
    async function loadDataFromSupabase() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/estaciones?select=*`, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al conectar con Supabase');

            appState.stations = await response.json();

            // Ordenar por ID para mantener la estructura visual fija
            appState.stations.sort((a, b) => a.id.localeCompare(b.id));

            renderSystemGrid();
            recalculateDashboardMetrics();
            updateTimestamp();
        } catch (error) {
            console.error('❌ Error cargando la nube:', error);
            alert('Error al conectar con la base de datos en la nube. Verifica que la tabla "estaciones" exista y esté pública.');
        }
    }

    // 🌐 GUARDAR LOS CAMBIOS EN SUPABASE CLOUD
    async function updateStationInSupabase(id, advisor, status) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/estaciones?id=eq.${id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ advisor: advisor, status: status })
            });

            if (!response.ok) throw new Error('No se pudo actualizar en la nube');

            console.log(`🟢 Estación ${id} guardada con éxito.`);
            await loadDataFromSupabase(); // Recarga los paneles de operaciones para aplicar cambios
        } catch (error) {
            console.error('❌ Error guardando en la nube:', error);
            alert('No se pudo guardar el cambio en la base de datos de Supabase.');
        }
    }

    function populateExcelDatalist() {
        if (!DOM.modalAdvisorName) return;
        const currentValue = DOM.modalAdvisorName.value;
        DOM.modalAdvisorName.innerHTML = '<option value="N/A">-- Ninguno / Vacío --</option>';

        EXCEL_DATABASE.forEach(user => {
            const option = document.createElement('option');
            option.value = user.nombre;
            option.textContent = `${user.nombre} (${user.area})`;
            DOM.modalAdvisorName.appendChild(option);
        });

        if (currentValue && currentValue !== "") DOM.modalAdvisorName.value = currentValue;
    }

    function setupEventListeners() {
        DOM.btnSelectAdmin.addEventListener('click', showAdminLoginForm);
        DOM.btnBackToRoles.addEventListener('click', showRoleSelector);
        DOM.btnLoginViewer.addEventListener('click', () => authorizeAccess('VIEWER'));
        DOM.loginAdminForm.addEventListener('submit', handleAdminSubmit);
        DOM.btnLogout.addEventListener('click', logout);
        DOM.searchInput.addEventListener('input', handleRealTimeSearch);
        DOM.editForm.addEventListener('submit', handleFormSubmit);
        DOM.modalCloseBtn.addEventListener('click', closeModal);
        DOM.modalCancelBtn.addEventListener('click', closeModal);

        DOM.btnToggleInputMode.addEventListener('click', () => {
            isManualInputMode = !isManualInputMode;
            if (isManualInputMode) {
                DOM.modalAdvisorName.classList.add('hidden');
                DOM.modalAdvisorText.classList.remove('hidden');
                DOM.modalAdvisorText.focus();
                DOM.btnToggleInputMode.textContent = "📋 Modo Lista";
            } else {
                DOM.modalAdvisorText.classList.add('hidden');
                DOM.modalAdvisorName.classList.remove('hidden');
                DOM.modalAdvisorName.focus();
                DOM.btnToggleInputMode.textContent = "✏️ Modo Manual";
            }
        });

        DOM.editModal.addEventListener('click', (e) => {
            if (e.target === DOM.editModal) closeModal();
        });
    }

    function showAdminLoginForm() {
        DOM.loginRoleSelector.classList.add('hidden');
        DOM.loginAdminForm.classList.remove('hidden');
        DOM.loginErrorMsg.classList.add('hidden');
        DOM.inputUser.focus();
    }

    function showRoleSelector() {
        DOM.loginAdminForm.classList.add('hidden');
        DOM.loginRoleSelector.classList.remove('hidden');
        DOM.loginAdminForm.reset();
    }

    function handleAdminSubmit(event) {
        event.preventDefault();
        if (DOM.inputUser.value.trim() === ADMIN_CREDENTIALS.username && DOM.inputPassword.value === ADMIN_CREDENTIALS.password) {
            DOM.loginErrorMsg.classList.add('hidden');
            authorizeAccess('ADMIN');
        } else {
            DOM.loginErrorMsg.classList.remove('hidden');
        }
    }

    function authorizeAccess(role) {
        appState.currentUserRole = role;
        if (role === 'ADMIN') {
            DOM.sessionRoleIcon.textContent = '🔒';
            DOM.sessionRoleText.textContent = 'Administrador';
            DOM.appContainer.className = 'app-container role-admin';
        } else {
            DOM.sessionRoleIcon.textContent = '👁️';
            DOM.sessionRoleText.textContent = 'Visualizador';
            DOM.appContainer.className = 'app-container role-viewer';
        }
        DOM.loginOverlay.classList.add('hidden');
        DOM.appContainer.classList.remove('hidden');
        DOM.searchInput.value = '';

        loadDataFromSupabase();
    }

    function renderSystemGrid() {
        if (!DOM.gridCC1 || !DOM.gridCC2) return;
        DOM.gridCC1.innerHTML = '';
        DOM.gridCC2.innerHTML = '';

        appState.stations.forEach(node => {
            const card = document.createElement('div');
            card.className = `station-card status-${node.status.toLowerCase()}`;
            card.dataset.id = node.id;

            // Busca si pertenece a un área en la base de datos interna para mostrar la etiqueta
            const localUser = EXCEL_DATABASE.find(user => user.nombre === node.advisor);
            const areaLabel = localUser ? localUser.area : (node.status === 'LIBRE' ? 'Disponible' : 'Vigilancia');

            card.innerHTML = `
                <div class="station-card-header">
                    <span class="station-code">${node.code}</span>
                </div>
                <div class="station-advisor" title="${node.advisor}">${node.advisor}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">${areaLabel}</div>
                <div class="station-badge-status">${getStatusIndicatorIcon(node.status)} ${node.status}</div>
            `;

            card.addEventListener('click', () => {
                if (appState.currentUserRole === 'ADMIN') openEditModal(node.id);
            });

            if (node.sector === 'CC1') DOM.gridCC1.appendChild(card);
            else if (node.sector === 'CC2') DOM.gridCC2.appendChild(card);
        });
    }

    function getStatusIndicatorIcon(status) {
        if (status === 'ACTIVA') return '🟢';
        if (status === 'DESACTIVADA') return '🔴';
        return '⚪';
    }

    function recalculateDashboardMetrics() {
        let active = 0, disabled = 0, free = 0;
        appState.stations.forEach(n => {
            if (n.status === 'ACTIVA') active++;
            else if (n.status === 'DESACTIVADA') disabled++;
            else free++;
        });
        DOM.counterActive.textContent = active;
        DOM.counterDisabled.textContent = disabled;
        DOM.counterFree.textContent = free;
    }

    function updateTimestamp() {
        const now = new Date();
        if (DOM.lastUpdateTime) DOM.lastUpdateTime.textContent = now.toTimeString().split(' ')[0];
    }

    function logout() {
        appState.currentUserRole = null;
        DOM.appContainer.classList.add('hidden');
        DOM.loginOverlay.classList.remove('hidden');
        showRoleSelector();
    }

    function handleRealTimeSearch(event) {
        const query = event.target.value.toLowerCase().trim();
        document.querySelectorAll('.station-card').forEach(card => {
            const station = appState.stations.find(n => n.id === card.dataset.id);
            if (station && (query === '' || station.id.toLowerCase().includes(query) || station.advisor.toLowerCase().includes(query))) {
                card.classList.remove('search-mismatch');
            } else {
                card.classList.add('search-mismatch');
            }
        });
    }

    function openEditModal(stationId) {
        const station = appState.stations.find(n => n.id === stationId);
        if (!station) return;

        DOM.modalStationId.value = station.id;
        DOM.modalStationCode.textContent = `Configuración: ${station.id}`;

        populateExcelDatalist();

        isManualInputMode = false;
        DOM.modalAdvisorText.classList.add('hidden');
        DOM.modalAdvisorName.classList.remove('hidden');
        DOM.btnToggleInputMode.textContent = "✏️ Modo Manual";

        const existsInSelect = Array.from(DOM.modalAdvisorName.options).some(opt => opt.value === station.advisor);

        if (existsInSelect) {
            DOM.modalAdvisorName.value = station.advisor;
            DOM.modalAdvisorText.value = "";
        } else {
            DOM.modalAdvisorName.value = "N/A";
            DOM.modalAdvisorText.value = station.advisor === 'N/A' ? '' : station.advisor;
            isManualInputMode = true;
            DOM.modalAdvisorName.classList.add('hidden');
            DOM.modalAdvisorText.classList.remove('hidden');
            DOM.btnToggleInputMode.textContent = "📋 Modo Lista";
        }

        selectedStatusTmp = station.status;
        updateToggleButtonsUI(selectedStatusTmp);

        document.querySelectorAll('.btn-status-toggle').forEach(btn => {
            btn.onclick = function() {
                selectedStatusTmp = this.dataset.status;
                updateToggleButtonsUI(selectedStatusTmp);
                if (selectedStatusTmp === 'LIBRE') {
                    DOM.modalAdvisorName.value = 'N/A';
                    DOM.modalAdvisorText.value = '';
                }
            };
        });

        DOM.editModal.classList.remove('hidden');
    }

    function updateToggleButtonsUI(activeStatus) {
        document.querySelectorAll('.btn-status-toggle').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.status === activeStatus);
        });
    }

    function closeModal() {
        DOM.editModal.classList.add('hidden');
        DOM.editForm.reset();
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const id = DOM.modalStationId.value;
        const selectedStatus = selectedStatusTmp;

        let advisorName = "N/A";
        if (selectedStatus !== 'LIBRE') {
            advisorName = isManualInputMode ? DOM.modalAdvisorText.value.trim() : DOM.modalAdvisorName.value;
            if (!advisorName) advisorName = "N/A";
        }

        closeModal();

        // Sincronizar de forma directa a Supabase Cloud
        updateStationInSupabase(id, advisorName, selectedStatus);
    }

    document.addEventListener('DOMContentLoaded', init);

})();
