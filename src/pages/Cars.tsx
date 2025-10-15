import React, { useState, useMemo } from 'react';
import { Bus, Plus, Edit, Trash2, Users, Palette, FileText } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import SearchInput from '../components/SearchInput';
import FilterDropdown, { FilterOption } from '../components/FilterDropdown';

interface Car {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  couleur: string;
  nombrePlaces: number;
  annee: number;
  description: string;
  statut: 'disponible' | 'en_service' | 'en_maintenance' | 'hors_service';
}

const Cars: React.FC = () => {
  const toast = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cars, setCars] = useState<Car[]>([
    {
      id: '1',
      immatriculation: 'CI-5678-AB',
      marque: 'Mercedes-Benz',
      modele: 'Sprinter 516',
      couleur: 'Blanc',
      nombrePlaces: 40,
      annee: 2022,
      description: 'Car de luxe climatisé avec sièges confortables',
      statut: 'disponible'
    },
    {
      id: '2',
      immatriculation: 'CI-1234-CD',
      marque: 'Iveco',
      modele: 'Daily Minibus',
      couleur: 'Bleu',
      nombrePlaces: 40,
      annee: 2021,
      description: 'Car standard avec climatisation',
      statut: 'en_service'
    },
    {
      id: '3',
      immatriculation: 'CI-9876-EF',
      marque: 'Renault',
      modele: 'Master Bus',
      couleur: 'Rouge',
      nombrePlaces: 40,
      annee: 2023,
      description: 'Car moderne avec GPS et système audio',
      statut: 'disponible'
    },
    {
      id: '4',
      immatriculation: 'CI-4321-GH',
      marque: 'Toyota',
      modele: 'Coaster',
      couleur: 'Blanc',
      nombrePlaces: 40,
      annee: 2020,
      description: 'Car robuste pour longues distances',
      statut: 'en_maintenance'
    },
    {
      id: '5',
      immatriculation: 'CI-8765-IJ',
      marque: 'Fuso',
      modele: 'Rosa',
      couleur: 'Jaune',
      nombrePlaces: 40,
      annee: 2022,
      description: 'Car économique climatisé',
      statut: 'disponible'
    }
  ]);

  const getStatutBadgeClass = (statut: string) => {
    switch (statut) {
      case 'disponible':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'en_service':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'en_maintenance':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'hors_service':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'disponible':
        return 'Disponible';
      case 'en_service':
        return 'En service';
      case 'en_maintenance':
        return 'En maintenance';
      case 'hors_service':
        return 'Hors service';
      default:
        return statut;
    }
  };

  const handleDeleteClick = (car: Car) => {
    setCarToDelete(car);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (carToDelete) {
      setCars(cars.filter(c => c.id !== carToDelete.id));
      toast.success('Car supprimé', `Le car ${carToDelete.immatriculation} a été supprimé avec succès.`);
      setCarToDelete(null);
    }
  };

  const handleEdit = (car: Car) => {
    toast.info('Modification', `Modification du car ${car.immatriculation}`);
    // TODO: Ouvrir un modal d'édition
  };

  const handleAdd = () => {
    toast.info('Nouveau car', 'Ouverture du formulaire de création');
    // TODO: Ouvrir un modal de création
  };

  const statusOptions: FilterOption[] = [
    { label: 'Tous les statuts', value: 'all' },
    { label: 'Disponible', value: 'disponible' },
    { label: 'En service', value: 'en_service' },
    { label: 'En maintenance', value: 'en_maintenance' },
    { label: 'Hors service', value: 'hors_service' },
  ];

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = searchQuery === '' ||
        car.immatriculation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.modele.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || car.statut === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [cars, searchQuery, statusFilter]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cars</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion de la flotte de véhicules</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nouveau car
        </button>
      </div>

      {/* Recherche et filtres */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher par immatriculation, marque ou modèle..."
          />
        </div>
        <FilterDropdown
          label="Statut"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              <Bus size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {cars.filter(c => c.statut === 'disponible').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Disponibles</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <Bus size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {cars.filter(c => c.statut === 'en_service').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">En service</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
              <Bus size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {cars.filter(c => c.statut === 'en_maintenance').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">En maintenance</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
              <Bus size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{cars.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {(searchQuery || statusFilter !== 'all') && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {filteredCars.length} résultat{filteredCars.length > 1 ? 's' : ''} trouvé{filteredCars.length > 1 ? 's' : ''}
        </div>
      )}

      {/* Liste des cars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCars.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <Bus className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun car trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche ou de filtre.'
                : 'Commencez par ajouter un nouveau car.'}
            </p>
          </div>
        ) : (
          filteredCars.map((car) => (
          <div key={car.id} className="card hover:shadow-soft-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                  <Bus size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {car.marque} {car.modele}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {car.immatriculation}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatutBadgeClass(car.statut)}`}>
                {getStatutLabel(car.statut)}
              </span>
            </div>

            {/* Informations */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Palette size={16} />
                  <span>Couleur:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{car.couleur}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users size={16} />
                  <span>Places:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{car.nombrePlaces}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FileText size={16} />
                  <span>Année:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{car.annee}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">{car.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => handleEdit(car)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteClick(car)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCarToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le car"
        message={`Êtes-vous sûr de vouloir supprimer le car ${carToDelete?.immatriculation} (${carToDelete?.marque} ${carToDelete?.modele})? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default Cars;
