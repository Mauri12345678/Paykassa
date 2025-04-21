/**
 * Sistema de gestión de usuarios y autenticación
 */

// Estructura inicial de usuarios
const ADMIN_EMAIL = 'tuadmin@email.com'; // Cambia esto por tu email

// Sistema de usuarios
const UserSystem = {
    // Estado de autenticación
    currentUser: null,
    isLoggedIn: false,
    
    // Inicializar sistema
    init() {
        // Comprobar si hay una sesión guardada
        const savedSession = localStorage.getItem('userSession');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                this.currentUser = session.user;
                this.isLoggedIn = true;
                this.updateUI();
                
                LogSystem.info('Sesión restaurada', this.currentUser.email);
            } catch (error) {
                this.logout();
                LogSystem.error('Error al restaurar sesión', null, { error });
            }
        }
        
        // Configurar listeners para los formularios
        this.setupFormListeners();
    },
    
    // Configurar escuchadores de eventos
    setupFormListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailElement = loginForm.querySelector('[name="email"]');
                const passwordElement = loginForm.querySelector('[name="password"]');
                
                if (emailElement && passwordElement) {
                    const email = emailElement.value;
                    const password = passwordElement.value;
                    this.login(email, password);
                } else {
                    console.warn('Elemento no encontrado en la página actual');
                    return; // Salir si estamos en una página donde no existe este elemento
                }
            });
        }
        
        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                this.handleRegister(e);
            });
        }
        
        // Logout button
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    },
    
    // Inicializar usuarios si no existen
    initializeUsers() {
        if (!localStorage.getItem('users')) {
            // Crear estructura inicial con un admin
            const initialUsers = [
                {
                    id: 'admin_' + Date.now(),
                    name: 'Administrador',
                    email: ADMIN_EMAIL,
                    password: this.hashPassword('admin123'), // Cambia esta contraseña
                    role: 'admin',
                    created: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('users', JSON.stringify(initialUsers));
            LogSystem.info('Sistema de usuarios inicializado', 'system');
            return initialUsers;
        }
        
        return JSON.parse(localStorage.getItem('users'));
    },
    
    // Validar email
    validateEmail(email) {
        // Obtener usuarios existentes
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Verificar si existe el correo
        const emailExists = users.some(user => user.email === email);
        
        // Importante: sólo mostrar el mensaje de error si realmente existe
        if (emailExists) {
            this.showError("Este correo electrónico ya está registrado.");
            return false;
        }
        
        return true;
    },
    
    // Registro de nuevo usuario
    handleRegister(e) {
        e.preventDefault();
        
        // Mostrar estado de carga
        const submitButton = document.querySelector('#register-form button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitButton.disabled = true;
        
        // Ocultar errores previos
        this.hideError();
        
        // Validar inputs
        const registerForm = document.getElementById('register-form');
        const nameElement = registerForm.querySelector('[name="name"]');
        const emailElement = registerForm.querySelector('[name="email"]');
        const passwordElement = registerForm.querySelector('[name="password"]');
        const passwordConfirmElement = registerForm.querySelector('[name="password_confirm"]');
        
        if (nameElement && emailElement && passwordElement && passwordConfirmElement) {
            const name = nameElement.value;
            const email = emailElement.value;
            const password = passwordElement.value;
            const passwordConfirm = passwordConfirmElement.value;
            
            if (!name || !email || !password || !passwordConfirm) {
                this.showError('Todos los campos son obligatorios');
                restoreButton();
                return false;
            }
            
            if (password !== passwordConfirm) {
                this.showError('Las contraseñas no coinciden');
                restoreButton();
                return false;
            }
            
            if (password.length < 6) {
                this.showError('La contraseña debe tener al menos 6 caracteres');
                restoreButton();
                return false;
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.showError('Email no válido');
                restoreButton();
                return false;
            }
            
            // Validar si el email ya existe
            if (!this.validateEmail(email)) {
                restoreButton();
                return false;
            }
            
            // Obtener usuarios existentes
            const users = this.initializeUsers();
            
            // Crear nuevo usuario (por defecto con rol 'user')
            const newUser = {
                id: 'user_' + Date.now(),
                name,
                email,
                password: this.hashPassword(password),
                role: 'user', // Solo el admin inicial tiene rol 'admin'
                created: new Date().toISOString()
            };
            
            // Guardar usuario
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            LogSystem.success('Nuevo usuario registrado', email);
            this.showSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
            
            // Redireccionar a login después de un breve retraso
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            console.warn('Elemento no encontrado en la página actual');
            restoreButton();
            return false;
        }
        
        // Al finalizar (sea éxito o error), restaurar el botón
        function restoreButton() {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
        
        // En caso de éxito:
        this.showSuccess("Registro exitoso. Redirigiendo...");
        // Y llamar a restoreButton() después de mostrar el éxito
    },
    
    // Login de usuario
    login(email, password) {
        if (!email || !password) {
            this.showError('Email y contraseña son obligatorios');
            return false;
        }
        
        // Obtener usuarios
        const users = this.initializeUsers();
        
        // Buscar usuario
        const user = users.find(user => user.email === email);
        if (!user) {
            this.showError('Credenciales incorrectas');
            LogSystem.warning('Intento de login fallido: usuario no encontrado', email);
            return false;
        }
        
        // Validar contraseña
        if (user.password !== this.hashPassword(password)) {
            this.showError('Credenciales incorrectas');
            LogSystem.warning('Intento de login fallido: contraseña incorrecta', email);
            return false;
        }
        
        // Login exitoso
        this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        this.isLoggedIn = true;
        
        // Guardar sesión
        localStorage.setItem('userSession', JSON.stringify({
            user: this.currentUser,
            timestamp: Date.now()
        }));
        
        LogSystem.success('Inicio de sesión exitoso', email);
        this.showSuccess(`¡Bienvenido, ${user.name}!`);
        
        // Actualizar UI
        this.updateUI();
        
        // Redireccionar después de login
        setTimeout(() => {
            const redirectTo = user.role === 'admin' ? 'admin/dashboard.html' : 'index.html';
            window.location.href = redirectTo;
        }, 1500);
        
        return true;
    },
    
    // Logout
    logout() {
        // Usar la función unificada de logout si existe
        if (window.performLogout) {
            window.performLogout();
            return;
        }
        
        // Código original como fallback
        const userEmail = this.currentUser?.email;
        
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Eliminar sesión
        localStorage.removeItem('userSession');
        
        if (userEmail) {
            LogSystem.info('Sesión cerrada', userEmail);
        }
        
        // Actualizar UI
        this.updateUI();
        
        // Redireccionar al inicio (sin alerta)
        window.location.href = 'index.html';
    },
    
    // Verificar si el usuario actual es administrador
    isAdmin() {
        return this.isLoggedIn && this.currentUser && this.currentUser.role === 'admin';
    },
    
    // Actualizar la interfaz según el estado de autenticación
    updateUI() {
        // Elementos que deberían mostrarse solo si está logueado
        const loggedInElements = document.querySelectorAll('.logged-in-only');
        // Elementos que deberían mostrarse solo si no está logueado
        const loggedOutElements = document.querySelectorAll('.logged-out-only');
        // Elementos que deberían mostrarse solo para admin
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        
        // Actualizar elementos según estado
        if (this.isLoggedIn) {
            loggedInElements.forEach(el => el.style.display = 'block');
            loggedOutElements.forEach(el => el.style.display = 'none');
            
            // Mostrar nombre de usuario donde sea necesario
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = this.currentUser.name;
            });
            
            // Manejar elementos de admin
            if (this.isAdmin()) {
                adminOnlyElements.forEach(el => el.style.display = 'block');
            } else {
                adminOnlyElements.forEach(el => el.style.display = 'none');
            }
        } else {
            loggedInElements.forEach(el => el.style.display = 'none');
            loggedOutElements.forEach(el => el.style.display = 'block');
            adminOnlyElements.forEach(el => el.style.display = 'none');
        }
    },
    
    // Proteger rutas de admin
    guardAdminRoute() {
        if (!this.isLoggedIn || !this.isAdmin()) {
            LogSystem.warning('Intento de acceso a área administrativa sin permisos', this.currentUser?.email || 'anonymous');
            
            // Redireccionar a página de error o inicio
            window.location.href = '../403.html';
            return false;
        }
        return true;
    },
    
    // Hash simple para contraseñas (en producción usaríamos algo más seguro)
    hashPassword(password) {
        // IMPORTANTE: En una app real, usar bcrypt o algo similar
        // Esto es solo para demostración
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hashed_' + hash;
    },
    
    // Mostrar mensaje de error
    showError(message) {
        const errorContainer = document.querySelector('.auth-error');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
            
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        } else {
            alert('Error: ' + message);
        }
    },
    
    // Ocultar mensaje de error
    hideError() {
        const errorContainer = document.querySelector('.auth-error');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    },
    
    // Mostrar mensaje de éxito
    showSuccess(message) {
        const successContainer = document.querySelector('.auth-success');
        if (successContainer) {
            successContainer.textContent = message;
            successContainer.style.display = 'block';
            
            setTimeout(() => {
                successContainer.style.display = 'none';
            }, 5000);
        } else {
            alert('Éxito: ' + message);
        }
    }
};

// Inicializar sistema de usuarios cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    UserSystem.init();
    
    // Proteger rutas de admin
    if (window.location.pathname.includes('/admin/')) {
        UserSystem.guardAdminRoute();
    }
});

// Exponer el sistema al ámbito global
window.UserSystem = UserSystem;