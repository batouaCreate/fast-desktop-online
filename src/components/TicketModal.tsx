import React, { useState, useEffect } from 'react';
import { X, User, CreditCard, Loader2, Printer, MapPin } from 'lucide-react';
import { DepartureV2, destinationApi, DestinationV2, reservationApi } from '../services/api';
import { API_CONFIG } from '../config/api.config';
import { useToast } from '../contexts/ToastContext';
import { ThermalPrinter, TicketBuilder } from '../services/printer';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface Seat {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'selected';
  price: number;
}

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  departure: DepartureV2;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, onSuccess, departure }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);
  const [printers, setPrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [isLoadingPrinters, setIsLoadingPrinters] = useState(false);
  const [destinations, setDestinations] = useState<DestinationV2[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
  });
  const [isSelling, setIsSelling] = useState(false);
  const [ticketType, setTicketType] = useState<string>('');
  const { error: showError, success: showSuccess } = useToast();

  // Charger les destinations disponibles
  useEffect(() => {
    const loadDestinations = async () => {
      const agenceId = localStorage.getItem('agenceId');

      if (!agenceId) {
        console.error('Aucun agenceId trouvé dans le localStorage');
        showError('Erreur', 'Impossible de récupérer l\'agence');
        return;
      }

      try {
        setIsLoadingDestinations(true);
        console.log('📍 Chargement des destinations pour agence:', agenceId);
        const data = await destinationApi.getByAgency(parseInt(agenceId));
        console.log('✅ Destinations trouvées:', data);
        setDestinations(data);
      } catch (error) {
        console.error('Erreur lors du chargement des destinations:', error);
        showError('Erreur', 'Impossible de charger les destinations');
      } finally {
        setIsLoadingDestinations(false);
      }
    };

    if (isOpen) {
      loadDestinations();
    }
  }, [isOpen, showError]);

  // Charger les imprimantes disponibles
  useEffect(() => {
    const loadPrinters = async () => {
      try {
        setIsLoadingPrinters(true);
        console.log('🖨️ Chargement des imprimantes...');
        const printerList = await ThermalPrinter.listPrinters();
        console.log('✅ Imprimantes trouvées:', printerList);
        setPrinters(printerList);

        // Sélectionner la première imprimante par défaut si disponible
        if (printerList.length > 0) {
          setSelectedPrinter(printerList[0]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des imprimantes:', error);
        showError('Erreur', 'Impossible de charger les imprimantes');
      } finally {
        setIsLoadingPrinters(false);
      }
    };

    if (isOpen) {
      loadPrinters();
    }
  }, [isOpen, showError]);

  // Construire les sièges depuis departure.seats
  useEffect(() => {
    if (!isOpen) return;

    const rawSeats = departure.seats ?? [];
    const transformedSeats: Seat[] = rawSeats.map(s => ({
      id: `S${s.seatNumber}`,
      number: `S${s.seatNumber}`,
      status: s.status === 'AVAILABLE' ? 'available' : 'occupied',
      price: s.price ?? 0,
    }));

    console.log('💺 Sièges chargés depuis departure.seats:', transformedSeats.length);
    console.log('✅ Occupés:', transformedSeats.filter(s => s.status === 'occupied').length);
    console.log('✅ Disponibles:', transformedSeats.filter(s => s.status === 'available').length);

    setSeats(transformedSeats);
    setIsLoadingSeats(false);
  }, [isOpen, departure.seats]);

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat?.status === 'occupied') return;

    const isSelected = selectedSeats.includes(seatId);

    setSeats(prevSeats =>
      prevSeats.map(s =>
        s.id === seatId
          ? { ...s, status: isSelected ? 'available' as const : 'selected' as const }
          : s
      )
    );

    setSelectedSeats(prev =>
      isSelected ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  // Calculer le prix basé sur la destination sélectionnée et le type de ticket
  const getDestinationPrice = (): number => {
    if (!selectedDestination) return 0;
    const destination = destinations.find(d => d.id === selectedDestination);
    if (!destination) return 0;
    const basePrice = Number(destination.price);
    if (ticketType === 'GRATUIT') return 0;
    if (ticketType === 'ALLER_RETOUR') return basePrice * 2 - 500;
    return basePrice;
  };

  const totalPrice = getDestinationPrice() * selectedSeats.length;

  // Gérer le changement de destination
  const handleDestinationChange = (destId: string) => {
    const id = parseInt(destId);
    setSelectedDestination(id || null);
  };

  const handleSellTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDestination || selectedSeats.length === 0) {
      showError('Erreur', 'Veuillez sélectionner une destination et un siège');
      return;
    }

    if (!selectedPrinter) {
      showError('Erreur', 'Veuillez sélectionner une imprimante');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      showError('Erreur', 'Session expirée, veuillez vous reconnecter');
      return;
    }

    try {
      setIsSelling(true);

      const seatNumbers = selectedSeats.map(s => s.replace('S', ''));
      const paymentReference = crypto.randomUUID();

      const sellPayload = {
        destinationId: selectedDestination,
        userId: parseInt(userId),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        seatNumbers,
        paymentReference,
        type: ticketType || undefined,
      };

      const sellUrl = `${API_CONFIG.baseUrl}/reservations/guichet/${departure.id}`;
      console.log('🎫 === VENTE TICKET ===');
      console.log('📡 URL:', sellUrl);
      console.log('📦 Payload:', JSON.stringify(sellPayload, null, 2));

      const responseData = await reservationApi.sellGuichet(departure.id, sellPayload);

      showSuccess('Succès', 'Ticket vendu avec succès');

      if (selectedPrinter) {
        await printTicket(responseData);
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la vente du ticket:', error);
      showError('Erreur', error.message || 'Impossible de vendre le ticket');
    } finally {
      setIsSelling(false);
    }
  };

  // Fonction pour formater les nombres avec des espaces simples (compatible imprimante thermique)
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const printTicket = async (responseData: any) => {
    try {
      console.log('🖨️ === DÉBUT IMPRESSION ===');

      const destObj = destinations.find(d => d.id === selectedDestination);
      const seatNum = selectedSeats[0]?.replace('S', '') ?? 'N/A';
      const priceStr = `${formatNumber(getDestinationPrice())} FCFA`;
      const logoUrl: string | undefined = responseData?.etp_img ?? undefined;

      const ticket = TicketBuilder.createTransportTicket({
        ticketNumber: responseData?.id?.toString() ?? responseData?.tick_id?.toString() ?? 'N/A',
        departure: departure.name ?? 'N/A',
        date: departure.date ?? 'N/A',
        time: departure.time ?? 'N/A',
        departureStation: departure.agency?.name ?? 'N/A',
        destination: destObj?.city ?? 'N/A',
        seatNumber: seatNum,
        carNumber: departure.carNumber ?? undefined,
        price: priceStr,
        passenger: customerInfo.name || undefined,
        isGratuit: false,
      });

      ticket.customer_name = customerInfo.name || undefined;
      ticket.customer_phone = customerInfo.phone || undefined;

      let cleanLogo: string | undefined = undefined;
      if (logoUrl) {
        try {
          if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
            cleanLogo = await ThermalPrinter.urlToBase64(logoUrl);
          } else if (logoUrl.includes(',')) {
            cleanLogo = logoUrl.split(',')[1];
          } else {
            cleanLogo = logoUrl;
          }
        } catch {
          showError('Attention', 'Impossible de télécharger le logo, impression sans logo');
        }
      }

      await ThermalPrinter.printStubAndTicket(selectedPrinter, ticket, cleanLogo);
      console.log('✅ Impression terminée avec succès');
    } catch (error) {
      console.error('❌ Erreur impression:', error);
      showError('Attention', 'Le ticket a été créé mais l\'impression a échoué');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Vente de Ticket</h2>
            <p className="text-primary-100">
              {departure.itinerary?.name ?? departure.name} - Départ: {departure.time} - {departure.carNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plan des places */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sélectionnez la place
              </h3>

              {/* Légende */}
              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">Sélectionné</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">Occupé</span>
                </div>
              </div>

              {/* Schéma du car */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                {isLoadingSeats ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-primary-500" size={40} />
                  </div>
                ) : (
                  <>
                    {/* Sièges - 3 colonnes à gauche, 2 colonnes à droite */}
                    <div className="space-y-3">
                      {Array.from({ length: Math.ceil(departure.totalSeats / 5) }, (_, i) => i + 1).map(row => {
                        // Calculer les numéros de sièges pour cette rangée
                        const leftSeats = [1, 2, 3].map(col => (row - 1) * 5 + col);
                        const rightSeats = [4, 5].map(col => (row - 1) * 5 + col);

                        return (
                          <div key={row} className="flex gap-3 justify-center">
                            {/* Côté gauche (3 colonnes) */}
                            {leftSeats.map(seatNum => {
                              if (seatNum > departure.totalSeats) return null; // Ne pas afficher au-delà de dep_place
                              const seatNumber = `S${seatNum}`;
                              const seat = seats.find(s => s.number === seatNumber);
                              const seatStatus = seat?.status || 'available';

                              return (
                                <button
                                  key={seatNumber}
                                  onClick={() => handleSeatClick(seatNumber)}
                                  disabled={seatStatus === 'occupied'}
                                  className={`w-12 h-12 rounded-lg font-medium text-sm transition-all ${
                                    seatStatus === 'available'
                                      ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                      : seatStatus === 'selected'
                                      ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                      : 'bg-red-500 dark:bg-red-600 text-white cursor-not-allowed'
                                  }`}
                                >
                                  {seatNum}
                                </button>
                              );
                            })}

                            {/* Allée */}
                            <div className="w-8"></div>

                            {/* Côté droit (2 colonnes) */}
                            {rightSeats.map(seatNum => {
                              if (seatNum > departure.totalSeats) return null; // Ne pas afficher au-delà de dep_place
                              const seatNumber = `S${seatNum}`;
                              const seat = seats.find(s => s.number === seatNumber);
                              const seatStatus = seat?.status || 'available';

                              return (
                                <button
                                  key={seatNumber}
                                  onClick={() => handleSeatClick(seatNumber)}
                                  disabled={seatStatus === 'occupied'}
                                  className={`w-12 h-12 rounded-lg font-medium text-sm transition-all ${
                                    seatStatus === 'available'
                                      ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                      : seatStatus === 'selected'
                                      ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                      : 'bg-red-500 dark:bg-red-600 text-white cursor-not-allowed'
                                  }`}
                                >
                                  {seatNum}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Formulaire client */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informations du client
              </h3>

              <form onSubmit={handleSellTicket} className="space-y-4">
                {/* Sélection de l'imprimante */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imprimante
                  </label>
                  <div className="relative">
                    <Printer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={selectedPrinter}
                      onChange={(e) => setSelectedPrinter(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white appearance-none"
                      disabled={isLoadingPrinters}
                      required
                    >
                      {isLoadingPrinters ? (
                        <option value="">Chargement des imprimantes...</option>
                      ) : printers.length === 0 ? (
                        <option value="">Aucune imprimante trouvée</option>
                      ) : (
                        <>
                          <option value="">Sélectionner une imprimante</option>
                          {printers.map((printer, index) => (
                            <option key={index} value={printer}>
                              {printer}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                  {isLoadingPrinters && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Recherche des imprimantes...
                    </p>
                  )}
                </div>

                {/* Sélection de la destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={selectedDestination || ''}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white appearance-none"
                      disabled={isLoadingDestinations}
                      required
                    >
                      {isLoadingDestinations ? (
                        <option value="">Chargement des destinations...</option>
                      ) : destinations.length === 0 ? (
                        <option value="">Aucune destination trouvée</option>
                      ) : (
                        <>
                          <option value="">Sélectionner une destination</option>
                          {destinations.map((dest) => (
                            <option key={dest.id} value={dest.id}>
                              {dest.city} - {Number(dest.price).toLocaleString()} FCFA
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                  {selectedDestination && (
                    <p className="text-sm text-primary-600 dark:text-primary-400 mt-1 font-medium">
                      Prix unitaire: {getDestinationPrice().toLocaleString()} FCFA
                    </p>
                  )}
                </div>

                {/* Type de ticket */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type de ticket
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setTicketType(ticketType === 'GRATUIT' ? '' : 'GRATUIT')}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                        ticketType === 'GRATUIT'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-green-400'
                      }`}
                    >
                      Ticket gratuit
                    </button>
                    <button
                      type="button"
                      onClick={() => setTicketType(ticketType === 'ALLER_RETOUR' ? '' : 'ALLER_RETOUR')}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                        ticketType === 'ALLER_RETOUR'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                      }`}
                    >
                      Aller retour
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet <span className="text-gray-400 text-xs">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Kouassi Jean"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone voyageur <span className="text-gray-400 text-xs">(optionnel)</span>
                  </label>
                  <PhoneInput
                    defaultCountry="ci"
                    value={customerInfo.phone}
                    onChange={(phone) => setCustomerInfo({ ...customerInfo, phone })}
                    inputClassName="w-full"
                    className="phone-input-custom"
                  />
                </div>

                {/* Résumé */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      Sièges sélectionnés ({selectedSeats.length}):
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-right max-w-[60%] break-words">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Aucun'}
                    </span>
                  </div>
                  {selectedSeats.length > 1 && selectedDestination && (
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{selectedSeats.length} × {getDestinationPrice().toLocaleString()} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-primary-200 dark:border-primary-700">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      {totalPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSelling || selectedSeats.length === 0}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSelling ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Vendre le ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
