import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminSettings.css'

const Settings = () => {
  return (
    <AdminLayout>
      <div className="admin-settings">
        <div className="admin-header">
          <div>
            <h1>Paramètres</h1>
            <p>Configurez votre plateforme</p>
          </div>
        </div>

        <div className="settings-grid">
          {/* General Settings */}
          <div className="settings-card">
            <div className="settings-card-header">
              <h3>⚙️ Paramètres Généraux</h3>
            </div>
            <div className="settings-card-body">
              <div className="setting-item">
                <label>Nom de la plateforme</label>
                <input type="text" defaultValue="DZ Fellah" />
              </div>
              <div className="setting-item">
                <label>Email de contact</label>
                <input type="email" defaultValue="contact@dzfellah.dz" />
              </div>
              <div className="setting-item">
                <label>Téléphone</label>
                <input type="tel" defaultValue="+213 555 123 456" />
              </div>
              <div className="setting-item">
                <label>Adresse</label>
                <textarea rows="3" defaultValue="Alger, Algérie" />
              </div>
              <button className="btn-save">💾 Enregistrer</button>
            </div>
          </div>

          {/* Commission Settings */}
          <div className="settings-card">
            <div className="settings-card-header">
              <h3>💰 Commissions</h3>
            </div>
            <div className="settings-card-body">
              <div className="setting-item">
                <label>Commission plateforme (%)</label>
                <input type="number" defaultValue="10" min="0" max="100" />
                <small>Pourcentage prélevé sur chaque vente</small>
              </div>
              <div className="setting-item">
                <label>Frais de livraison (DA)</label>
                <input type="number" defaultValue="300" />
              </div>
              <div className="setting-item">
                <label>Montant minimum commande (DA)</label>
                <input type="number" defaultValue="1000" />
              </div>
              <button className="btn-save">💾 Enregistrer</button>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-card">
            <div className="settings-card-header">
              <h3>🔔 Notifications</h3>
            </div>
            <div className="settings-card-body">
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>Notifications email</span>
                </label>
              </div>
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>Notifications nouvelles commandes</span>
                </label>
              </div>
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>Notifications nouveaux utilisateurs</span>
                </label>
              </div>
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" />
                  <span>Notifications produits en rupture</span>
                </label>
              </div>
              <button className="btn-save">💾 Enregistrer</button>
            </div>
          </div>

          {/* Security */}
          <div className="settings-card">
            <div className="settings-card-header">
              <h3>🔒 Sécurité</h3>
            </div>
            <div className="settings-card-body">
              <div className="setting-item">
                <label>Changer mot de passe</label>
                <input type="password" placeholder="Nouveau mot de passe" />
              </div>
              <div className="setting-item">
                <label>Confirmer mot de passe</label>
                <input type="password" placeholder="Confirmer mot de passe" />
              </div>
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>Authentification à deux facteurs</span>
                </label>
              </div>
              <button className="btn-save">💾 Mettre à jour</button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="settings-card">
            <div className="settings-card-header">
              <h3>💳 Méthodes de paiement</h3>
            </div>
            <div className="settings-card-body">
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>Paiement à la livraison</span>
                </label>
              </div>
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>CCP</span>
                </label>
              </div>
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" />
                  <span>Carte bancaire</span>
                </label>
              </div>
              <div className="setting-toggle">
                <label>
                  <input type="checkbox" />
                  <span>Virement bancaire</span>
                </label>
              </div>
              <button className="btn-save">💾 Enregistrer</button>
            </div>
          </div>

          {/* System Info */}
          <div className="settings-card">
            <div className="settings-card-header">
              <h3>📊 Informations Système</h3>
            </div>
            <div className="settings-card-body">
              <div className="info-row">
                <span>Version</span>
                <strong>1.0.0</strong>
              </div>
              <div className="info-row">
                <span>Base de données</span>
                <strong>✅ Connectée</strong>
              </div>
              <div className="info-row">
                <span>Stockage utilisé</span>
                <strong>2.3 GB / 10 GB</strong>
              </div>
              <div className="info-row">
                <span>Dernière sauvegarde</span>
                <strong>21 Déc 2024, 10:30</strong>
              </div>
              <button className="btn-backup">💾 Sauvegarder maintenant</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Settings
