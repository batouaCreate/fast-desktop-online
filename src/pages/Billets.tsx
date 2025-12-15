import React, { useState, useEffect } from 'react';
import { Ticket, Search, Calendar, Loader2, RefreshCw } from 'lucide-react';
import { ticketApi, Ticket as TicketType } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Billets: React.FC = () => {
  const [billets, setBillets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    // Date par défaut: aujourd'hui au format YYYY-MM-DD
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const { user } = useAuth();
  const { error: showError } = useToast();

  const loadBillets = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await ticketApi.ticketByUser(
        parseInt(user.id),
        searchTerm,
        selectedDate
      );
      setBillets(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des billets:', error);
      showError('Erreur', 'Impossible de charger les billets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillets();
  }, [user, selectedDate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBillets();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Billets</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? 'Chargement...' : `${billets.length} billet(s) trouvé(s)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadBillets}
            disabled={isLoading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button className="btn-primary">
            Nouveau billet
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Filtre par date */}
        <div className="card">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="card">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un billet par siège, nom, téléphone..."
              className="w-full pl-12 pr-24 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Tableau des billets */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
        ) : billets.length === 0 ? (
          <div className="text-center py-12">
            <Ticket size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucun billet trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">N° Siège</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Client</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destination</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Départ</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Car</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date/Heure</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Prix</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {billets.map((item) => (
                  <tr key={item.tick_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Ticket size={18} className="text-primary-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{item.tick_siege}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 dark:text-white font-medium">{item.tick_nom || '-'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.tick_phone || '-'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{item.dest_ville}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{item.dep_nom}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{item.dep_numcar}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 dark:text-white">{item.depDate}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.dep_heure}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white font-semibold">{item.tick_price} FCFA</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        item.tick_type === 'STANDARD'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {item.tick_type}
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
        )}
      </div>
    </div>
  );
};

export default Billets;
