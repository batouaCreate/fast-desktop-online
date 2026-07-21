import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import { itineraryApi, destinationApi, DestinationV2, ItineraryStepRequest } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface StepRow {
  destinationId: number | '';
  isFinal: boolean;
  distanceFromPrevious: number;
  durationMinutes: number;
}

const emptyStep = (): StepRow => ({
  destinationId: '',
  isFinal: false,
  distanceFromPrevious: 0,
  durationMinutes: 0,
});

const ItineraireFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<StepRow[]>([emptyStep()]);
  const [destinations, setDestinations] = useState<DestinationV2[]>([]);
  const [loadingDest, setLoadingDest] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const agencyId = localStorage.getItem('agenceId');
    if (!agencyId) return;

    setLoadingDest(true);
    destinationApi.getByAgency(parseInt(agencyId))
      .then(setDestinations)
      .catch(() => showToast('error', 'Erreur', 'Impossible de charger les destinations'))
      .finally(() => setLoadingDest(false));
  }, [isOpen]);

  const updateStep = (index: number, field: keyof StepRow, value: any) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const addStep = () => setSteps(prev => [...prev, emptyStep()]);

  const removeStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setName('');
    setCode('');
    setDescription('');
    setSteps([emptyStep()]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const agencyId = localStorage.getItem('agenceId');
    if (!agencyId) {
      showToast('error', 'Erreur', 'ID agence manquant');
      return;
    }

    for (let i = 0; i < steps.length; i++) {
      if (steps[i].destinationId === '') {
        showToast('error', 'Validation', `Étape ${i + 1} : sélectionnez une destination`);
        return;
      }
    }

    const payload = {
      name: name.trim(),
      code: code.trim(),
      description: description.trim(),
      agencyId: parseInt(agencyId),
      destinations: steps.map((s, i): ItineraryStepRequest => ({
        destinationId: s.destinationId as number,
        stepOrder: i + 1,
        isFinal: s.isFinal,
        distanceFromPrevious: s.distanceFromPrevious,
        durationMinutes: s.durationMinutes,
      })),
    };

    try {
      setSubmitting(true);
      await itineraryApi.create(payload);
      showToast('success', 'Succès', 'Itinéraire créé avec succès');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast('error', 'Erreur', error.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nouvel itinéraire</h2>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de la ligne <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: ABIDJAN SAN PEDRO"
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Ex: ABJ-SP"
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Ligne Abidjan San Pedro"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Étapes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Destinations / Étapes <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
                >
                  <Plus size={16} />
                  Ajouter une étape
                </button>
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    {/* Numéro d'étape */}
                    <div className="flex items-center gap-1.5 pt-2">
                      <GripVertical size={16} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-500 w-4">{index + 1}</span>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-2">
                      {/* Destination select */}
                      <div className="col-span-2">
                        <select
                          value={step.destinationId}
                          onChange={e => updateStep(index, 'destinationId', e.target.value ? parseInt(e.target.value) : '')}
                          required
                          disabled={loadingDest}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">{loadingDest ? 'Chargement...' : 'Sélectionner une destination'}</option>
                          {destinations.map(d => (
                            <option key={d.id} value={d.id}>{d.city}</option>
                          ))}
                        </select>
                      </div>

                      {/* Distance */}
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Distance (km)</label>
                        <input
                          type="number"
                          min={0}
                          value={step.distanceFromPrevious}
                          onChange={e => updateStep(index, 'distanceFromPrevious', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      {/* Durée */}
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Durée (min)</label>
                        <input
                          type="number"
                          min={0}
                          value={step.durationMinutes}
                          onChange={e => updateStep(index, 'durationMinutes', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      {/* isFinal */}
                      <div className="col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`final-${index}`}
                          checked={step.isFinal}
                          onChange={e => updateStep(index, 'isFinal', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor={`final-${index}`} className="text-xs text-gray-600 dark:text-gray-400">
                          Destination finale
                        </label>
                      </div>
                    </div>

                    {/* Supprimer */}
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      disabled={steps.length === 1}
                      className="pt-2 text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={handleClose} className="flex-1 btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? 'Création...' : 'Créer l\'itinéraire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraireFormModal;
