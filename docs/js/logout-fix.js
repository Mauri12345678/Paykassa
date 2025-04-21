(function() {
    console.log("🚪 Script de cierre de sesión reforzado cargado");
    
    // Usar delegación de eventos para capturar cualquier clic en .logout-btn
    document.addEventListener('click', function(e) {
        // Buscar si el clic fue en el botón de logout o dentro de él
        const logoutButton = e.target.closest('.logout-btn');
        
        if (logoutButton) {
            console.log("🔴 LOGOUT DETECTADO POR FIX SCRIPT");
            e.preventDefault();
            e.stopPropagation();
            
            // Limpiar todas las posibles claves de autenticación
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userSession');
            localStorage.removeItem('authToken');
            
            // Mensaje confirmando cierre
            alert("Has cerrado sesión correctamente");
            
            // Forzar recarga completa
            window.location.href = 'index.html';
            
            return false;
        }
    });
    
    // Verificación adicional: agregar listener directo a todos los botones al cargar
    window.addEventListener('load', function() {
        const logoutButtons = document.querySelectorAll('.logout-btn, [href="logout.html"]');
        console.log(`🔍 Detectados ${logoutButtons.length} botones de logout`);
        
        logoutButtons.forEach(btn => {
            // Añadir atributo para depuración
            btn.setAttribute('data-logout-fixed', 'true');
            
            // Agregar listener directo
            btn.addEventListener('click', function(e) {
                console.log("🔴 LOGOUT DIRECTO ACTIVADO");
                e.preventDefault();
                
                // Limpiar localStorage
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userSession');
                
                // Mensaje y redirección
                alert("Sesión cerrada correctamente");
                window.location.href = 'index.html';
            });
        });
    });
})();