document.addEventListener('DOMContentLoaded', function() {
    console.log("🔐 Sistema de autenticación simplificado cargado");
    
    // Obtener el formulario de login
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        console.log("📝 Formulario de login encontrado, agregando manejador");
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("🔑 Procesando formulario de login");
            
            // Obtener valores
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validar campos
            if (!email || !password) {
                showError("Por favor completa todos los campos");
                return false;
            }
            
            // Crear objeto de usuario con nombre bien formado
            const user = {
                id: 'user_' + Date.now(),
                email: email,
                displayName: email.includes('@') ? email.split('@')[0] : email,
                isAdmin: email.toLowerCase().includes('admin'),
                lastLogin: new Date().toISOString()
            };
            
            try {
                // Guardar en localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Mostrar éxito
                showSuccess("Login exitoso. Redirigiendo...");
                
                // Redireccionar después de un breve retraso
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            } catch (error) {
                console.error("Error guardando usuario:", error);
                showError("Ocurrió un error al iniciar sesión");
            }
        });
    }
    
    // Funciones de utilidad para mostrar mensajes
    function showError(message) {
        const errorDiv = document.querySelector('.auth-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            // Ocultar después de un tiempo
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
    
    function showSuccess(message) {
        const successDiv = document.querySelector('.auth-success');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        } else {
            alert(message);
        }
    }
});