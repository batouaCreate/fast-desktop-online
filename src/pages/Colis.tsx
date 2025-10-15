import React from 'react';
import { Package, Search } from 'lucide-react';

const Colis: React.FC = () => {
  const colis = [
    { id: '#COL-1234', expediteur: 'Jean Dupont', destinataire: 'Marie Martin', destination: 'Paris', status: 'En attente', poids: '2.5 kg' },
    { id: '#COL-1235', expediteur: 'Sophie Bernard', destinataire: 'Pierre Durand', destination: 'Lyon', status: 'En transit', poids: '5.0 kg' },
    { id: '#COL-1236', expediteur: 'Marc Petit', destinataire: 'Julie Roux', destination: 'Marseille', status: 'Livré', poids: '1.8 kg' },
    { id: '#COL-1237', expediteur: 'Luc Moreau', destinataire: 'Anne Simon', destination: 'Toulouse', status: 'En attente', poids: '3.2 kg' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Colis</h1>
          <p className="text-gray-600 dark:text-gray-400">Suivi et gestion des colis en transit</p>
        </div>
        <button className="btn-primary">
          Nouveau colis
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un colis par numéro, expéditeur, destinataire..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Numéro</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Expéditeur</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destinataire</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destination</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Poids</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colis.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Package size={18} className="text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{item.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.expediteur}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.destinataire}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.destination}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{item.poids}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      item.status === 'Livré'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : item.status === 'En transit'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
                      Détails
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

export default Colis;
