import React from 'react';
import { Bus, Package, Briefcase, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Départs aujourd\'hui', value: '24', icon: <Bus size={24} />, color: 'from-blue-500 to-blue-600' },
    { label: 'Colis en transit', value: '156', icon: <Package size={24} />, color: 'from-purple-500 to-purple-600' },
    { label: 'Bagages enregistrés', value: '89', icon: <Briefcase size={24} />, color: 'from-green-500 to-green-600' },
    { label: 'Destinations actives', value: '6', icon: <TrendingUp size={24} />, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tableau de bord</h1>
        <p className="text-gray-600 dark:text-gray-400">Vue d'ensemble de l'activité de la gare</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-soft-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Derniers départs</h2>
          <div className="space-y-3">
            {[
              { destination: 'Bouaké', heure: '07:30', quai: '1', status: 'À l\'heure' },
              { destination: 'Ferkessédougou', heure: '08:45', quai: '2', status: 'Retard 15min' },
              { destination: 'Agboville', heure: '10:15', quai: '3', status: 'À l\'heure' },
            ].map((depart, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bus size={18} className="text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{depart.destination}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quai {depart.quai}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">{depart.heure}</p>
                  <p className={`text-sm ${depart.status.includes('Retard') ? 'text-orange-500' : 'text-green-500'}`}>
                    {depart.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité des colis</h2>
          <div className="space-y-3">
            {[
              { id: '#COL-1234', status: 'En attente', heure: '09:45' },
              { id: '#COL-1235', status: 'En transit', heure: '10:20' },
              { id: '#COL-1236', status: 'Livré', heure: '11:00' },
            ].map((colis, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Package size={18} className="text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{colis.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{colis.heure}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  colis.status === 'Livré'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : colis.status === 'En transit'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {colis.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
