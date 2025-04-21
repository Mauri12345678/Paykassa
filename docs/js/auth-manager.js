/**
 * AuthManager - Sistema centralizado de autenticación
 * Este script reemplaza la funcionalidad fragmentada en múltiples archivos
 */

const AuthManager = (function() {
    // Estado interno
    let currentUser = null;
    let isInitialized = false;
    
    // Inicializar el sistema
    function init() {
        if (isInitialized) return;
        
        console.log("🔐 Sistema de autenticación unificado inicializando...");
        
        try {
            // Cargar usuario del localStorage
            const userJSON = localStorage.getItem('currentUser');
            if (userJSON) {
                currentUser = JSON.parse(userJSON);
                console.log("✅ Usuario autenticado cargado:", currentUser.email);
                
                // Actualizar UI
                updateUI(true);
            } else {
                console.log("👤 No hay usuario autenticado");
                updateUI(false);
            }
        } catch (e) {
            console.error("Error inicializando autenticación:", e);
            currentUser = null;
        }
        
        // Configurar listeners
        setupEventListeners();
        
        isInitialized = true;
    }
    
    // Configurar listeners de eventos
    function setupEventListeners() {
        // Listener para botones de logout
        document.addEventListener('click', function(e) {
            const logoutButton = e.target.closest('.logout-btn');
            if (logoutButton) {
                e.preventDefault();
                e.stopPropagation();
                logout();
            }
        });
        
        // Form de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email')?.value;
                const password = document.getElementById('password')?.value;
                
                if (!email || !password) {
                    if (window.notify) {
                        notify.error("Por favor completa todos los campos");
                    } else {
                        console.error("Por favor completa todos los campos");
                    }
                    return;
                }
                
                login(email, password);
            });
        }
    }
    
    // Actualizar UI según estado de autenticación
    function updateUI(isLoggedIn) {
        // Actualizar clase del HTML
        document.documentElement.className = isLoggedIn ? 'user-logged-in' : 'user-logged-out';
        
        if (isLoggedIn && currentUser) {
            // Actualizar nombre de usuario en la UI
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = currentUser.displayName || currentUser.email.split('@')[0];
            });
            
            // Mostrar/ocultar elementos según autenticación
            document.querySelectorAll('.logged-out-only').forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
            
            document.querySelectorAll('.logged-in-only').forEach(el => {
                if (el.tagName === 'LI') {
                    el.style.setProperty('display', 'list-item', 'important');
                } else {
                    el.style.setProperty('display', 'block', 'important');
                }
            });
            
            // Configurar elementos admin si es necesario
            if (currentUser.isAdmin) {
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = '';
                });
            } else {
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = 'none';
                });
            }
        } else {
            // Usuario no logueado
            document.querySelectorAll('.logged-in-only').forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
            
            document.querySelectorAll('.logged-out-only').forEach(el => {
                if (el.tagName === 'LI') {
                    el.style.setProperty('display', 'list-item', 'important');
                } else {
                    el.style.setProperty('display', 'block', 'important');
                }
            });
            
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'none';
            });
        }
    }
    
    // Login
    function login(email, password) {
        // Crear objeto de usuario
        const user = {
            id: 'user_' + Date.now(),
            email: email,
            displayName: email.split('@')[0],
            isAdmin: email.toLowerCase().includes('admin'),
            lastLogin: new Date().toISOString()
        };
        
        // Guardar en localStorage
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUser = user;
            
            // Mostrar notificación
            if (window.notify) {
                notify.success("Inicio de sesión exitoso");
            } else {
                console.log("Inicio de sesión exitoso");
            }
            
            // Actualizar UI
            updateUI(true);
            
            // Redireccionar
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (e) {
            console.error("Error guardando usuario:", e);
            if (window.notify) {
                notify.error("Error al iniciar sesión");
            } else {
                console.error("Error al iniciar sesión");
            }
        }
    }
    
    // Logout
    function logout() {
        if (!currentUser) return; // Evitar logout si ya no hay sesión
        
        // Mostrar notificación de cierre
        if (window.notify) {
            notify.info("Sesión cerrada correctamente");
        } else {
            console.log("Sesión cerrada correctamente");
        }
        
        // Limpiar localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSession');
        localStorage.removeItem('authToken');
        
        // Actualizar estado
        currentUser = null;
        
        // Redireccionar después de un breve retraso
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
    
    // Mostrar notificación
    function showNotification(message, type = "info") {
        // Crear elemento para notificación
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        
        // Determinar ícono basado en tipo
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Estilo para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #333;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            animation: slideIn 0.3s forwards;
            max-width: 300px;
        `;
        
        // Color según tipo
        if (type === 'success') {
            notification.style.borderLeft = '4px solid #10b981';
        } else if (type === 'error') {
            notification.style.borderLeft = '4px solid #ef4444';
        } else {
            notification.style.borderLeft = '4px solid #3b82f6';
        }
        
        // Agregar keyframes para animación
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-content i {
                    font-size: 18px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Auto-eliminar después de unos segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // API pública
    return {
        init,
        login,
        logout,
        getCurrentUser: function() { return currentUser; },
        isAuthenticated: function() { return !!currentUser; }
    };
})();

// Auto inicializar
document.addEventListener('DOMContentLoaded', function() {
    AuthManager.init();
});

// Para uso en la consola o por otros scripts
window.AuthManager = AuthManager;