/**
 * Sistema de logs para LuxMarket
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el sistema de logs
    initLogs();
    
    // Configurar los eventos de los botones
    document.getElementById('refresh-logs').addEventListener('click', refreshLogs);
    document.getElementById('clear-logs').addEventListener('click', clearLogs);
    document.getElementById('export-logs').addEventListener('click', exportLogs);
    
    // Configurar filtros
    document.getElementById('log-type').addEventListener('change', filterLogs);
    document.getElementById('log-date').addEventListener('change', filterLogs);
    document.getElementById('log-search').addEventListener('input', filterLogs);
    
    // Configurar paginación
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
});

// Variables globales
let allLogs = [];
let filteredLogs = [];
let currentPage = 1;
const logsPerPage = 10;

// Inicializar sistema de logs
function initLogs() {
    // Cargar logs existentes o crear estructura inicial
    allLogs = JSON.parse(localStorage.getItem('systemLogs')) || generateSampleLogs();
    
    // Guardar los logs si no existen
    if (!localStorage.getItem('systemLogs')) {
        localStorage.setItem('systemLogs', JSON.stringify(allLogs));
    }
    
    // Aplicar filtros iniciales y mostrar logs
    filterLogs();
}

// Generar logs de ejemplo para demostración
function generateSampleLogs() {
    const sampleLogs = [];
    const types = ['info', 'warning', 'error', 'success'];
    const users = ['admin@luxmarket.com', 'cliente1@gmail.com', 'soporte@luxmarket.com', 'invitado'];
    const messages = [
        'Inicio de sesión exitoso',
        'Producto añadido al carrito',
        'Error al procesar el pago',
        'Contraseña incorrecta (3 intentos)',
        'Pedido completado correctamente',
        'Actualización de inventario',
        'Nuevo registro de usuario',
        'Cambio de dirección de envío',
        'Intento de acceso no autorizado',
        'Producto agotado'
    ];
    
    // Crear logs de los últimos 30 días
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        
        const logDate = new Date(now);
        logDate.setDate(logDate.getDate() - daysAgo);
        logDate.setHours(logDate.getHours() - hoursAgo);
        logDate.setMinutes(logDate.getMinutes() - minutesAgo);
        
        const log = {
            id: generateUniqueId(),
            timestamp: logDate.getTime(),
            date: logDate.toISOString(),
            type: types[Math.floor(Math.random() * types.length)],
            user: users[Math.floor(Math.random() * users.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
            details: {} // Puede contener información adicional
        };
        
        sampleLogs.push(log);
    }
    
    // Ordenar por fecha (más reciente primero)
    return sampleLogs.sort((a, b) => b.timestamp - a.timestamp);
}

// Generar ID único para cada log
function generateUniqueId() {
    return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Actualizar la visualización de logs
function displayLogs() {
    const logsData = document.getElementById('logs-data');
    const noLogs = document.getElementById('no-logs');
    const paginationNumbers = document.getElementById('page-numbers');
    
    // Calcular logs para la página actual
    const startIndex = (currentPage - 1) * logsPerPage;
    const endIndex = startIndex + logsPerPage;
    const pageItems = filteredLogs.slice(startIndex, endIndex);
    
    // Limpiar contenido actual
    logsData.innerHTML = '';
    paginationNumbers.innerHTML = '';
    
    if (filteredLogs.length === 0) {
        // No hay logs que mostrar
        logsData.innerHTML = '';
        noLogs.style.display = 'block';
    } else {
        // Hay logs para mostrar
        noLogs.style.display = 'none';
        
        // Crear filas de tabla para cada log
        pageItems.forEach(log => {
            const row = document.createElement('tr');
            
            // Formatear fecha/hora
            const logDate = new Date(log.timestamp);
            const formattedDate = `${logDate.toLocaleDateString()} ${logDate.toLocaleTimeString()}`;
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td><span class="log-type ${log.type}">${capitalize(log.type)}</span></td>
                <td>${log.user || 'Sistema'}</td>
                <td>${log.message}</td>
                <td class="log-actions">
                    <button class="btn-icon view-log" data-id="${log.id}" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon delete-log" data-id="${log.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            logsData.appendChild(row);
        });
        
        // Configurar paginación
        const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
        
        // Botones de página
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayLogs();
            });
            paginationNumbers.appendChild(pageButton);
        }
        
        // Configurar botones de acción
        document.querySelectorAll('.view-log').forEach(button => {
            button.addEventListener('click', () => viewLogDetails(button.dataset.id));
        });
        
        document.querySelectorAll('.delete-log').forEach(button => {
            button.addEventListener('click', () => deleteLog(button.dataset.id));
        });
    }
}

// Filtrar logs por tipo, fecha y búsqueda
function filterLogs() {
    const typeFilter = document.getElementById('log-type').value;
    const dateFilter = document.getElementById('log-date').value;
    const searchFilter = document.getElementById('log-search').value.toLowerCase();
    
    const filterElement = document.getElementById('log-filter');
    const filterValue = filterElement ? filterElement.value : '';
    
    // Resetear a la primera página
    currentPage = 1;
    
    // Aplicar filtros
    filteredLogs = allLogs.filter(log => {
        // Filtro por tipo
        if (typeFilter !== 'all' && log.type !== typeFilter) {
            return false;
        }
        
        // Filtro por fecha
        if (dateFilter) {
            const logDate = new Date(log.timestamp);
            const filterDate = new Date(dateFilter);
            
            if (logDate.toDateString() !== filterDate.toDateString()) {
                return false;
            }
        }
        
        // Filtro por búsqueda
        if (searchFilter) {
            const logText = `${log.message} ${log.user}`.toLowerCase();
            if (!logText.includes(searchFilter)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Mostrar logs filtrados
    displayLogs();
}

// Actualizar logs
function refreshLogs() {
    // En una aplicación real, esto podría hacer una llamada a API
    // Para este ejemplo, simplemente recargamos los existentes
    displayLogs();
    
    // Mostrar mensaje de actualización
    showNotification('Logs actualizados correctamente');
}

// Limpiar todos los logs
function clearLogs() {
    if (confirm('¿Estás seguro de que deseas eliminar todos los logs? Esta acción no se puede deshacer.')) {
        allLogs = [];
        filteredLogs = [];
        localStorage.setItem('systemLogs', JSON.stringify(allLogs));
        displayLogs();
        
        // Mostrar mensaje de confirmación
        showNotification('Todos los logs han sido eliminados');
    }
}

// Exportar logs
function exportLogs() {
    // Convertir logs a formato CSV
    let csv = 'Fecha,Tipo,Usuario,Mensaje\n';
    
    filteredLogs.forEach(log => {
        const logDate = new Date(log.timestamp);
        const formattedDate = `${logDate.toLocaleDateString()} ${logDate.toLocaleTimeString()}`;
        csv += `"${formattedDate}","${log.type}","${log.user || 'Sistema'}","${log.message}"\n`;
    });
    
    // Crear blob y descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar mensaje de confirmación
    showNotification('Logs exportados correctamente');
}

// Ver detalles de un log específico
function viewLogDetails(logId) {
    const log = allLogs.find(l => l.id === logId);
    
    if (!log) return;
    
    // En una aplicación real, esto abriría un modal con detalles
    // Para este ejemplo, simplemente mostramos en la consola
    console.log('Detalles del log:', log);
    
    alert(`
        Detalles del Log:
        Fecha: ${new Date(log.timestamp).toLocaleString()}
        Tipo: ${capitalize(log.type)}
        Usuario: ${log.user || 'Sistema'}
        Mensaje: ${log.message}
    `);
}

// Eliminar un log específico
function deleteLog(logId) {
    if (confirm('¿Estás seguro de que deseas eliminar este log?')) {
        // Eliminar log del array
        allLogs = allLogs.filter(log => log.id !== logId);
        
        // Actualizar localStorage
        localStorage.setItem('systemLogs', JSON.stringify(allLogs));
        
        // Actualizar vista
        filterLogs();
        
        // Mostrar mensaje de confirmación
        showNotification('Log eliminado correctamente');
    }
}

// Cambiar página de resultados
function changePage(direction) {
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    
    // Calcular nueva página
    const newPage = currentPage + direction;
    
    // Validar límites
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayLogs();
    }
}

// Utilitario para capitalizar primera letra
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación si no existe
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Mostrar mensaje
    notification.textContent = message;
    notification.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Agregar estilos para notificaciones
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);

// API para registrar logs desde otras partes de la aplicación
window.LogSystem = {
    // Registrar nuevo log
    log: function(type, message, user = null, details = {}) {
        // Crear nuevo log
        const newLog = {
            id: generateUniqueId(),
            timestamp: Date.now(),
            date: new Date().toISOString(),
            type: type, // 'info', 'warning', 'error', 'success'
            user: user,
            message: message,
            details: details
        };
        
        // Agregar al inicio del array
        allLogs.unshift(newLog);
        
        // Guardar en localStorage
        localStorage.setItem('systemLogs', JSON.stringify(allLogs));
        
        // Si estamos en la página de logs, actualizar vista
        if (window.location.pathname.includes('logs.html')) {
            filterLogs();
        }
        
        return newLog;
    },
    
    // Métodos de conveniencia para diferentes tipos de logs
    info: function(message, user = null, details = {}) {
        return this.log('info', message, user, details);
    },
    
    warning: function(message, user = null, details = {}) {
        return this.log('warning', message, user, details);
    },
    
    error: function(message, user = null, details = {}) {
        return this.log('error', message, user, details);
    },
    
    success: function(message, user = null, details = {}) {
        return this.log('success', message, user, details);
    }
};