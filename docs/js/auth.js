/**
 * Sistema de autenticación y control de acceso
 * Versión optimizada para gestión completa del estado de autenticación
 */

// Configuración de administrador
const ADMIN_EMAIL = "admin@luxmarket.com"; // Cambia a tu correo de administrador

document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    setupAuthListeners(); // Esta línea falta en tu código
});

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
    
    // Botones de logout (tanto href como class)
    const logoutButtons = document.querySelectorAll('.logout-btn, [href="logout.html"]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    console.log("Auth listeners setup complete");
}

// Manejar envío de formulario de login
function handleLogin(e) {
    e.preventDefault();
    console.log("Procesando login...");
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorContainer = document.querySelector('.auth-error');
    
    // Validaciones básicas
    if (!email || !password) {
        showError(errorContainer, "Por favor completa todos los campos");
        return;
    }
    
    // Obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
        showError(errorContainer, "Correo electrónico o contraseña incorrectos");
        console.log("Login fallido: usuario no encontrado o contraseña incorrecta");
        return;
    }
    
    // Crear sesión de usuario
    const isAdmin = (email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    const sessionUser = {
        id: user.id,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        isAdmin: isAdmin,
        lastLogin: new Date().toISOString()
    };
    
    // Guardar sesión en localStorage
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    console.log("Usuario autenticado:", sessionUser);
    
    // Redirigir con recarga completa
    const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
    window.location.replace(redirectUrl);
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
    console.log("Cerrando sesión...");
    
    // Eliminar sesión
    localStorage.removeItem('currentUser');
    
    // Redirigir a inicio con recarga completa
    window.location.replace('index.html');
}

// Mostrar mensaje de error
function showError(container, message) {
    if (container) {
        container.textContent = message;
        container.style.display = 'block';
    }
}