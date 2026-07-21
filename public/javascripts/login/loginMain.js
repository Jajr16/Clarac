import { login } from "./loginAPI.js";
import { showError, redirectHome } from "./loginUI.js";

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    try {
        const data = await login(username, password);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.user);
        localStorage.setItem('permissions', JSON.stringify(data.permissions));
        
        redirectHome();
    } catch (error) {
        showError('Error en el servidor. Por favor, inténtelo de nuevo más tarde.');
        console.error('Error en la solicitud:', error);
    }
})