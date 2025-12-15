# Intégration de l'API d'authentification

## Résumé des modifications

L'API d'authentification de `https://guichet.createsarl.com/api/signin` a été intégrée avec succès dans l'application Tauri.

## Fichiers créés

1. **src/services/api.ts** - Service pour gérer les appels API
   - Implémente la fonction `login()` qui communique avec l'API
   - Gestion des erreurs et des réponses
   - Utilise le plugin HTTP de Tauri
   - Vérifie le status de la réponse (doit être 200)

2. **src/config/api.config.ts** - Configuration de l'API
   - URL de base de l'API
   - Points de terminaison (endpoints)
   - Timeout configuré à 30 secondes

## Fichiers modifiés

1. **src/contexts/AuthContext.tsx**
   - Remplacement de l'authentification mock par l'API réelle
   - Stockage des informations utilisateur et agence dans le localStorage
   - Gestion des erreurs avec messages appropriés

2. **src/pages/Login.tsx**
   - Formulaire modifié pour utiliser un numéro de téléphone au lieu d'email
   - Ajout d'un indicateur de chargement pendant la connexion
   - Affichage des messages d'erreur via le système Toast
   - Message de succès après connexion

3. **src-tauri/capabilities/default.json**
   - Configuration des permissions Tauri (les permissions HTTP sont gérées automatiquement par le plugin)

4. **src-tauri/src/lib.rs**
   - Ajout du plugin HTTP de Tauri

5. **src-tauri/Cargo.toml**
   - Ajout de la dépendance `tauri-plugin-http = "2"`

6. **package.json**
   - Ajout de `@tauri-apps/plugin-http`

## Paramètres de l'API

L'API attend les paramètres suivants au format JSON:
```json
{
  "phone": "49570603",
  "pass": "012345"
}
```

## Réponse de l'API

L'application reçoit une réponse au format:
```json
{
  "status": 200,
  "nom": "Batoua",
  "agnom": "BONGOUANOU",
  "usid": 12,
  "agid": 13,
  "msg": "Connexion réussie"
}
```

### Détails de la réponse:
- **status**: Code de statut (200 = succès)
- **nom**: Nom de l'utilisateur
- **agnom**: Nom de l'agence
- **usid**: ID de l'utilisateur
- **agid**: ID de l'agence
- **msg**: Message de réponse

## Comment tester

1. Installer les dépendances:
   ```bash
   npm install
   ```

2. Lancer l'application en mode développement:
   ```bash
   npm run tauri dev
   ```

3. Essayer de se connecter avec un numéro de téléphone et mot de passe valides

Exemple:
- **Téléphone**: 49570603
- **Mot de passe**: 012345

## Notes importantes

- Les informations utilisateur sont stockées dans le localStorage
- Les informations d'agence (agnom, agid) sont stockées séparément
- La session persiste même après fermeture de l'application
- Les erreurs d'authentification sont affichées via le système Toast
- Un indicateur de chargement est affiché pendant la connexion
- Le formulaire utilise un champ téléphone au lieu d'email

## Configuration

Pour modifier l'URL de l'API, éditez le fichier `src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: 'https://guichet.createsarl.com',
  endpoints: {
    login: '/api/signin',
  },
  timeout: 30000,
};
```

## Test avec cURL

Vous pouvez tester l'API directement avec:

```bash
curl --request POST \
  --url https://guichet.createsarl.com/api/signin \
  --header 'content-type: application/json' \
  --data '{
  "phone": "49570603",
  "pass": "012345"
}'
```
