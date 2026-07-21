import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { departureApi, itineraryApi, Itinerary } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface DepartureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DepartureFormData {
  name: string;
  itineraryId: string;
  totalsSeats: number;
  carNumber: string;
  driverName: string;
  convoyeurName: string;
  date: string;
  time: string;
  roadFees: number;
  washingFees: number;
  fuelFees: number;
  stationFees: number;
  otherFees: number;
}

const DEFAULT_FORM: DepartureFormData = {
  name: '',
  itineraryId: '',
  totalsSeats: 0,
  carNumber: '',
  driverName: '',
  convoyeurName: '',
  date: '',
  time: '',
  roadFees: 0,
  washingFees: 0,
  fuelFees: 0,
  stationFees: 0,
  otherFees: 0,
};

const SELECT_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  backgroundSize: '1.25rem',
  paddingRight: '2.5rem',
};

const FIELD_CLASS = 'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent';

const DepartureFormModal: React.FC<DepartureFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [formData, setFormData] = useState<DepartureFormData>(DEFAULT_FORM);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoadingItineraries, setIsLoadingItineraries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadItineraries();
    }
  }, [isOpen]);

  const loadItineraries = async () => {
    const agencyId = localStorage.getItem('agenceId');
    if (!agencyId) return;

    try {
      setIsLoadingItineraries(true);
      const data = await itineraryApi.getByAgency(parseInt(agencyId));
      setItineraries(data);
    } catch (error) {
      console.error('Erreur chargement itinéraires:', error);
      showError('Erreur', 'Impossible de charger les itinéraires');
    } finally {
      setIsLoadingItineraries(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['totalsSeats', 'roadFees', 'washingFees', 'fuelFees', 'stationFees', 'otherFees'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.itineraryId || !formData.totalsSeats || !formData.date || !formData.time) {
      showError('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!user) {
      showError('Erreur', 'Utilisateur non connecté');
      return;
    }

    const agencyId = localStorage.getItem('agenceId');
    if (!agencyId) {
      showError('Erreur', 'Agence non identifiée');
      return;
    }

    try {
      setIsSubmitting(true);

      await departureApi.createDeparture({
        carNumber: formData.carNumber,
        departUser: parseInt(user.id),
        name: formData.name,
        totalsSeats: formData.totalsSeats,
        driverName: formData.driverName,
        convoyeurName: formData.convoyeurName,
        date: formData.date,
        time: formData.time,
        roadFees: formData.roadFees,
        washingFees: formData.washingFees,
        fuelFees: formData.fuelFees,
        stationFees: formData.stationFees,
        otherFees: formData.otherFees,
        agencyId: parseInt(agencyId),
        itineraryId: formData.itineraryId,
      });

      showSuccess('Succès', 'Départ créé avec succès');
      onSuccess();
      onClose();
      setFormData(DEFAULT_FORM);
    } catch (error: any) {
      console.error('Erreur création départ:', error);
      showError('Erreur', error.message || 'Impossible de créer le départ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nouveau Départ</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nom du départ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du départ <span className="text-red-500">*</span>
            </label>
            <select
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={FIELD_CLASS + ' appearance-none cursor-pointer'}
              style={SELECT_STYLE}
            >
              <option value="">Sélectionner un numéro de départ</option>
              {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                <option key={num} value={`DEPART ${num}`}>
                  DEPART {num}
                </option>
              ))}
            </select>
          </div>

          {/* Itinéraire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Itinéraire <span className="text-red-500">*</span>
            </label>
            {isLoadingItineraries ? (
              <div className="flex items-center gap-2 py-3">
                <Loader2 className="animate-spin text-primary-500" size={20} />
                <span className="text-gray-600 dark:text-gray-400">Chargement des itinéraires...</span>
              </div>
            ) : (
              <select
                name="itineraryId"
                value={formData.itineraryId}
                onChange={handleChange}
                required
                className={FIELD_CLASS + ' appearance-none cursor-pointer'}
                style={SELECT_STYLE}
              >
                <option value="">Sélectionner un itinéraire</option>
                {itineraries.map(it => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Nombre de places & Numéro de car */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de places <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalsSeats"
                value={formData.totalsSeats || ''}
                onChange={handleChange}
                required
                min="1"
                className={FIELD_CLASS}
                placeholder="Ex: 45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro de car
              </label>
              <input
                type="text"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                className={FIELD_CLASS}
                placeholder="Ex: AA001"
              />
            </div>
          </div>

          {/* Chauffeur & Convoyeur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chauffeur
              </label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                className={FIELD_CLASS}
                placeholder="Nom du chauffeur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Convoyeur
              </label>
              <input
                type="text"
                name="convoyeurName"
                value={formData.convoyeurName}
                onChange={handleChange}
                className={FIELD_CLASS}
                placeholder="Nom du convoyeur"
              />
            </div>
          </div>

          {/* Date & Heure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de départ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heure de départ <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className={FIELD_CLASS}
              />
            </div>
          </div>

          {/* Frais */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Frais du départ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frais de route
                </label>
                <input
                  type="number"
                  name="roadFees"
                  value={formData.roadFees || ''}
                  onChange={handleChange}
                  min="0"
                  className={FIELD_CLASS}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frais de lavage
                </label>
                <input
                  type="number"
                  name="washingFees"
                  value={formData.washingFees || ''}
                  onChange={handleChange}
                  min="0"
                  className={FIELD_CLASS}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frais de carburant
                </label>
                <input
                  type="number"
                  name="fuelFees"
                  value={formData.fuelFees || ''}
                  onChange={handleChange}
                  min="0"
                  className={FIELD_CLASS}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Droit de gare
                </label>
                <input
                  type="number"
                  name="stationFees"
                  value={formData.stationFees || ''}
                  onChange={handleChange}
                  min="0"
                  className={FIELD_CLASS}
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Autres dépenses
                </label>
                <input
                  type="number"
                  name="otherFees"
                  value={formData.otherFees || ''}
                  onChange={handleChange}
                  min="0"
                  className={FIELD_CLASS}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Création en cours...
                </>
              ) : (
                'Créer le départ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartureFormModal;
