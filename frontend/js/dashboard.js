document.addEventListener('DOMContentLoaded', function() {
    // Get user role from localStorage or default to client
    const userRole = localStorage.getItem('userRole') || 'client';
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'Utilisateur';
    
    // Set welcome message
    document.getElementById('welcome-message').textContent = `Bienvenue sur la plateforme de SNT AFRIC , ${userName}`;
    
    // Navigation functionality
    const menuItems = document.querySelectorAll('.sidebar-nav li[data-section]');
    const sections = document.querySelectorAll('.section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items and sections
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked item and corresponding section
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(`${sectionId}-section`).classList.add('active');
            
            // Load data for the section if needed
            loadSectionData(sectionId);
        });
    });
    
    // Logout functionality
    document.getElementById('logout').addEventListener('click', function() {
        localStorage.clear();
        window.location.href = '../../login.html';
    });
    
    // Load initial data based on user role
    loadInitialData(userRole, userId);
    
    // New request button for client
    if (document.getElementById('new-request-btn')) {
        document.getElementById('new-request-btn').addEventListener('click', function() {
            document.querySelector('.sidebar-nav li[data-section="nouvelle-demande"]').click();
        });
    }
    
    // Add technicien button for admin
    if (document.getElementById('add-technicien-btn')) {
        document.getElementById('add-technicien-btn').addEventListener('click', function() {
            // Open modal or redirect to add technicien page
            alert('Fonctionnalité d\'ajout de technicien');
        });
    }
});

function loadInitialData(userRole, userId) {
    // Simulate API calls based on user role
    switch(userRole) {
        case 'client':
            loadClientData(userId);
            break;
        case 'technicien':
            loadTechnicienData(userId);
            break;
        case 'admin':
            loadAdminData();
            break;
    }
}

function loadSectionData(sectionId) {
    // Load data when a section is activated
    switch(sectionId) {
        case 'demandes':
            loadDemandes();
            break;
        case 'paiements':
            loadPaiements();
            break;
        case 'profil':
            loadProfil();
            break;
        // Add other sections as needed
    }
}

function loadClientData(userId) {
    fetch(`https://snt-backend-9hhe.onrender.com/api/clients/${userId}/dashboard`)
        .then(response => response.json())
        .then(data => {
            // Update stats
            document.getElementById('demandes-en-cours').textContent = data.stats.enCours;
            document.getElementById('demandes-terminees').textContent = data.stats.terminees;
            document.getElementById('paiements-attente').textContent = data.stats.attente;

            // Load demandes
            const demandesHtml = data.demandes.map(demande => `
                <tr>
                    <td>${demande.id}</td>
                    <td>${demande.type}</td>
                    <td><span class="status-badge ${demande.statut.toLowerCase().replace(' ', '-')}">${demande.statut}</span></td>
                    <td>${demande.date}</td>
                    <td>${demande.technicien}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm">Détails</button>
                    </td>
                </tr>
            `).join('');
            document.getElementById('demandes-list').innerHTML = demandesHtml;

            // Load paiements
            const paiementsHtml = data.paiements.map(paiement => `
                <tr>
                    <td>${paiement.id}</td>
                    <td>${paiement.demande}</td>
                    <td>${paiement.montant}</td>
                    <td>${paiement.methode}</td>
                    <td><span class="status-badge ${paiement.statut.toLowerCase().replace(' ', '-')}">${paiement.statut}</span></td>
                    <td>${paiement.date}</td>
                </tr>
            `).join('');
            document.getElementById('payments-list').innerHTML = paiementsHtml;

            // Load timeline
            const timelineHtml = data.timeline.map(event => `
                <div class="timeline-item">
                    <div class="timeline-icon">
                        <i class="fas ${event.icon}"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-date">${event.date}</div>
                        <p>${event.content}</p>
                    </div>
                </div>
            `).join('');
            document.querySelector('.timeline-container').innerHTML = timelineHtml;
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données client :', error);
        });
}


function loadTechnicienData(userId) {
    fetch(`https://snt-backend-9hhe.onrender.com/api/techniciens/${userId}/dashboard`)
        .then(response => response.json())
        .then(data => {
            // Update stats
            document.getElementById('demandes-en-cours').textContent = data.stats.enCours;
            document.getElementById('demandes-terminees').textContent = data.stats.terminees;
            document.getElementById('demandes-attente').textContent = data.stats.attente;

            // Load demandes
            const demandesHtml = data.demandes.map(demande => `
                <tr>
                    <td>${demande.id}</td>
                    <td>${demande.client}</td>
                    <td>${demande.type}</td>
                    <td><span class="status-badge ${demande.statut.toLowerCase().replace(' ', '-')}">${demande.statut}</span></td>
                    <td>${demande.date}</td>
                    <td><span class="priority-badge ${demande.priorite.toLowerCase()}">${demande.priorite}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm">Détails</button>
                        <button class="btn btn-primary btn-sm">Mettre à jour</button>
                    </td>
                </tr>
            `).join('');
            document.getElementById('technicien-demandes-list').innerHTML = demandesHtml;

            // Load priority tasks
            const tasksHtml = data.tachesPrioritaires.map(task => `
                <div class="task-item priority-high">
                    <div class="task-info">
                        <h4>Demande #${task.id} - ${task.type}</h4>
                        <p>Client: ${task.client}</p>
                        <p>Date limite: ${task.deadline}</p>
                    </div>
                    <button class="btn btn-primary">Traiter</button>
                </div>
            `).join('');
            document.querySelector('.tasks-list').innerHTML = tasksHtml;
        })
        .catch(error => {
            console.error("Erreur lors du chargement des données technicien :", error);
        });
}


