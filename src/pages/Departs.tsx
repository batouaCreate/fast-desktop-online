import React, { useState } from 'react';
import { Bus, Clock, MapPin } from 'lucide-react';
import TicketModal from '../components/TicketModal';

const Departs: React.FC = () => {
  const [selectedDeparture, setSelectedDeparture] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departs = [
    { id: '1', destination: 'Bouaké', heure: '07:30', quai: '1', status: 'À l\'heure', car: 'CAR 101' },
    { id: '2', destination: 'Ferkessédougou', heure: '08:45', quai: '2', status: 'À l\'heure', car: 'CAR 203' },
    { id: '3', destination: 'Agboville', heure: '10:15', quai: '3', status: 'Retard 15min', car: 'CAR 305' },
    { id: '4', destination: 'Dimbokro', heure: '12:30', quai: '1', status: 'À l\'heure', car: 'CAR 407' },
    { id: '5', destination: 'Ouagadougou', heure: '14:00', quai: '2', status: 'À l\'heure', car: 'CAR 509' },
    { id: '6', destination: 'Yamoussoukro', heure: '16:20', quai: '3', status: 'À l\'heure', car: 'CAR 611' },
  ];

  const handleVendreTicket = (depart: any) => {
    setSelectedDeparture(depart);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Départs</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des départs de trains</p>
        </div>
        <button className="btn-primary">
          Nouveau départ
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Car</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destination</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Heure</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Quai</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departs.map((depart) => (
                <tr key={depart.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Bus size={18} className="text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{depart.car}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{depart.destination}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{depart.heure}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold">
                      {depart.quai}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      depart.status === 'À l\'heure'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                    }`}>
                      {depart.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleVendreTicket(depart)}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Vendre Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de vente de ticket */}
      {selectedDeparture && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          departure={selectedDeparture}
        />
      )}
    </div>
  );
};

export default Departs;
