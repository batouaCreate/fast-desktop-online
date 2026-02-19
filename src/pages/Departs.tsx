import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, Loader2, RefreshCw, Edit, X, DollarSign } from 'lucide-react';
import TicketModal from '../components/TicketModal';
import DepartureFormModal from '../components/DepartureFormModal';
import { departureApi, Departure } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Departs: React.FC = () => {
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [departs, setDeparts] = useState<Departure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { error: showError, showToast } = useToast();

  // États pour le modal de modification
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDeparture, setEditingDeparture] = useState<Departure | null>(null);
  const [editForm, setEditForm] = useState({
    place: 0,
    car: '',
    chauff: '',
    conv: '',
  });
  const [updating, setUpdating] = useState(false);

  // États pour le modal de frais
  const [showFraisModal, setShowFraisModal] = useState(false);
  const [editingFraisDeparture, setEditingFraisDeparture] = useState<Departure | null>(null);
  const [fraisForm, setFraisForm] = useState({
    fraisroute: 0,
    lavage: 0,
    carbur: 0,
    droitgare: 0,
    autredep: 0,
  });
  const [updatingFrais, setUpdatingFrais] = useState(false);

  const loadDeparts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await departureApi.loadAllDepartures(parseInt(user.id));
      setDeparts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des départs:', error);
      showError('Erreur', 'Impossible de charger les départs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeparts();
  }, [user]);

  const handleVendreTicket = (depart: Departure) => {
    setSelectedDeparture(depart);
    setIsModalOpen(true);
  };

  // Fonction pour ouvrir le modal de modification
  const handleEditClick = (departure: Departure) => {
    setEditingDeparture(departure);
    setEditForm({
      place: departure.dep_place,
      car: departure.dep_numcar,
      chauff: departure.dep_chauff,
      conv: departure.dep_conv,
    });
    setShowEditModal(true);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingDeparture(null);
    setEditForm({
      place: 0,
      car: '',
      chauff: '',
      conv: '',
    });
  };

  // Fonction pour mettre à jour le départ
  const handleUpdateDeparture = async () => {
    if (!editingDeparture) return;

    try {
      setUpdating(true);
      if (!user) {
        showToast('error', 'Utilisateur non identifié');
        return;
      }

      await departureApi.updateDeparture({
        depid: editingDeparture.dep_id,
        user: parseInt(user.id),
        place: editForm.place,
        car: editForm.car,
        chauff: editForm.chauff,
        conv: editForm.conv,
        fraisroute: 0,
        lavage: 0,
        carbur: 0,
        droitgare: 0,
        autredep: 0,
      });

      // Fermer le modal avant d'afficher le toast
      handleCloseModal();
      showToast('success', 'Départ mis à jour avec succès');
      // Recharger la liste des départs
      await loadDeparts();
    } catch (error: any) {
      showToast('error', error.message || 'Erreur de mise à jour du départ');
    } finally {
      setUpdating(false);
    }
  };

  // Fonction pour ouvrir le modal de frais
  const handleFraisClick = (departure: Departure) => {
    setEditingFraisDeparture(departure);
    setFraisForm({
      fraisroute: departure.dep_fraisroute || 0,
      lavage: departure.dep_lavage || 0,
      carbur: departure.dep_carbur || 0,
      droitgare: departure.dep_droitgare || 0,
      autredep: departure.dep_autredep || 0,
    });
    setShowFraisModal(true);
  };

  // Fonction pour fermer le modal de frais
  const handleCloseFraisModal = () => {
    setShowFraisModal(false);
    setEditingFraisDeparture(null);
    setFraisForm({
      fraisroute: 0,
      lavage: 0,
      carbur: 0,
      droitgare: 0,
      autredep: 0,
    });
  };

  // Fonction pour mettre à jour les frais du départ
  const handleUpdateFrais = async () => {
    if (!editingFraisDeparture) return;

    try {
      setUpdatingFrais(true);
      if (!user) {
        showToast('error', 'Utilisateur non identifié');
        return;
      }

      await departureApi.updateDeparture({
        depid: editingFraisDeparture.dep_id,
        user: parseInt(user.id),
        place: editingFraisDeparture.dep_place,
        car: editingFraisDeparture.dep_numcar,
        chauff: editingFraisDeparture.dep_chauff,
        conv: editingFraisDeparture.dep_conv,
        fraisroute: fraisForm.fraisroute,
        lavage: fraisForm.lavage,
        carbur: fraisForm.carbur,
        droitgare: fraisForm.droitgare,
        autredep: fraisForm.autredep,
      });

      // Fermer le modal avant d'afficher le toast
      handleCloseFraisModal();
      showToast('success', 'Frais mis à jour avec succès');
      // Recharger la liste des départs
      await loadDeparts();
    } catch (error: any) {
      showToast('error', error.message || 'Erreur de mise à jour des frais');
    } finally {
      setUpdatingFrais(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Départs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? 'Chargement...' : `${departs.length} départ(s) disponible(s)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadDeparts}
            disabled={isLoading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
          >
            Nouveau départ
          </button>
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
        ) : departs.length === 0 ? (
          <div className="text-center py-12">
            <Bus size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucun départ disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Car</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Nom</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Destination</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Heure</th>
                  {/* <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Places</th> */}
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Tickets</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Chauffeur</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departs.map((depart) => (
                  <tr key={depart.dep_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Bus size={18} className="text-primary-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{depart.dep_numcar}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{depart.dep_nom}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{depart.agdest}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{depart.dateDep}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{depart.dep_heure}</span>
                      </div>
                    </td>
                    {/* <td className="py-4 px-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold">
                        {depart.dep_place}
                      </span>
                    </td> */}
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        depart.nbtick > 0
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {depart.nbtick} / {depart.dep_place}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-white">{depart.dep_chauff}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(depart)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          title="Modifier"
                        >
                          <Edit size={16} />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleFraisClick(depart)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          title="Frais"
                        >
                          <DollarSign size={16} />
                          Frais
                        </button>
                        <button
                          onClick={() => handleVendreTicket(depart)}
                          className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Vendre Ticket
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de vente de ticket */}
      {selectedDeparture && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          departure={selectedDeparture}
        />
      )}

      {/* Modal de création de départ */}
      <DepartureFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadDeparts}
      />

      {/* Modal de modification */}
      {showEditModal && editingDeparture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Modifier le départ</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-6 space-y-4">
              {/* Information sur la destination (lecture seule) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination
                </label>
                <div className="input bg-gray-100 dark:bg-gray-700 cursor-not-allowed">
                  {editingDeparture.agdest}
                </div>
              </div>

              {/* Nombre de places */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de places
                </label>
                <input
                  type="number"
                  value={editForm.place}
                  onChange={(e) => setEditForm({ ...editForm, place: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                  min="1"
                />
              </div>

              {/* Numéro de car */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numéro de car
                </label>
                <input
                  type="text"
                  value={editForm.car}
                  onChange={(e) => setEditForm({ ...editForm, car: e.target.value })}
                  className="input w-full"
                  placeholder="Ex: BX001"
                />
              </div>

              {/* Chauffeur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chauffeur
                </label>
                <input
                  type="text"
                  value={editForm.chauff}
                  onChange={(e) => setEditForm({ ...editForm, chauff: e.target.value })}
                  className="input w-full"
                  placeholder="Nom du chauffeur"
                />
              </div>

              {/* Convoyeur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Convoyeur
                </label>
                <input
                  type="text"
                  value={editForm.conv}
                  onChange={(e) => setEditForm({ ...editForm, conv: e.target.value })}
                  className="input w-full"
                  placeholder="Nom du convoyeur"
                />
              </div>
            </div>

            {/* Footer du modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={updating}
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateDeparture}
                disabled={updating}
                className="flex-1 btn-primary"
              >
                {updating ? 'Mise à jour...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de frais */}
      {showFraisModal && editingFraisDeparture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gérer les frais</h2>
              <button
                onClick={handleCloseFraisModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-6 space-y-4">
              {/* Information sur la destination (lecture seule) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination
                </label>
                <div className="input bg-gray-100 dark:bg-gray-700 cursor-not-allowed">
                  {editingFraisDeparture.agdest}
                </div>
              </div>

              {/* Frais de route */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frais de route
                </label>
                <input
                  type="number"
                  value={fraisForm.fraisroute}
                  onChange={(e) => setFraisForm({ ...fraisForm, fraisroute: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                  min="0"
                  placeholder="0"
                />
              </div>

              {/* Frais de lavage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frais de lavage
                </label>
                <input
                  type="number"
                  value={fraisForm.lavage}
                  onChange={(e) => setFraisForm({ ...fraisForm, lavage: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                  min="0"
                  placeholder="0"
                />
              </div>

              {/* Frais de carburant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frais de carburant
                </label>
                <input
                  type="number"
                  value={fraisForm.carbur}
                  onChange={(e) => setFraisForm({ ...fraisForm, carbur: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                  min="0"
                  placeholder="0"
                />
              </div>

              {/* Droit de gare */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Droit de gare
                </label>
                <input
                  type="number"
                  value={fraisForm.droitgare}
                  onChange={(e) => setFraisForm({ ...fraisForm, droitgare: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                  min="0"
                  placeholder="0"
                />
              </div>

              {/* Autres dépenses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Autres dépenses
                </label>
                <input
                  type="number"
                  value={fraisForm.autredep}
                  onChange={(e) => setFraisForm({ ...fraisForm, autredep: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Footer du modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCloseFraisModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={updatingFrais}
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateFrais}
                disabled={updatingFrais}
                className="flex-1 btn-primary"
              >
                {updatingFrais ? 'Mise à jour...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departs;
