const API_URL = 'http://localhost:3000/api';

const apiService = {
    async register(name, email, password, bloodGroup) {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, bloodGroup })
        });
        return res.json();
    },

    async login(email, password) {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    async getContacts(email) {
        const res = await fetch(`${API_URL}/contacts/${encodeURIComponent(email)}`);
        const data = await res.json();
        return data.contacts || [];
    },

    async addContact(userEmail, contact) {
        const res = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail, contact })
        });
        return res.json();
    },

    async deleteContact(userEmail, contactId) {
        const res = await fetch(`${API_URL}/contacts/${encodeURIComponent(userEmail)}/${contactId}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    async saveSOSAlert(userEmail, location, riskLevel, riskFactors) {
        const res = await fetch(`${API_URL}/sos-alert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail, location, riskLevel, riskFactors })
        });
        return res.json();
    },

    async getAlertStats(email) {
        const res = await fetch(`${API_URL}/alert-stats/${encodeURIComponent(email)}`);
        const data = await res.json();
        return data.stats || { total: 0, active: 0 };
    },

    async getSOSAlerts(email) {
        const res = await fetch(`${API_URL}/sos-alerts/${encodeURIComponent(email)}`);
        const data = await res.json();
        return data.alerts || [];
    },

    async registerVolunteer(data) {
        const res = await fetch(`${API_URL}/volunteers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async getVolunteers(gender = null) {
        const url = gender ? `${API_URL}/volunteers?gender=${gender}` : `${API_URL}/volunteers`;
        const res = await fetch(url);
        const data = await res.json();
        return data.volunteers || [];
    },

    async updateVolunteerStatus(id, status) {
        const res = await fetch(`${API_URL}/volunteers/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return res.json();
    },

    async deleteVolunteer(id) {
        const res = await fetch(`${API_URL}/volunteers/${id}`, { method: 'DELETE' });
        return res.json();
    }
};