function loadAdminData() {
    // Simulate API call to get admin data
    setTimeout(() => {
        // Update stats
        document.getElementById('total-demandes').textContent = '45';
        document.getElementById('demandes-resolues').textContent = '32';
        document.getElementById('clients-actifs').textContent = '28';
        document.getElementById('total-techniciens').textContent = '5';
        
        // Load all demandes
        const demandesList = [
            { id: '123', client: 'John Doe', type: 'Logiciel', statut: 'Terminé', technicien: 'Technicien Martin', date: '2023-05-10', priorite: 'Normale' },
            { id: '456', client: 'Jane Smith', type: 'Réseau', statut: 'En cours', technicien: 'Technicien Dupont', date: '2023-05-15', priorite: 'Haute' }
        ];
        
        const demandesHtml = demandesList.map(demande => `
            <tr>
                <td>${demande.id}</td>
                <td>${demande.client}</td>
                <td>${demande.type}</td>
                <td><span class="status-badge ${demande.statut.toLowerCase().replace(' ', '-')}">${demande.statut}</span></td>
                <td>${demande.technicien}</td>
                <td>${demande.date}</td>
                <td><span class="priority-badge ${demande.priorite.toLowerCase()}">${demande.priorite}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm">Détails</button>
                    <button class="btn btn-primary btn-sm">Assigner</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('admin-demandes-list').innerHTML = demandesHtml;
        
        // Load techniciens
        const techniciensList = [
            { id: '1', nom: 'Technicien Dupont', specialite: 'Réseaux & Sécurité', disponibilite: 'Disponible', demandes: '3', performance: '90%' },
            { id: '2', nom: 'Technicien Martin', specialite: 'Logiciels', disponibilite: 'Disponible', demandes: '2', performance: '85%' }
        ];
        
        const techniciensHtml = techniciensList.map(technicien => `
            <tr>
                <td>${technicien.id}</td>
                <td>${technicien.nom}</td>
                <td>${technicien.specialite}</td>
                <td><span class="status-badge ${technicien.disponibilite.toLowerCase().replace(' ', '-')}">${technicien.disponibilite}</span></td>
                <td>${technicien.demandes}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${technicien.performance}"></div>
                    </div>
                    <span>${technicien.performance}</span>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm">Détails</button>
                    <button class="btn btn-primary btn-sm">Modifier</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('techniciens-list').innerHTML = techniciensHtml;
        
        // Load clients
        const clientsList = [
            { id: '1', nom: 'John Doe', email: 'john.doe@example.com', telephone: '+225 07 00 00 00 00', demandes: '5', derniereActivite: '2023-05-15' },
            { id: '2', nom: 'Jane Smith', email: 'jane.smith@example.com', telephone: '+225 05 00 00 00 00', demandes: '3', derniereActivite: '2023-05-14' }
        ];
        
        const clientsHtml = clientsList.map(client => `
            <tr>
                <td>${client.id}</td>
                <td>${client.nom}</td>
                <td>${client.email}</td>
                <td>${client.telephone}</td>
                <td>${client.demandes}</td>
                <td>${client.derniereActivite}</td>
                <td>
                    <button class="btn btn-secondary btn-sm">Détails</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('clients-list').innerHTML = clientsHtml;
        
        // Load paiements
        const paiementsList = [
            { id: '789', client: 'John Doe', demande: '456', montant: '25,000 FCFA', methode: 'Orange Money', statut: 'Complété', date: '2023-05-12' },
            { id: '321', client: 'Jane Smith', demande: '123', montant: '15,000 FCFA', methode: 'Wave', statut: 'En attente', date: '2023-05-08' }
        ];
        
        const paiementsHtml = paiementsList.map(paiement => `
            <tr>
                <td>${paiement.id}</td>
                <td>${paiement.client}</td>
                <td>${paiement.demande}</td>
                <td>${paiement.montant}</td>
                <td>${paiement.methode}</td>
                <td><span class="status-badge ${paiement.statut.toLowerCase().replace(' ', '-')}">${paiement.statut}</span></td>
                <td>${paiement.date}</td>
                <td>
                    <button class="btn btn-secondary btn-sm">Détails</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('admin-payments-list').innerHTML = paiementsHtml;
        
        // Initialize charts
        initCharts();
    }, 500);
}

function initCharts() {
    // Requests chart
    const requestsCtx = document.getElementById('requests-chart').getContext('2d');
    const requestsChart = new Chart(requestsCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Demandes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: '#d0640b',
                borderColor: '#b85609',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Demandes par mois'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Payments chart
    const paymentsCtx = document.getElementById('payments-chart').getContext('2d');
    const paymentsChart = new Chart(paymentsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Orange Money', 'MTN Mobile Money', 'Wave', 'Moov Money'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: [
                    '#FF6B00',
                    '#FFC100',
                    '#00BFFF',
                    '#FF007F'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Méthodes de paiement'
                }
            }
        }
    });
}
class NotificationManager {
    constructor() {
        this.notificationCheckInterval = 30000; // 30 secondes
        this.init();
    }

