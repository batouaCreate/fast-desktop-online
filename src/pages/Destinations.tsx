import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Edit } from 'lucide-react';
import { destinationApi, DestinationV2 } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import DestinationFormModal from '../components/DestinationFormModal';

const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<DestinationV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<DestinationV2 | undefined>(undefined);
  const { showToast } = useToast();

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const agenceId = localStorage.getItem('agenceId');

      if (!agenceId) {
        showToast('error', 'Erreur', 'ID de l\'agence non trouvé');
        return;
      }

      const data = await destinationApi.getByAgency(parseInt(agenceId));
      setDestinations(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des destinations:', error);
      showToast('error', 'Erreur', error.message || 'Erreur lors du chargement des destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    loadDestinations();
  };

  const handleEditClick = (dest: DestinationV2) => {
    setEditingDestination(dest);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDestination(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Destinations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestion des destinations desservies ({destinations.length} destination{destinations.length > 1 ? 's' : ''})
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Nouvelle destination
        </button>
      </div>

      {destinations.length === 0 ? (
        <div className="card text-center py-12">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucune destination trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Aucune destination n'est configurée pour cette agence.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div key={dest.id} className="card hover:shadow-soft-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{dest.city}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {dest.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prix</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{dest.price} FCFA</span>
                </div>
                {dest.createdDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Créé le</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(dest.createdDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                <button
                  onClick={() => handleEditClick(dest)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Modifier
                </button>
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Navigation size={16} />
                  Itinéraire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DestinationFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        destination={editingDestination}
      />
    </div>
  );
};

export default Destinations;
