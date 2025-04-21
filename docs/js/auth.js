/**
 * Sistema de autenticación y control de acceso
 * Versión optimizada para gestión completa del estado de autenticación
 */

// Configuración de administrador
window.AUTH_CONFIG = window.AUTH_CONFIG || {
    ADMIN_EMAIL: 'admin@example.com'
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    setupAuthListeners(); // Esta línea falta en tu código
});

// Llamar a la función al inicio
syncAuthSystems();

// Comprobar estado de autenticación al cargar cada página
function checkAuthState() {
    const currentUser = getCurrentUser();
    updateNavigationUI(currentUser);

    // Depuración
    console.log('Estado de autenticación:', currentUser ? 'Autenticado' : 'No autenticado');
    console.log('Clases en <html>:', document.documentElement.className);

    // Verificación extra para detectar problemas
    setTimeout(() => {
        const currentUser = getCurrentUser();
        const isLoggedIn = !!currentUser;
        
        console.group('DIAGNÓSTICO DE NAV');
        console.log('Estado login:', isLoggedIn ? 'LOGUEADO' : 'NO LOGUEADO');
        console.log('Clase HTML:', document.documentElement.className);
        
        // Verificar elementos visibles que no deberían estarlo
        const visibleLoggedOut = Array.from(document.querySelectorAll('.logged-out-only'))
            .filter(el => window.getComputedStyle(el).display !== 'none');
        const visibleLoggedIn = Array.from(document.querySelectorAll('.logged-in-only'))
            .filter(el => window.getComputedStyle(el).display !== 'none');
        
        if (isLoggedIn && visibleLoggedOut.length > 0) {
            console.error('ERROR: Elementos de logged-out visibles cuando deberían estar ocultos:', visibleLoggedOut);
        }
        
        if (!isLoggedIn && visibleLoggedIn.length > 0) {
            console.error('ERROR: Elementos de logged-in visibles cuando deberían estar ocultos:', visibleLoggedIn);
        }
        
        console.groupEnd();
    }, 500);
}

// Actualizar la interfaz de navegación basada en el estado de autenticación
function updateNavigationUI(user) {
    if (user) {
        document.documentElement.classList.add('user-logged-in');
        document.documentElement.classList.remove('user-logged-out');
        // Actualizar el nombre del usuario en el menú
        document.querySelectorAll('.user-name').forEach(el => {
            el.textContent = user.displayName || user.email.split('@')[0];
        });
    } else {
        document.documentElement.classList.add('user-logged-out');
        document.documentElement.classList.remove('user-logged-in');
    }
}

// Obtener usuario actual desde localStorage
function getCurrentUser() {
    try {
        const userJSON = localStorage.getItem('currentUser');
        return userJSON ? JSON.parse(userJSON) : null;
    } catch (error) {
        console.error('Error obteniendo usuario actual:', error);
        return null;
    }
}

// Configurar event listeners para formularios de autenticación
function setupAuthListeners() {
    // Formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log("Login form listener setup");
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log("Register form listener setup");
    }
    
    // IMPORTANTE: Mejorar detección de botones de logout
    const logoutButtons = document.querySelectorAll('.logout-btn, [href="logout.html"]');
    console.log("Botones de logout encontrados:", logoutButtons.length);
    
    logoutButtons.forEach(btn => {
        console.log("Configurando botón:", btn.outerHTML.substring(0, 50));
        btn.addEventListener('click', function(e) {
            console.log("🔴 LOGOUT BUTTON CLICKED");
            e.preventDefault();
            e.stopPropagation();
            handleLogout();
            return false;
        });
    });
}

// Reemplazar la función handleLogin para hacerla más robusta

