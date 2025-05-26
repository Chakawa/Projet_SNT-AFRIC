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
    // Simulate API call to get client data
    setTimeout(() => {
        // Update stats
        document.getElementById('demandes-en-cours').textContent = '2';
        document.getElementById('demandes-terminees').textContent = '5';
        document.getElementById('paiements-attente').textContent = '1';
        
        // Load demandes
        const demandesList = [
            { id: '456', type: 'Réseau', statut: 'En cours', date: '2023-05-15', technicien: 'Technicien Dupont' },
            { id: '123', type: 'Logiciel', statut: 'Terminé', date: '2023-05-10', technicien: 'Technicien Martin' }
        ];
        
        const demandesHtml = demandesList.map(demande => `
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
        const paiementsList = [
            { id: '789', demande: '456', montant: '25,000 FCFA', methode: 'Orange Money', statut: 'Complété', date: '2023-05-12' },
            { id: '321', demande: '123', montant: '15,000 FCFA', methode: 'Wave', statut: 'En attente', date: '2023-05-08' }
        ];
        
        const paiementsHtml = paiementsList.map(paiement => `
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
        const timelineEvents = [
            { icon: 'fa-ticket-alt', date: '2023-05-10 09:30', content: 'Demande #123 créée' },
            { icon: 'fa-user-cog', date: '2023-05-11 14:15', content: 'Demande #123 assignée à Technicien Martin' },
            { icon: 'fa-check-circle', date: '2023-05-12 16:45', content: 'Demande #123 marquée comme terminée' }
        ];
        
        const timelineHtml = timelineEvents.map((event, index) => `
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
    }, 500);
}

function loadTechnicienData(userId) {
    // Simulate API call to get technicien data
    setTimeout(() => {
        // Update stats
        document.getElementById('demandes-en-cours').textContent = '3';
        document.getElementById('demandes-terminees').textContent = '12';
        document.getElementById('demandes-attente').textContent = '2';
        
        // Load demandes assignées
        const demandesList = [
            { id: '456', client: 'John Doe', type: 'Réseau', statut: 'En cours', date: '2023-05-15', priorite: 'Haute' },
            { id: '789', client: 'Jane Smith', type: 'Matériel', statut: 'En attente', date: '2023-05-14', priorite: 'Moyenne' }
        ];
        
        const demandesHtml = demandesList.map(demande => `
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
        const priorityTasks = [
            { id: '456', client: 'John Doe', type: 'Problème de réseau', deadline: '2023-05-18' }
        ];
        
        const tasksHtml = priorityTasks.map(task => `
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
    }, 500);
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
        new NotificationManager();
    }
});

function loadDemandes() {
    // Load demandes data when section is activated
    console.log('Loading demandes data...');
}

function loadPaiements() {
    // Load paiements data when section is activated
    console.log('Loading paiements data...');
}

function loadProfil() {
    // Load profil data when section is activated
    console.log('Loading profil data...');
}