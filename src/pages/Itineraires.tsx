import React, { useState, useEffect } from 'react';
import { Route, MapPin, Building2 } from 'lucide-react';
import { itineraryApi, Itinerary } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ItineraireFormModal from '../components/ItineraireFormModal';

const Itineraires: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      const agencyId = localStorage.getItem('agenceId');

      if (!agencyId) {
        showToast('error', 'Erreur', 'ID de l\'agence non trouvé');
        return;
      }

      const data = await itineraryApi.getByAgency(parseInt(agencyId));
      setItineraries(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des itinéraires:', error);
      showToast('error', 'Erreur', error.message || 'Erreur lors du chargement des itinéraires');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des itinéraires...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Itinéraires</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Liste des itinéraires de l'agence ({itineraries.length} itinéraire{itineraries.length > 1 ? 's' : ''})
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Créer un itinéraire
        </button>
      </div>

      {itineraries.length === 0 ? (
        <div className="card text-center py-12">
          <Route size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun itinéraire trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Aucun itinéraire n'est configuré pour cette agence.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itin) => (
            <div key={itin.id} className="card hover:shadow-soft-lg transition-all duration-200">
              {/* En-tête : nom de la ligne */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white flex-shrink-0">
                  <Route size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{itin.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{itin.agencyName}</span>
                  </div>
                </div>
              </div>

              {/* Liste des destinations */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Destinations ({itin.destinations?.length ?? 0})
                </p>
                {itin.destinations && itin.destinations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {itin.destinations.map((dest, index) => {
                      const label = dest.destination?.city ?? dest.city ?? '—';
                      return (
                        <span
                          key={dest.id ?? index}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full"
                        >
                          <MapPin size={11} />
                          {label}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">Aucune destination</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ItineraireFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadItineraries}
      />
    </div>
  );
};

export default Itineraires;
