// Este script permite forzar el inicio de sesión manualmente
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔐 Script de forzado de login cargado");
    
    // Agregar botón de emergencia para login forzado
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emergencyButton = document.createElement('button');
        emergencyButton.type = 'button';
        emergencyButton.className = 'btn btn-secondary';
        emergencyButton.style.marginTop = '10px';
        emergencyButton.textContent = 'Forzar Inicio de Sesión (Emergencia)';
        
        emergencyButton.addEventListener('click', function() {
            const testUser = {
                id: 'user_' + Date.now(),
                email: 'test@example.com',
                displayName: 'Usuario de Prueba',
                isAdmin: false,
                lastLogin: new Date().toISOString()
            };
            
            try {
                localStorage.setItem('currentUser', JSON.stringify(testUser));
                alert("Login forzado exitoso. Redirigiendo...");
                window.location.href = 'index.html';
            } catch (e) {
                alert("Error al forzar login: " + e);
            }
        });
        
        // Añadir después del botón existente
        loginForm.appendChild(document.createElement('div')).appendChild(emergencyButton);
    }
});