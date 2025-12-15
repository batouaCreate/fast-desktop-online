import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Paramètres</h1>
        <p className="text-gray-600 dark:text-gray-400">Configuration de l'application</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Apparence</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Mode d'affichage</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choisissez le thème de l'application</p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <>
                    <Sun size={20} className="text-yellow-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Clair</span>
                  </>
                ) : (
                  <>
                    <Moon size={20} className="text-blue-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Sombre</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Général</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Langue</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Français</p>
              </div>
              <button className="btn-secondary">
                Modifier
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800"></div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Fuseau horaire</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Europe/Paris (GMT+1)</p>
              </div>
              <button className="btn-secondary">
                Modifier
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: 'Notifications de départs', enabled: true },
              { label: 'Notifications de colis', enabled: true },
              { label: 'Alertes système', enabled: false },
            ].map((notif, index) => (
              <div key={index} className="flex items-center justify-between py-3">
                <p className="font-medium text-gray-900 dark:text-white">{notif.label}</p>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notif.enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notif.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">Zone de danger</h2>
          <p className="text-sm text-red-700 dark:text-red-400 mb-4">
            Ces actions sont irréversibles. Veuillez procéder avec précaution.
          </p>
          <button className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors">
            Réinitialiser les données
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
