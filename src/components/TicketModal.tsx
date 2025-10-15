import React, { useState } from 'react';
import { X, User, Phone, Mail, CreditCard } from 'lucide-react';

interface Seat {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'selected';
  price: number;
}

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  departure: {
    destination: string;
    heure: string;
    car: string;
    quai: string;
  };
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, departure }) => {
  // Initialiser les sièges du car (40 places)
  const initializeSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const rows = 10; // 10 rangées
    const seatsPerRow = 4; // 4 sièges par rangée
    const occupiedSeats = ['A3', 'B5', 'C2', 'D7', 'A8', 'B1']; // Sièges déjà occupés

    for (let row = 1; row <= rows; row++) {
      ['A', 'B', 'C', 'D'].forEach((letter, index) => {
        const seatNumber = `${letter}${row}`;
        seats.push({
          id: seatNumber,
          number: seatNumber,
          status: occupiedSeats.includes(seatNumber) ? 'occupied' : 'available',
          price: 5000, // Prix en FCFA
        });
      });
    }
    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(initializeSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat?.status === 'occupied') return;

    setSeats(prevSeats =>
      prevSeats.map(s =>
        s.id === seatId
          ? { ...s, status: s.status === 'selected' ? 'available' : 'selected' }
          : s
      )
    );

    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const totalPrice = selectedSeats.length * 5000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Ticket(s) vendu(s) avec succès!\nPlaces: ${selectedSeats.join(', ')}\nTotal: ${totalPrice.toLocaleString()} FCFA`);
    onClose();
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
              {departure.destination} - Départ: {departure.heure} - {departure.car}
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
                Sélectionnez les places
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
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">Occupé</span>
                </div>
              </div>

              {/* Schéma du car */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                {/* Conducteur */}
                <div className="flex justify-end mb-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    🚗
                  </div>
                </div>

                {/* Sièges */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(row => (
                    <div key={row} className="flex gap-3 justify-center">
                      {/* Côté gauche (A, B) */}
                      {['A', 'B'].map(letter => {
                        const seat = seats.find(s => s.number === `${letter}${row}`);
                        return (
                          <button
                            key={`${letter}${row}`}
                            onClick={() => handleSeatClick(`${letter}${row}`)}
                            disabled={seat?.status === 'occupied'}
                            className={`w-12 h-12 rounded-lg font-medium text-sm transition-all ${
                              seat?.status === 'available'
                                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                : seat?.status === 'selected'
                                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                : 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                            }`}
                          >
                            {`${letter}${row}`}
                          </button>
                        );
                      })}

                      {/* Allée */}
                      <div className="w-8"></div>

                      {/* Côté droit (C, D) */}
                      {['C', 'D'].map(letter => {
                        const seat = seats.find(s => s.number === `${letter}${row}`);
                        return (
                          <button
                            key={`${letter}${row}`}
                            onClick={() => handleSeatClick(`${letter}${row}`)}
                            disabled={seat?.status === 'occupied'}
                            className={`w-12 h-12 rounded-lg font-medium text-sm transition-all ${
                              seat?.status === 'available'
                                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                : seat?.status === 'selected'
                                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                : 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                            }`}
                          >
                            {`${letter}${row}`}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulaire client */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informations du client
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Kouassi Jean"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="+225 07 12 34 56 78"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (optionnel)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="kouassi@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Résumé */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Places sélectionnées:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Aucune'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Prix unitaire:</span>
                    <span className="font-medium text-gray-900 dark:text-white">5,000 FCFA</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-primary-200 dark:border-primary-700">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      {totalPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Méthode de paiement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Méthode de paiement
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white">
                    <option>Espèces</option>
                    <option>Orange Money</option>
                    <option>MTN Money</option>
                    <option>Moov Money</option>
                    <option>Wave</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={selectedSeats.length === 0}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    Vendre {selectedSeats.length > 0 && `(${selectedSeats.length})`}
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
