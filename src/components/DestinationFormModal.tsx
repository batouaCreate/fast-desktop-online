import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { destinationApi, DestinationV2 } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface DestinationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  destination?: DestinationV2;
}

interface DestinationFormData {
  city: string;
  price: string;
  roundTripPrice: string;
}

const FIELD_CLASS = 'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent';

const DestinationFormModal: React.FC<DestinationFormModalProps> = ({ isOpen, onClose, onSuccess, destination }) => {
  const { success: showSuccess, error: showError } = useToast();
  const isEditMode = !!destination;

  const [formData, setFormData] = useState<DestinationFormData>({
    city: '',
    price: '',
    roundTripPrice: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (destination) {
        setFormData({
          city: destination.city,
          price: String(destination.price),
          roundTripPrice: destination.roundTripPrice != null ? String(destination.roundTripPrice) : '',
        });
      } else {
        setFormData({ city: '', price: '', roundTripPrice: '' });
      }
    }
  }, [isOpen, destination]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.city.trim()) {
      showError('Erreur', 'Veuillez saisir le nom de la destination');
      return;
    }

    if (!formData.price || parseInt(formData.price) <= 0) {
      showError('Erreur', 'Veuillez saisir un prix valide');
      return;
    }

    const agenceId = localStorage.getItem('agenceId');
    const userId = localStorage.getItem('userId');

    if (!agenceId || !userId) {
      showError('Erreur', 'Session invalide, veuillez vous reconnecter');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode && destination) {
        await destinationApi.updateDestination(destination.id, {
          userId: parseInt(userId),
          agency: { value: agenceId },
          city: formData.city.trim().toUpperCase(),
          price: parseInt(formData.price),
          ...(formData.roundTripPrice ? { roundTripPrice: parseInt(formData.roundTripPrice) } : {}),
        });
        showSuccess('Succès', 'Destination modifiée avec succès');
      } else {
        await destinationApi.addDestination({
          userId: parseInt(userId),
          agency: { value: agenceId },
          city: formData.city.trim().toUpperCase(),
          price: formData.price,
          ...(formData.roundTripPrice ? { roundTripPrice: formData.roundTripPrice } : {}),
        });
        showSuccess('Succès', 'Destination ajoutée avec succès');
      }

      onSuccess();
      onClose();
      setFormData({ city: '', price: '', roundTripPrice: '' });
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde de la destination:', error);
      showError('Erreur', error.message || 'Impossible de sauvegarder la destination');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Modifier la destination' : 'Nouvelle Destination'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de la destination <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className={FIELD_CLASS}
                placeholder="Ex: SAN PEDRO"
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="1"
                step="1"
                className={FIELD_CLASS}
                placeholder="Ex: 6600"
              />
            </div>

            {/* Prix Aller retour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix Aller retour (FCFA)
              </label>
              <input
                type="number"
                name="roundTripPrice"
                value={formData.roundTripPrice}
                onChange={handleInputChange}
                min="1"
                step="1"
                className={FIELD_CLASS}
                placeholder="Ex: 12000"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
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
                  {isEditMode ? 'Modification...' : 'Ajout...'}
                </>
              ) : (
                isEditMode ? 'Modifier' : 'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinationFormModal;
