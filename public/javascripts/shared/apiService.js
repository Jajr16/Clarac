// Api Service
export const api = {
    async request(url, method = 'GET', body = null) {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        if (!(body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            if (body) body = JSON.stringify(body);
        }

        const response = await fetch(url, { method, headers, body });

        if (!response.ok) {
            const error = new Error(`HTTP error status: ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return response.json();
    }
};