import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, Loader2, RefreshCw, Edit, X, DollarSign, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TicketModal from '../components/TicketModal';
import DepartureFormModal from '../components/DepartureFormModal';
import { departureApi, DepartureV2 } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useMercure } from '../hooks/useMercure';
import { NOTIFICATIONS_TOPIC } from '../services/mercure';

const Departs: React.FC = () => {
  // Initialiser les dates: aujourd'hui (J+0) jusqu'à dans 7 jours (J+7)
  const getTodayStart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getSevenDaysLater = () => {
    const sevenDays = new Date();
    sevenDays.setDate(sevenDays.getDate() + 7);
    sevenDays.setHours(23, 59, 59, 999);
    return sevenDays;
  };

  const [selectedDepartureId, setSelectedDepartureId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [departs, setDeparts] = useState<DepartureV2[]>([]);
  const selectedDeparture = departs.find(d => d.id === selectedDepartureId) ?? null;
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(getTodayStart());
  const [endDate, setEndDate] = useState<Date | null>(getSevenDaysLater());
  const { user } = useAuth();
  const { error: showError, showToast } = useToast();

  useMercure<{
    type?: string;
    title: string;
    message?: string;
    body?: string;
    action?: string;
    seat?: string;
    departure?: { id: number; name: string; date: string; [key: string]: unknown };
    destination?: unknown;
  }>(
    [NOTIFICATIONS_TOPIC],
    (data) => {
      const VALID_TYPES = ['success', 'error', 'warning', 'info'] as const;
      type ToastType = typeof VALID_TYPES[number];
      const type: ToastType = VALID_TYPES.includes(data.type as ToastType) ? data.type as ToastType : 'info';
      let notifMessage = "";
      if (data.action === "SELL_AGENCE" && data.departure) { notifMessage = `Un client vient d'acheter le siège ${data.seat} du départ ${data.departure.name} du ${data.departure.date}`; }
      if (data.action === "RESERVED_ONLINE" && data.departure) { notifMessage = `Un client vient de réserver en ligne le siège ${data.seat} du départ ${data.departure.name} du ${data.departure.date}`; }
      if (data.action === "BUY_ONLINE" && data.departure) { notifMessage = `Un client vient de payer en ligne le siège ${data.seat} du départ ${data.departure.name} du ${data.departure.date}`; }

      if (data.departure) {
        const exists = departs.some((d) => d.id === data.departure!.id);
        if (!exists) return;

        if (data.seat) {
          setDeparts((prev) =>
            prev.map((d) => {
              if (d.id !== data.departure!.id) return d;
              return {
                ...d,
                seats: d.seats?.map((s) =>
                  s.seatNumber === data.seat ? { ...s, status: 'OCCUPIED' as const } : s
                ),
              };
            })
          );
        }
      }

      showToast(type, data.title, notifMessage, 8000);

      try {
        const ctx = new AudioContext();
        const notes = [523, 659, 784]; // Do Mi Sol
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.value = freq;
          const start = ctx.currentTime + i * 0.15;
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
          osc.start(start);
          osc.stop(start + 0.3);
        });
      } catch { /* navigateur sans Web Audio */ }
    },
  );

  // États pour le modal de modification
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDeparture, setEditingDeparture] = useState<DepartureV2 | null>(null);
  const [editForm, setEditForm] = useState({
    place: 0,
    car: '',
    chauff: '',
    conv: '',
  });
  const [updating, setUpdating] = useState(false);

  // États pour le modal de frais
  const [showFraisModal, setShowFraisModal] = useState(false);
  const [editingFraisDeparture, setEditingFraisDeparture] = useState<DepartureV2 | null>(null);
  const [fraisForm, setFraisForm] = useState({
    fraisroute: 0,
    lavage: 0,
    carbur: 0,
    droitgare: 0,
    autredep: 0,
  });
  const [updatingFrais, setUpdatingFrais] = useState(false);

  const formatDate = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    return date.toISOString().slice(0, 10);
  };

  const loadDeparts = async () => {
    const agencyId = localStorage.getItem('agenceId');
    if (!agencyId) return;

    try {
      setIsLoading(true);
      const data = await departureApi.getByAgency(parseInt(agencyId), formatDate(startDate), formatDate(endDate));
      setDeparts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des départs:', error);
      showError('Erreur', 'Impossible de charger les départs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeparts();
  }, [user, startDate, endDate]);

  const handleVendreTicket = (depart: DepartureV2) => {
    setSelectedDepartureId(depart.id);
    setIsModalOpen(true);
  };

  // Fonction pour ouvrir le modal de modification
  const handleEditClick = (departure: DepartureV2) => {
    setEditingDeparture(departure);
    setEditForm({
      place: departure.totalSeats ?? 0,
      car: departure.carNumber ?? '',
      chauff: departure.driver ?? '',
      conv: departure.convoyeur ?? '',
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
        depid: editingDeparture.id,
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
  const handleFraisClick = (departure: DepartureV2) => {
    setEditingFraisDeparture(departure);
    setFraisForm({
      fraisroute: departure.roadFees ?? 0,
      lavage: departure.washingFees ?? 0,
      carbur: departure.fuelFees ?? 0,
      droitgare: departure.stationFees ?? 0,
      autredep: departure.otherFees ?? 0,
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
        depid: editingFraisDeparture.id,
        user: parseInt(user.id),
        place: editingFraisDeparture.totalSeats ?? 0,
        car: editingFraisDeparture.carNumber ?? '',
        chauff: editingFraisDeparture.driver ?? '',
        conv: editingFraisDeparture.convoyeur ?? '',
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Départs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isLoading ? 'Chargement...' : `${departs.length} départ(s) disponible(s)`}
        </p>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de début
            </label>
            <div className="relative">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Sélectionner la date de début"
                className="input w-full pl-10"
                wrapperClassName="w-full"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Date de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de fin
            </label>
            <div className="relative">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Sélectionner la date de fin"
                className="input w-full pl-10"
                wrapperClassName="w-full"
                minDate={startDate || undefined}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Bouton Actualiser */}
          <div className="flex items-end">
            <button
              onClick={loadDeparts}
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Actualisation...' : 'Actualiser'}
            </button>
          </div>

          {/* Bouton Nouveau départ */}
          <div className="flex items-end">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary w-full"
            >
              Nouveau départ
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
        </div>
      ) : departs.length === 0 ? (
        <div className="card text-center py-12">
          <Bus size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun départ disponible
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Aucun départ n'est configuré pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departs.map((depart) => (
            <div key={depart.id} className="card hover:shadow-soft-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                    <Bus size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{depart.name ?? '—'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Car: {depart.carNumber ?? '—'}</p>
                  </div>
                </div>
                {(() => {
                  const sold = depart.seats?.filter(s => s.status !== 'AVAILABLE').length ?? 0;
                  return (
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      sold > 0
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {sold}/{depart.totalSeats ?? '—'}
                    </span>
                  );
                })()}
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">{depart.agency?.name ?? '—'} →</span>
                    <div className="flex flex-wrap gap-1">
                      {depart.itinerary?.destinations?.map((d, i) => (
                        <span key={i} className="inline-block px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                          {d.destination?.city ?? '—'}
                        </span>
                      )) ?? <span className="text-sm text-gray-400">—</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{depart.date ?? '—'}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mx-2">•</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{depart.time ?? '—'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Chauffeur</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{depart.driver ?? '—'}</span>
                </div>

                {(() => {
                  const total = depart.seats?.filter(s => s.status !== 'AVAILABLE').reduce((sum, s) => sum + (s.price ?? 0), 0) ?? 0;
                  return total > 0 ? (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total tickets</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {total.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                {/* Boutons de modification et frais */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleEditClick(depart)}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit size={14} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleFraisClick(depart)}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <DollarSign size={14} />
                    Frais
                  </button>
                </div>

                {/* Section Bordereaux */}
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bordereaux</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-300 text-white cursor-not-allowed"
                    title="Fonctionnalité à venir"
                  >
                    Billet
                  </button>
                  <button
                    disabled
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-orange-300 text-white cursor-not-allowed"
                    title="Fonctionnalité à venir"
                  >
                    Colis
                  </button>
                  <button
                    disabled
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-purple-300 text-white cursor-not-allowed"
                    title="Fonctionnalité à venir"
                  >
                    Bagage
                  </button>
                </div>

                <button
                  onClick={() => handleVendreTicket(depart)}
                  className="w-full btn-primary"
                >
                  Vendre Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de vente de ticket */}
      {selectedDeparture && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadDeparts}
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
                  {editingDeparture.destination?.city ?? '—'}
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
                  {editingFraisDeparture.destination?.city ?? '—'}
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
