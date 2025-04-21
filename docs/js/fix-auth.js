(function() {
    console.log("🔄 Script de corrección de autenticación cargado");
    
    // Arreglo para el botón de logout que no responde
    document.addEventListener('click', function(e) {
        if (e.target.closest('.logout-btn')) {
            console.log("🔴 Logout detectado por fix-auth.js");
            e.preventDefault();
            
            // Eliminar sesión
            localStorage.removeItem('currentUser');
            alert("Sesión cerrada correctamente");
            
            // Recargar para actualizar UI
            window.location.href = 'index.html';
        }
    });
    
    // Si estamos en login.html, arreglamos el formulario
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Crear usuario simplificado
            const user = {
                email: email,
                displayName: email.split('@')[0],
                isAdmin: email.includes('admin'),
                lastLogin: new Date().toISOString()
            };
            
            // Guardar en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log("✅ Usuario guardado correctamente:", user);
            
            // Redirigir con recarga completa
            window.location.href = 'index.html';
        });
    }

    console.log("🔧 Script de corrección de autenticación");
    
    // Verificar y corregir nombre de usuario
    const userJSON = localStorage.getItem('currentUser');
    if (userJSON) {
        try {
            const user = JSON.parse(userJSON);
            console.log("Usuario actual:", user);
            
            // Si el displayName o email son incorrectos, corrige
            if (!user.displayName || user.displayName === "test user") {
                // Intenta recuperar el nombre de registro guardado
                const registeredUsers = localStorage.getItem('users');
                if (registeredUsers) {
                    const users = JSON.parse(registeredUsers);
                    const matchedUser = users.find(u => u.email === user.email);
                    if (matchedUser && matchedUser.displayName) {
                        user.displayName = matchedUser.displayName;
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        console.log("✅ Nombre de usuario corregido:", user.displayName);
                    }
                }
            }
            
            // Actualizar nombre en UI
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = user.displayName || user.email.split('@')[0];
            });
        } catch (e) {
            console.error("Error procesando usuario:", e);
        }
    }
})();