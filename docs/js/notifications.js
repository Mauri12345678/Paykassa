/**
 * Sistema de notificaciones sin alertas
 */
const NotificationSystem = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
        
        // Reemplazar alerts nativos
        this.overrideAlerts();
        
        console.log("🔔 Sistema de notificaciones inicializado");
    },
    
    show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        // Auto-eliminar después de unos segundos
        setTimeout(() => {
            if (notification.parentNode) {
                this.container.removeChild(notification);
            }
        }, 3000);
        
        return notification;
    },
    
    success(message) {
        return this.show(message, 'success');
    },
    
    error(message) {
        return this.show(message, 'error');
    },
    
    info(message) {
        return this.show(message, 'info');
    },
    
    // Reemplazar alerts por notificaciones
    overrideAlerts() {
        window._originalAlert = window.alert;
        window.alert = (message) => {
            this.info(message);
        };
    }
};

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    NotificationSystem.init();
});

window.notify = NotificationSystem;