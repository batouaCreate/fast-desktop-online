import React from 'react';
import { PackageCheck, Scan, CheckCircle } from 'lucide-react';

const Reception: React.FC = () => {
  const receptions = [
    { id: '#COL-5678', expediteur: 'Paris Gare du Nord', heure: '09:30', statut: 'Vérifié' },
    { id: '#COL-5679', expediteur: 'Lyon Part-Dieu', heure: '10:15', statut: 'En cours' },
    { id: '#COL-5680', expediteur: 'Marseille Saint-Charles', heure: '11:00', statut: 'En attente' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Réception de colis</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des arrivées de colis</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Scan size={20} />
          Scanner un colis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <PackageCheck size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Colis reçus aujourd'hui</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vérifiés</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
              <Scan size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">En cours de vérification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dernières réceptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Numéro colis</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Provenance</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Heure de réception</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receptions.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <PackageCheck size={18} className="text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{item.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.expediteur}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.heure}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      item.statut === 'Vérifié'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : item.statut === 'En cours'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {item.statut}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
                      Vérifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reception;