    init() {
        this.loadNotifications();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    async loadNotifications() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const notifications = await response.json();
                this.updateNotificationUI(notifications);
                
                // Mettre à jour le compteur
                const countResponse = await fetch('http://localhost:5000/api/notifications/unread-count', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (countResponse.ok) {
                    const { count } = await countResponse.json();
                    this.updateBadge(count);
                }
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    updateNotificationUI(notifications) {
        const notificationList = document.getElementById('notification-dropdown');
        if (!notificationList) return;
        
        notificationList.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.lue ? '' : 'unread'}" data-id="${notif.id}">
                <div class="notification-icon">
                    <i class="fas ${this.getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notif.titre}</h4>
                    <p>${notif.message}</p>
                    <small>${new Date(notif.date_creation).toLocaleString()}</small>
                </div>
                ${notif.lien ? `<a href="${notif.lien}" class="notification-link"></a>` : ''}
            </div>
        `).join('');
    }

    updateBadge(count) {
        const badge = document.getElementById('notification-count');
        if (badge) {
            badge.textContent = count > 0 ? count : '';
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    getNotificationIcon(type) {
        const icons = {
            'demande': 'fa-ticket-alt',
            'paiement': 'fa-credit-card',
            'intervention': 'fa-tools',
            'system': 'fa-info-circle'
        };
        return icons[type] || 'fa-bell';
    }

    async markAsRead(notificationId) {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    setupEventListeners() {
        // Gestion du dropdown
        const notificationsBtn = document.querySelector('.notifications');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationsBtn.classList.toggle('open');
            });
        }

        // Fermer quand on clique ailleurs
        document.addEventListener('click', () => {
            const dropdown = document.querySelector('.notifications.open');
            if (dropdown) dropdown.classList.remove('open');
        });

        // Marquer comme lue au clic
        document.addEventListener('click', async (e) => {
            const notificationItem = e.target.closest('.notification-item');
            if (notificationItem) {
                const notificationId = notificationItem.dataset.id;
                await this.markAsRead(notificationId);
                notificationItem.classList.remove('unread');
                this.updateBadge(parseInt(document.getElementById('notification-count').textContent || '0') - 1);
            }
        });

        // Marquer toutes comme lues
        const markAllReadBtn = document.getElementById('mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    const token = localStorage.getItem('token');
                    await fetch('http://localhost:5000/api/notifications/mark-all-read', {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    document.querySelectorAll('.notification-item.unread').forEach(item => {
                        item.classList.remove('unread');
                    });
                    this.updateBadge(0);
                } catch (error) {
                    console.error('Error marking all as read:', error);
                }
            });
        }
    }

    startAutoRefresh() {
        setInterval(() => this.loadNotifications(), this.notificationCheckInterval);
    }
}

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        const apiBaseUrl = 'https://snt-backend-9hhe.onrender.com';
        new NotificationManager(apiBaseUrl);
    }
});

const API_BASE_URL = 'https://snt-backend-9hhe.onrender.com';

async function loadDemandes() {
    console.log('Loading demandes data...');
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/demandes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const demandes = await response.json();
            console.log('Demandes:', demandes);
            // Ici, tu peux mettre à jour ton interface avec les demandes
        } else {
            console.error('Erreur chargement demandes:', response.status);
        }
    } catch (error) {
        console.error('Erreur réseau demandes:', error);
    }
}

async function loadPaiements() {
    console.log('Loading paiements data...');
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/paiements`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const paiements = await response.json();
            console.log('Paiements:', paiements);
            // Ici, tu peux mettre à jour ton interface avec les paiements
        } else {
            console.error('Erreur chargement paiements:', response.status);
        }
    } catch (error) {
        console.error('Erreur réseau paiements:', error);
    }
}

async function loadProfil() {
    console.log('Loading profil data...');
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/profil`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const profil = await response.json();
            console.log('Profil:', profil);
            // Ici, tu peux mettre à jour ton interface avec les infos du profil
        } else {
            console.error('Erreur chargement profil:', response.status);
        }
    } catch (error) {
        console.error('Erreur réseau profil:', error);
    }
}
