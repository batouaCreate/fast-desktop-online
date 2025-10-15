import React, { useState } from 'react';
import { UserCheck, Phone, Mail, Calendar, IdCard, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

interface Convoyeur {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  numeroCarte: string;
  dateEmbauche: string;
  statut: 'actif' | 'inactif' | 'en_conge';
}

const Convoyeurs: React.FC = () => {
  const toast = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [convoyeurToDelete, setConvoyeurToDelete] = useState<Convoyeur | null>(null);
  const [convoyeurs, setConvoyeurs] = useState<Convoyeur[]>([
    {
      id: '1',
      nom: 'Diallo',
      prenom: 'Ibrahim',
      telephone: '+225 07 11 22 33 44',
      email: 'ibrahim.diallo@fast.ci',
      numeroCarte: 'CNV-2021-001',
      dateEmbauche: '2021-02-10',
      statut: 'actif'
    },
    {
      id: '2',
      nom: 'Yao',
      prenom: 'Marie',
      telephone: '+225 05 55 66 77 88',
      email: 'marie.yao@fast.ci',
      numeroCarte: 'CNV-2020-045',
      dateEmbauche: '2020-08-22',
      statut: 'actif'
    },
    {
      id: '3',
      nom: 'Ouattara',
      prenom: 'Abdoulaye',
      telephone: '+225 07 99 88 77 66',
      email: 'abdoulaye.ouattara@fast.ci',
      numeroCarte: 'CNV-2022-012',
      dateEmbauche: '2022-01-15',
      statut: 'actif'
    },
    {
      id: '4',
      nom: 'N\'Guessan',
      prenom: 'Aya',
      telephone: '+225 05 44 33 22 11',
      email: 'aya.nguessan@fast.ci',
      numeroCarte: 'CNV-2021-067',
      dateEmbauche: '2021-09-30',
      statut: 'en_conge'
    },
    {
      id: '5',
      nom: 'Cissé',
      prenom: 'Moussa',
      telephone: '+225 07 88 77 66 55',
      email: 'moussa.cisse@fast.ci',
      numeroCarte: 'CNV-2019-089',
      dateEmbauche: '2019-12-01',
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

  const handleDeleteClick = (convoyeur: Convoyeur) => {
    setConvoyeurToDelete(convoyeur);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (convoyeurToDelete) {
      setConvoyeurs(convoyeurs.filter(c => c.id !== convoyeurToDelete.id));
      toast.success('Convoyeur supprimé', `${convoyeurToDelete.prenom} ${convoyeurToDelete.nom} a été supprimé avec succès.`);
      setConvoyeurToDelete(null);
    }
  };

  const handleEdit = (convoyeur: Convoyeur) => {
    toast.info('Modification', `Modification de ${convoyeur.prenom} ${convoyeur.nom}`);
    // TODO: Ouvrir un modal d'édition
  };

  const handleAdd = () => {
    toast.info('Nouveau convoyeur', 'Ouverture du formulaire de création');
    // TODO: Ouvrir un modal de création
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Convoyeurs</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion du personnel - Convoyeurs</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nouveau convoyeur
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {convoyeurs.filter(c => c.statut === 'actif').length}
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
                {convoyeurs.filter(c => c.statut === 'en_conge').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">En congé</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{convoyeurs.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des convoyeurs */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Convoyeur</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">N° Carte</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date d'embauche</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {convoyeurs.map((convoyeur) => (
                <tr key={convoyeur.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {convoyeur.prenom.charAt(0)}{convoyeur.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {convoyeur.prenom} {convoyeur.nom}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{convoyeur.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{convoyeur.telephone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <IdCard size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{convoyeur.numeroCarte}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {new Date(convoyeur.dateEmbauche).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatutBadgeClass(convoyeur.statut)}`}>
                      {getStatutLabel(convoyeur.statut)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(convoyeur)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(convoyeur)}
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
          setConvoyeurToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le convoyeur"
        message={`Êtes-vous sûr de vouloir supprimer ${convoyeurToDelete?.prenom} ${convoyeurToDelete?.nom}? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default Convoyeurs;
