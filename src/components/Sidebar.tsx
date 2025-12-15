import React, { useState } from 'react';
import {
  LayoutDashboard,
  Car,
  FileText,
  Package,
  PackageCheck,
  Briefcase,
  Ticket,
  MapPin,
  Settings,
  LogOut,
  User,
  UserCheck,
  Bus,
  Printer
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from './ConfirmModal';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Opérations',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/' },
      { id: 'departs', label: 'Départs', icon: <Car size={20} />, path: '/departs' },
      { id: 'destinations', label: 'Destinations', icon: <MapPin size={20} />, path: '/destinations' },
    ]
  },
  {
    title: 'Gestion des Colis',
    items: [
      { id: 'colis', label: 'Colis', icon: <Package size={20} />, path: '/colis' },
      { id: 'reception', label: 'Réception', icon: <PackageCheck size={20} />, path: '/reception' },
      { id: 'borderaux', label: 'Borderaux', icon: <FileText size={20} />, path: '/borderaux' },
    ]
  },
  {
    title: 'Bagages & Billets',
    items: [
      { id: 'bagages', label: 'Bagages', icon: <Briefcase size={20} />, path: '/bagages' },
      { id: 'billets', label: 'Billets', icon: <Ticket size={20} />, path: '/billets' },
    ]
  },
  {
    title: 'Personnel',
    items: [
      { id: 'chauffeurs', label: 'Chauffeurs', icon: <User size={20} />, path: '/chauffeurs' },
      { id: 'convoyeurs', label: 'Convoyeurs', icon: <UserCheck size={20} />, path: '/convoyeurs' },
    ]
  },
  {
    title: 'Flotte',
    items: [
      { id: 'cars', label: 'Gestion des Cars', icon: <Bus size={20} />, path: '/cars' },
    ]
  }
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const toast = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie', 'À bientôt!');
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <Car className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Fast</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Transport & Logistique</p>
          </div>
        </div>
      </div>

      {/* Navigation with sections */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`sidebar-item w-full ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Settings section */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Administration
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => navigate('/settings')}
              className={`sidebar-item w-full ${
                location.pathname === '/settings' ? 'active' : ''
              }`}
            >
              <Settings size={20} />
              <span className="font-medium">Paramètres</span>
            </button>
            <button
              onClick={() => navigate('/printer-test')}
              className={`sidebar-item w-full ${
                location.pathname === '/printer-test' ? 'active' : ''
              }`}
            >
              <Printer size={20} />
              <span className="font-medium">Test Imprimante</span>
            </button>
          </div>
        </div>
      </nav>

      {/* User profile and logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Utilisateur'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.agence?.name || user?.phone || 'Fast'}</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirmer la déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter? Vous devrez vous reconnecter pour accéder à l'application."
        confirmText="Se déconnecter"
        cancelText="Annuler"
        variant="warning"
      />
    </aside>
  );
};

export default Sidebar;
