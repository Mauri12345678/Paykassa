(function() {
    console.log("🚪 Script de cierre de sesión reforzado cargado");
    
    // Contador para evitar ejecuciones múltiples
    let logoutInProgress = false;
    
    // Función unificada de cierre de sesión
    function performLogout(e) {
        // Prevenir ejecuciones múltiples
        if (logoutInProgress) return;
        logoutInProgress = true;
        
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log("🔴 Cerrando sesión...");
        
        // Elemento para notificación visual
        const notification = document.createElement('div');
        notification.className = 'logout-notification';
        notification.innerHTML = `
            <div class="logout-notification-content">
                <i class="fas fa-sign-out-alt"></i>
                <span>Cerrando sesión...</span>
            </div>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: fadeInOut 2s forwards;
            display: flex;
            align-items: center;
        `;
        
        // Agregar keyframes para animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
            .logout-notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .logout-notification-content i {
                font-size: 18px;
            }
        `;
        document.head.appendChild(style);
        
        // Mostrar notificación
        document.body.appendChild(notification);
        
        // Limpiar localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSession');
        localStorage.removeItem('authToken');
        
        // Redireccionar después de la animación
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
    
    // Usar delegación de eventos para capturar clics en .logout-btn
    document.addEventListener('click', function(e) {
        const logoutButton = e.target.closest('.logout-btn');
        if (logoutButton) performLogout(e);
    });
    
    // Exponer para uso global (permitiendo que otros scripts lo llamen)
    window.performLogout = performLogout;
})();