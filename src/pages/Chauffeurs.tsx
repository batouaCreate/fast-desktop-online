import React, { useState } from 'react';
import { User, Phone, Calendar, IdCard, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

interface Chauffeur {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  numeroPermis: string;
  dateEmbauche: string;
  statut: 'actif' | 'inactif' | 'en_conge';
}

const Chauffeurs: React.FC = () => {
  const toast = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chauffeurToDelete, setChauffeurToDelete] = useState<Chauffeur | null>(null);
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([
    {
      id: '1',
      nom: 'Kouassi',
      prenom: 'Jean',
      telephone: '+225 07 12 34 56 78',
      email: 'jean.kouassi@fast.ci',
      numeroPermis: 'CI-2020-123456',
      dateEmbauche: '2020-05-15',
      statut: 'actif'
    },
    {
      id: '2',
      nom: 'Traoré',
      prenom: 'Mamadou',
      telephone: '+225 05 98 76 54 32',
      email: 'mamadou.traore@fast.ci',
      numeroPermis: 'CI-2019-987654',
      dateEmbauche: '2019-03-10',
      statut: 'actif'
    },
    {
      id: '3',
      nom: 'Bamba',
      prenom: 'Amara',
      telephone: '+225 07 45 67 89 01',
      email: 'amara.bamba@fast.ci',
      numeroPermis: 'CI-2021-456789',
      dateEmbauche: '2021-07-20',
      statut: 'en_conge'
    },
    {
      id: '4',
      nom: 'Koné',
      prenom: 'Issouf',
      telephone: '+225 05 23 45 67 89',
      email: 'issouf.kone@fast.ci',
      numeroPermis: 'CI-2018-111222',
      dateEmbauche: '2018-11-05',
      statut: 'actif'
    }
  ]);

  const getStatutBadgeClass = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'en_conge':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'inactif':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'Actif';
      case 'en_conge':
        return 'En congé';
      case 'inactif':
        return 'Inactif';
      default:
        return statut;
    }
  };

  const handleDeleteClick = (chauffeur: Chauffeur) => {
    setChauffeurToDelete(chauffeur);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (chauffeurToDelete) {
      setChauffeurs(chauffeurs.filter(c => c.id !== chauffeurToDelete.id));
      toast.success('Chauffeur supprimé', `${chauffeurToDelete.prenom} ${chauffeurToDelete.nom} a été supprimé avec succès.`);
      setChauffeurToDelete(null);
    }
  };

  const handleEdit = (chauffeur: Chauffeur) => {
    toast.info('Modification', `Modification de ${chauffeur.prenom} ${chauffeur.nom}`);
    // TODO: Ouvrir un modal d'édition
  };

  const handleAdd = () => {
    toast.info('Nouveau chauffeur', 'Ouverture du formulaire de création');
    // TODO: Ouvrir un modal de création
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chauffeurs</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion du personnel - Chauffeurs</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nouveau chauffeur
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              <User size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chauffeurs.filter(c => c.statut === 'actif').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chauffeurs.filter(c => c.statut === 'en_conge').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">En congé</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <User size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{chauffeurs.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des chauffeurs */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Chauffeur</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Permis</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date d'embauche</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chauffeurs.map((chauffeur) => (
                <tr key={chauffeur.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                        {chauffeur.prenom.charAt(0)}{chauffeur.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {chauffeur.prenom} {chauffeur.nom}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{chauffeur.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{chauffeur.telephone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <IdCard size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{chauffeur.numeroPermis}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {new Date(chauffeur.dateEmbauche).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatutBadgeClass(chauffeur.statut)}`}>
                      {getStatutLabel(chauffeur.statut)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(chauffeur)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(chauffeur)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setChauffeurToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le chauffeur"
        message={`Êtes-vous sûr de vouloir supprimer ${chauffeurToDelete?.prenom} ${chauffeurToDelete?.nom}? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default Chauffeurs;
