import React, { useState, useEffect } from 'react';
import { Package, Search, Calendar, Loader2, RefreshCw, X } from 'lucide-react';
import { colisApi, Colis as ColisType } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ColisFormModal from '../components/ColisFormModal';

const Colis: React.FC = () => {
  const [colis, setColis] = useState<ColisType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { error: showError } = useToast();

  const loadColis = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setIsCleared(false);
      const response = await colisApi.colisByUser(
        parseInt(user.id),
        searchTerm,
        selectedDate
      );
      setColis(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des colis:', error);
      showError('Erreur', 'Impossible de charger les colis');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadColis();
  }, [user]);

  const clearColis = () => {
    setColis([]);
    setIsCleared(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadColis();
  };

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return 'En attente';
      case 1:
        return 'En transit';
      case 2:
        return 'Livré';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status: number): string => {
    switch (status) {
      case 0:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 1:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 2:
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Colis</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? 'Chargement...' : `${colis.length} colis trouvé(s)`}
          </p>
        </div>
        <div className="flex gap-2">
          {!isCleared && (
            <button
              onClick={clearColis}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2"
            >
              <X size={18} />
              Vider
            </button>
          )}
          <button
            onClick={loadColis}
            disabled={isLoading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            Nouveau colis
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
              placeholder="Rechercher un colis par code, expéditeur, destinataire..."
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

      {/* Tableau des colis */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
        ) : colis.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucun colis trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Code</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Expéditeur</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destinataire</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Agence Dest.</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Valeur</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Frais</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date/Heure</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {colis.map((item) => (
                  <tr key={item.exp_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-primary-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{item.exp_code}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 dark:text-white font-medium">{item.exp_exp}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.exp_phonexp}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 dark:text-white font-medium">{item.exp_dest}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.exp_destphone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{item.agdest}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{item.exp_coldesc}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{item.exp_colval} FCFA</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{item.exp_frais} FCFA</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 dark:text-white">{item.depDate}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.dep_heure}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(item.exp_stat)}`}>
                        {getStatusLabel(item.exp_stat)}
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

      {/* Modal de création de colis */}
      <ColisFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadColis}
      />
    </div>
  );
};

export default Colis;
