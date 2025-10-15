import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const Destinations: React.FC = () => {
  const destinations = [
    { nom: 'Bouaké', code: 'BKE', distance: '348 km', temps: '6h 30min', frequence: '3 trains/jour' },
    { nom: 'Ferkessédougou', code: 'FRK', distance: '583 km', temps: '11h 00min', frequence: '2 trains/jour' },
    { nom: 'Yamoussoukro', code: 'YMS', distance: '240 km', temps: '4h 30min', frequence: '2 trains/jour' },
    { nom: 'Agboville', code: 'AGB', distance: '78 km', temps: '1h 45min', frequence: '4 trains/jour' },
    { nom: 'Dimbokro', code: 'DMB', distance: '192 km', temps: '3h 45min', frequence: '3 trains/jour' },
    { nom: 'Ouagadougou', code: 'OUA', distance: '1,145 km', temps: '24h 00min', frequence: '1 train/jour' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Destinations</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des destinations desservies</p>
        </div>
        <button className="btn-primary">
          Nouvelle destination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest, index) => (
          <div key={index} className="card hover:shadow-soft-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{dest.nom}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Code: {dest.code}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{dest.distance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Temps de trajet</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{dest.temps}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Fréquence</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{dest.frequence}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
              <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Navigation size={16} />
                Voir l'itinéraire
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
