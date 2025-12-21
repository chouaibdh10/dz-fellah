import React, { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminUsers.css'

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Ahmed Benali',
      email: 'ahmed.benali@gmail.com',
      role: 'client',
      status: 'active',
      joinDate: '2024-01-15',
      orders: 23,
      totalSpent: 45600
    },
    {
      id: 2,
      name: 'Fatima Kouider',
      email: 'fatima.producteur@gmail.com',
      role: 'producer',
      status: 'active',
      joinDate: '2024-02-20',
      products: 45,
      sales: 125000
    },
    {
      id: 3,
      name: 'Karim Meziane',
      email: 'karim.m@gmail.com',
      role: 'client',
      status: 'active',
      joinDate: '2024-03-10',
      orders: 12,
      totalSpent: 28900
    },
    {
      id: 4,
      name: 'Sarah Lahmar',
      email: 'sarah.ferme@gmail.com',
      role: 'producer',
      status: 'pending',
      joinDate: '2024-11-05',
      products: 12,
      sales: 34000
    },
    {
      id: 5,
      name: 'Mohamed Alaoui',
      email: 'mohamed.a@gmail.com',
      role: 'client',
      status: 'inactive',
      joinDate: '2024-01-08',
      orders: 3,
      totalSpent: 5400
    },
    {
      id: 6,
      name: 'Amina Brahim',
      email: 'amina.producteur@gmail.com',
      role: 'producer',
      status: 'active',
      joinDate: '2024-04-12',
      products: 67,
      sales: 189000
    }
  ])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'status-active', text: 'Actif' },
      pending: { class: 'status-pending', text: 'En attente' },
      inactive: { class: 'status-inactive', text: 'Inactif' }
    }
    return badges[status] || badges.inactive
  }

  const getRoleBadge = (role) => {
    const badges = {
      client: { icon: '👤', text: 'Client', class: 'role-client' },
      producer: { icon: '🌾', text: 'Producteur', class: 'role-producer' },
      admin: { icon: '👑', text: 'Admin', class: 'role-admin' }
    }
    return badges[role] || badges.client
  }

  const stats = {
    total: users.length,
    clients: users.filter(u => u.role === 'client').length,
    producers: users.filter(u => u.role === 'producer').length,
    active: users.filter(u => u.status === 'active').length
  }

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="admin-header">
          <div>
            <h1>Gestion des Utilisateurs</h1>
            <p>Gérez tous les utilisateurs de la plateforme</p>
          </div>
          <button className="btn-primary">
            ➕ Ajouter Utilisateur
          </button>
        </div>

        {/* Stats rapides */}
        <div className="users-stats">
          <div className="users-stat-card">
            <div className="stat-icon">👥</div>
            <div>
              <h3>{stats.total}</h3>
              <p>Total Utilisateurs</p>
            </div>
          </div>
          <div className="users-stat-card">
            <div className="stat-icon">👤</div>
            <div>
              <h3>{stats.clients}</h3>
              <p>Clients</p>
            </div>
          </div>
          <div className="users-stat-card">
            <div className="stat-icon">🌾</div>
            <div>
              <h3>{stats.producers}</h3>
              <p>Producteurs</p>
            </div>
          </div>
          <div className="users-stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{stats.active}</h3>
              <p>Actifs</p>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="users-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">Tous les rôles</option>
              <option value="client">Clients</option>
              <option value="producer">Producteurs</option>
              <option value="admin">Administrateurs</option>
            </select>
          </div>
        </div>

        {/* Table des utilisateurs */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Date d'inscription</th>
                <th>Activité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const roleBadge = getRoleBadge(user.role)
                const statusBadge = getStatusBadge(user.status)
                
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${roleBadge.class}`}>
                        {roleBadge.icon} {roleBadge.text}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>{new Date(user.joinDate).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {user.role === 'client' ? (
                        <div className="activity-info">
                          <div>{user.orders} commandes</div>
                          <div className="activity-sub">{user.totalSpent.toLocaleString()} DA</div>
                        </div>
                      ) : (
                        <div className="activity-info">
                          <div>{user.products} produits</div>
                          <div className="activity-sub">{user.sales.toLocaleString()} DA</div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Voir détails">👁️</button>
                        <button className="btn-icon" title="Modifier">✏️</button>
                        <select 
                          className="status-select"
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        >
                          <option value="active">Activer</option>
                          <option value="pending">En attente</option>
                          <option value="inactive">Désactiver</option>
                        </select>
                        <button 
                          className="btn-icon danger" 
                          title="Supprimer"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <p>Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Users
