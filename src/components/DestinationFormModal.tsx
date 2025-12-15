import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { destinationApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface DestinationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DestinationFormData {
  destination: string;
  prix: number;
}

const DestinationFormModal: React.FC<DestinationFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { success: showSuccess, error: showError } = useToast();

  const [formData, setFormData] = useState<DestinationFormData>({
    destination: '',
    prix: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'prix' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!formData.destination.trim()) {
      showError('Erreur', 'Veuillez saisir le nom de la destination');
      return;
    }

    if (!formData.prix || formData.prix <= 0) {
      showError('Erreur', 'Veuillez saisir un prix valide');
      return;
    }

    const agenceId = localStorage.getItem('agenceId');
    if (!agenceId) {
      showError('Erreur', 'ID de l\'agence non trouvé');
      return;
    }

    try {
      setIsSubmitting(true);

      // Appeler l'API pour créer la destination
      const response = await destinationApi.addDestination({
        agid: parseInt(agenceId),
        destination: formData.destination.trim(),
        prix: formData.prix,
      });

      showSuccess('Succès', response.msg || 'Destination ajoutée avec succès');
      onSuccess();
      onClose();

      // Réinitialiser le formulaire
      setFormData({
        destination: '',
        prix: 0,
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de la destination:', error);
      showError('Erreur', error.message || 'Impossible d\'ajouter la destination');
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle Destination</h2>
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
            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de la destination <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: ABIDJAN"
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix || ''}
                onChange={handleInputChange}
                required
                min="1"
                step="1"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: 3000"
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
                  Ajout...
                </>
              ) : (
                'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinationFormModal;