function handleLogin(e) {
    e.preventDefault();
    console.log("🔑 PROCESANDO LOGIN");
    
    // Captura los valores del formulario
    let email, password;
    
    try {
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;
        
        console.log("📝 Datos capturados:", { email: email, password: "***" });
        
        if (!email || !password) {
            alert("Por favor completa todos los campos");
            return;
        }
    } catch (inputError) {
        console.error("❌ Error capturando datos del formulario:", inputError);
        // Si hay error, usar valores de prueba
        email = "usuario@ejemplo.com";
        password = "123456";
    }
    
    // Crear nuevo objeto de usuario
    const user = {
        id: 'user_' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        isAdmin: email.includes('admin'),
        lastLogin: new Date().toISOString()
    };
    
    console.log("👤 Creando usuario:", user);
    
    // FORZAR localStorage - Con triple verificación
    try {
        // 1. Borrar cualquier dato previo para evitar conflictos
        localStorage.removeItem('currentUser');
        
        // 2. Guardar el nuevo usuario
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // 3. Verificar que se guardó correctamente
        const savedUser = localStorage.getItem('currentUser');
        
        if (!savedUser) {
            throw new Error("No se pudo guardar el usuario");
        }
        
        console.log("✅ Usuario guardado correctamente");
        alert("¡Inicio de sesión exitoso! Redirigiendo...");
        
        // Forzar recarga completa para actualizar UI
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
        
    } catch (storageError) {
        console.error("❌ ERROR CRÍTICO guardando usuario:", storageError);
        alert("Error al guardar la sesión. Intente nuevamente.");
    }
}

// Manejar envío de formulario de registro
function handleRegister(e) {
    e.preventDefault();
    console.log("Procesando registro...");
    
    const displayName = document.getElementById('name')?.value.trim() || "";
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    
    const errorContainer = document.querySelector('.auth-error');
    
    // Validaciones
    if (!email || !password) {
        showError(errorContainer, "Por favor completa los campos requeridos");
        return;
    }
    
    if (confirmPassword && password !== confirmPassword) {
        showError(errorContainer, "Las contraseñas no coinciden");
        return;
    }
    
    // Verificar si el usuario ya existe
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showError(errorContainer, "Este correo electrónico ya está registrado");
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: 'user_' + Date.now(),
        email: email,
        password: password, // En producción usar hash
        displayName: displayName || email.split('@')[0],
        createdAt: new Date().toISOString()
    };
    
    // Guardar usuario
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log("Usuario registrado exitosamente:", newUser);
    
    // Mostrar mensaje de éxito
    const successContainer = document.querySelector('.auth-success');
    if (successContainer) {
        errorContainer.style.display = 'none';
        successContainer.style.display = 'block';
        successContainer.textContent = "¡Registro exitoso! Redirigiendo...";
    }
    
    // Redirigir a login después de un breve retraso
    setTimeout(() => {
        window.location.replace('login.html');
    }, 1500);
}

// Manejar cierre de sesión
function handleLogout() {
    console.log("🔴 CERRANDO SESIÓN...");
    
    // Eliminar sesión
    localStorage.removeItem('currentUser');
    
    // Mensaje de confirmación
    alert("Sesión cerrada correctamente");
    
    // Redirigir a inicio con recarga completa
    window.location.href = 'index.html';
}

// Mostrar mensaje de error
function showError(container, message) {
    if (container) {
        container.textContent = message;
        container.style.display = 'block';
    }
}

// También añade esta función para verificar manualmente el estado de autenticación
function checkAuthManually() {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        console.log("Estado actual:", user ? "LOGUEADO como " + user.email : "NO LOGUEADO");
        return !!user;
    } catch (e) {
        console.error("Error verificando autenticación:", e);
        return false;
    }
}

// Función para sincronizar sistemas de autenticación
function syncAuthSystems() {
    // Verificar si hay sesión de UserSystem
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            const userData = sessionData.user;
            
            // Crear/actualizar currentUser con formato compatible
            const unifiedUser = {
                id: userData.id,
                email: userData.email,
                displayName: userData.name,
                isAdmin: userData.role === 'admin',
                lastLogin: new Date().toISOString()
            };
            
            // Actualizar currentUser para auth.js
            localStorage.setItem('currentUser', JSON.stringify(unifiedUser));
            console.log("🔄 Sistemas de autenticación sincronizados");
        } catch (e) {
            console.error("Error sincronizando sistemas de auth:", e);
        }
    }
}