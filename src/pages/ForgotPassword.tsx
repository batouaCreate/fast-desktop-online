import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi d'email ici
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-soft-lg mb-4">
              <Car className="text-primary-500" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Fast</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-soft-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email envoyé!</h2>
            <p className="text-gray-600 mb-6">
              Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
              Veuillez vérifier votre boîte de réception.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-primary"
            >
              Retour à la connexion
            </button>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full mt-3 text-primary-500 hover:text-primary-600 font-medium"
            >
              Renvoyer l'email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-soft-lg mb-4">
            <Car className="text-primary-500" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Fast</h1>
          <p className="text-primary-100">Réinitialiser votre mot de passe</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-soft-lg p-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié?</h2>
          <p className="text-gray-600 mb-6">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fast.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary">
              Envoyer le lien de réinitialisation
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous vous souvenez de votre mot de passe?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-primary-100 text-sm mt-6">
          © 2025 Fast. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
