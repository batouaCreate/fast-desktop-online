import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

const Borderaux: React.FC = () => {
  const borderaux = [
    { id: '#BOR-001', date: '15/10/2025', nbrColis: 12, destination: 'Paris', status: 'Validé' },
    { id: '#BOR-002', date: '15/10/2025', nbrColis: 8, destination: 'Lyon', status: 'En attente' },
    { id: '#BOR-003', date: '14/10/2025', nbrColis: 15, destination: 'Marseille', status: 'Validé' },
    { id: '#BOR-004', date: '14/10/2025', nbrColis: 6, destination: 'Toulouse', status: 'Validé' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Borderaux de colis</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des documents d'expédition</p>
        </div>
        <button className="btn-primary">
          Créer un bordereau
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Numéro</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre de colis</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destination</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {borderaux.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{item.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.date}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.nbrColis}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.destination}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      item.status === 'Validé'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Eye size={18} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Download size={18} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
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

export default Borderaux;
