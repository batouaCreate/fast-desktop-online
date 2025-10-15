import React from 'react';
import { Briefcase, AlertCircle } from 'lucide-react';

const Bagages: React.FC = () => {
  const bagages = [
    { id: '#BAG-101', proprietaire: 'Alice Martin', train: 'TGV 8734', destination: 'Paris', status: 'Enregistré', type: 'Valise' },
    { id: '#BAG-102', proprietaire: 'Bob Dupont', train: 'TGV 8742', destination: 'Lyon', status: 'En transit', type: 'Sac de voyage' },
    { id: '#BAG-103', proprietaire: 'Claire Bernard', train: 'TGV 8756', destination: 'Marseille', status: 'Perdu', type: 'Valise' },
    { id: '#BAG-104', proprietaire: 'David Petit', train: 'TGV 8801', destination: 'Toulouse', status: 'Enregistré', type: 'Sac à dos' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Bagages</h1>
          <p className="text-gray-600 dark:text-gray-400">Suivi et gestion des bagages des voyageurs</p>
        </div>
        <button className="btn-primary">
          Enregistrer un bagage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bagages enregistrés</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bagages perdus</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">42</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Livrés</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Numéro</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Propriétaire</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Train</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destination</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bagages.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{item.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.proprietaire}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.train}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{item.destination}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{item.type}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      item.status === 'Enregistré'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : item.status === 'En transit'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
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

export default Bagages;
