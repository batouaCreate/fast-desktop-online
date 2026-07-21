import { fetch as tauriFetch } from '@tauri-apps/plugin-http';
import { API_CONFIG } from '../config/api.config';

const GUICHET_BASE_URL = 'https://guichet-dev.createsarl.com/api';

export interface Company {
  id: number;
  code: string;
  sender: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  createdDate: string;
}

export interface Agence {
  id: number;
  code: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  prefix: string;
  status: string;
  createdDate: string;
  company: Company;
}

export interface Authority {
  authority: string;
}

export interface User {
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  agence: Agence;
  authorities: Authority[];
  bcryptPassword: string;
  code: string;
  connected: boolean;
  createDate: string;
  credentialsNonExpired: boolean;
  deviceToken: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  id: number;
  login: string;
  nom: string;
  password: string;
  phone: string;
  phoneNumberVerified: boolean;
  photo: string;
  printerId: number;
  role: string;
  status: string;
  username: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
  user: User;
  roles: string[];
}

export const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 60 minutes

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  if (!token) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

function logRequest(url: string, payload: unknown) {
  console.log('📤 API Request:', { url, payload });
}

// Wrapper autour de tauriFetch : dispatch un event global si 401 reçu
// (ignoré pour les routes /auth/ qui gèrent leurs erreurs elles-mêmes)
async function apiFetch(url: string, options: object): Promise<any> {
  const response = await tauriFetch(url, options as any);
  if (response.status === 401 && !url.includes('/auth/')) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
  return response;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface Departure {
  dep_id: number;
  dep_ligne: string | null;
  dep_user: number;
  dep_numcar: string;
  dep_nom: string;
  dep_dest: string;
  dep_place: number;
  dep_chauff: string;
  dep_conv: string;
  dep_date: string;
  dep_heure: string;
  dep_fraisroute: number;
  dep_lavage: number;
  dep_carbur: number;
  dep_droitgare: number;
  dep_autredep: number;
  dep_create: string;
  ag_id: number;
  ag_etp: number;
  ag_code: string;
  ag_nom: string;
  ag_phone: string;
  ag_pays: string;
  ag_ville: string;
  ag_devise: string;
  ag_prefix: string;
  ag_stat: string;
  ag_create: string;
  us_id: number;
  us_agence: number;
  us_type: string;
  us_code: string;
  us_nom: string;
  us_email: string;
  us_phone: string;
  us_pass: string;
  us_stat: string;
  us_photo: string;
  us_device: string;
  us_printer: number;
  us_create: string;
  dateDep: string;
  sumtick: number | null;
  agdest: string;
  nbtick: number;
}

export interface DepartureSeat {
  seatNumber: string;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED';
  ticketId?: number;
  passengerName?: string;
  passengerPhone?: string;
  price?: number;
  destinationId?: number;
}

export interface DepartureItineraryDestination {
  id: string;
  stepOrder: number;
  isFinal: boolean;
  distanceFromPrevious: number;
  durationMinutes: number;
  destination: {
    id: number;
    city: string;
    price?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface DepartureItinerary {
  id: string;
  name: string;
  code?: string;
  description?: string;
  active?: boolean;
  destinations: DepartureItineraryDestination[];
  [key: string]: any;
}

export interface DepartureV2 {
  id: number;
  name: string;
  carNumber: string;
  totalSeats: number;
  driver: string;
  convoyeur?: string;
  date: string;
  time: string;
  roadFees?: number;
  washingFees?: number;
  fuelFees?: number;
  stationFees?: number;
  otherFees?: number;
  agency?: { id?: number; name?: string; city?: string; currency?: string; [key: string]: any };
  itinerary?: DepartureItinerary;
  seats?: DepartureSeat[];
  [key: string]: any;
}

export interface LoadAllDepResponse {
  status: number;
  data: Departure[];
  msg: string;
}

export interface Colis {
  dep_id: number;
  dep_ligne: string | null;
  dep_user: number;
  dep_numcar: string;
  dep_nom: string;
  dep_dest: string;
  dep_place: number;
  dep_chauff: string;
  dep_conv: string;
  dep_date: string;
  dep_heure: string;
  dep_fraisroute: number;
  dep_lavage: number;
  dep_carbur: number;
  dep_droitgare: number;
  dep_autredep: number;
  dep_create: string;
  exp_id: number;
  exp_user: number;
  exp_type: string;
  exp_depart: string;
  exp_bord: string | null;
  exp_numcar: string;
  exp_colnat: string;
  exp_colval: string;
  exp_frais: string;
  exp_stat: number;
  exp_coldesc: string;
  exp_code: string;
  exp_exp: string;
  exp_phonexp: string;
  exp_dest: string;
  exp_destphone: string;
  exp_agdest: string;
  exp_siege: string | null;
  exp_img: string | null;
  exp_imgret: string | null;
  exp_destdevice: string;
  exp_create: string;
  etp_id: number;
  etp_code: string;
  etp_sender: string;
  etp_nom: string;
  etp_mail: string;
  etp_phone: string;
  etp_pays: string;
  etp_msgbagage: string;
  etp_msgcolis: string;
  etp_pass: string;
  etp_stat: string;
  etp_create: string;
  depDate: string;
  agexp: string;
  agdest: string;
}

export interface ColisByUserResponse {
  status: number;
  data: Colis[];
  msg: string;
}

// Bagage a la même structure que Colis
export type Bagage = Colis;

export interface BagageByUserResponse {
  status: number;
  data: Bagage[];
  msg: string;
}

export interface Ticket {
  tick_id: number;
  tick_vtick: number;
  tick_user: number;
  tick_depart: number;
  tick_price: string;
  tick_reduc: number;
  tick_dest: number;
  tick_nom: string;
  tick_phone: string | null;
  tick_siege: string;
  tick_create: string;
  tick_type: string;
  ag_id: number;
  ag_etp: number;
  ag_code: string | null;
  ag_nom: string;
  ag_phone: string;
  ag_pays: string;
  ag_ville: string;
  ag_devise: string;
  ag_prefix: string;
  ag_stat: string | null;
  ag_create: string;
  dep_id: number;
  dep_ligne: string | null;
  dep_user: number;
  dep_numcar: string;
  dep_nom: string;
  dep_dest: string;
  dep_place: number;
  dep_chauff: string;
  dep_conv: string;
  dep_date: string;
  dep_heure: string;
  dep_fraisroute: number;
  dep_lavage: number;
  dep_carbur: number;
  dep_droitgare: number;
  dep_autredep: number;
  dep_create: string;
  etp_id: number;
  etp_code: string;
  etp_sender: string;
  etp_nom: string;
  etp_mail: string;
  etp_phone: string;
  etp_pays: string;
  etp_msgbagage: string;
  etp_msgcolis: string;
  etp_pass: string;
  etp_stat: string;
  etp_create: string;
  etp_img?: string;
  dest_id: number;
  dest_user: number;
  dest_agence: number;
  dest_ville: string;
  dest_price: string;
  dest_create: string;
  depDate: string;
}

export interface TicketByUserResponse {
  status: number;
  data: Ticket[];
  msg: string;
}

export interface Gare {
  ag_id: number;
  ag_etp: number;
  ag_code: string;
  ag_nom: string;
  ag_phone: string;
  ag_pays: string;
  ag_ville: string;
  ag_devise: string;
  ag_prefix: string;
  ag_stat: string;
  ag_create: string;
}

export interface LoadGareDestResponse {
  status: number;
  data: Gare[];
  msg: string;
}

export interface Destination {
  dest_id: number;
  dest_user: number;
  dest_agence: number;
  dest_ville: string;
  dest_price: string;
  dest_create: string;
}

export interface DestinationV2 {
  id: number;
  agencyId: number;
  city: string;
  price: number;
  createdDate?: string;
  [key: string]: any;
}

export interface LoadDestResponse {
  status: number;
  data: Destination[];
  msg: string;
}

export interface AddDestinationRequest {
  userId: number;
  agency: { value: string };
  city: string;
  price: string;
}

export interface UpdateDestinationRequest {
  userId: number;
  agency: { value: string };
  city: string;
  price: number;
}

export interface AddDestinationResponse {
  id?: number;
  city?: string;
  [key: string]: any;
}

export interface CreateDepartureRequest {
  carNumber: string;
  departUser: number;
  name: string;
  totalsSeats: number;
  driverName: string;
  convoyeurName: string;
  date: string;
  time: string;
  roadFees: number;
  washingFees: number;
  fuelFees: number;
  stationFees: number;
  otherFees: number;
  agencyId: number;
  itineraryId: string;
}

export type CreateDepartureResponse = DepartureV2;

export interface UpdateDepartureRequest {
  depid: number;
  user: number;
  place: number;
  car: string;
  chauff: string;
  conv: string;
  fraisroute: number;
  lavage: number;
  carbur: number;
  droitgare: number;
  autredep: number;
}

export interface UpdateDepartureResponse {
  status: number;
  msg: string;
}

export interface CreateColisRequest {
  user: number;
  depart: number;
  nature: string;
  frais: number;
  desc: string;
  valeur: number;
  exp: string;
  phonexp: string;
  benef: string;
  phonedest: string;
  agdest: number;
}

export interface CreateColisResponse {
  status: number;
  msg: string;
}

export interface CreateBagageRequest {
  user: number;
  depart: number;
  nature: string;
  frais: number;
  desc: string;
  valeur: number;
  exp: string;
  phonexp: string;
  siege: number;
  dest: number;
}

export interface CreateBagageResponse {
  status: number;
  msg: string;
}

export interface SellBilletRequest {
  user: number;
  depart: number;
  dest: number;
  siege: number;
  phone: string;
  voyageur: string;
  price: number;
  method: string;
  reduction: number;
  nature: 'GRATUIT' | 'PAYANT';
}

export interface SellBilletData {
  tick_id?: number;
  tick_vtick?: number;
  tick_user?: number;
  tick_depart?: number;
  tick_price?: string;
  tick_reduc?: number;
  tick_dest?: number;
  tick_nom?: string;
  tick_phone?: string;
  tick_siege?: string;
  tick_nature?: string;
  tick_method?: string;
  tick_create?: string;
  tick_type?: string;
  etp_img?: string;
  etp_nom?: string;
  etp_id?: number;
  [key: string]: any;
}

export interface SellBilletResponse {
  status: number;
  data: SellBilletData[]; // C'est un tableau, pas un objet direct
  msg: string;
}

export const authApi = {
  async login(login: string, password: string): Promise<LoginResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`;
      const payload = { login, password };
      logRequest(url, payload);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse HTTP:', { status: response.status, ok: response.ok, statusText: response.statusText });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw {
          message: errBody?.detail || `Erreur de connexion: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('📦 Données reçues:', data);

      if (!data.accessToken) {
        throw {
          message: data.detail || data.msg || 'Erreur de connexion',
          status: response.status,
        } as ApiError;
      }

      console.log('✅ Connexion réussie!');
      return data as LoginResponse;
    } catch (error: any) {
      console.error('❌ Erreur API complète:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async refresh(storedRefreshToken: string): Promise<LoginResponse> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.refreshToken}?refreshToken=${encodeURIComponent(storedRefreshToken)}`;
    console.log('🔄 Rafraîchissement du token:', url);
    try {
      const response = await tauriFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log('📦 Réponse refresh:', data);

      if (!response.ok || !data.accessToken) {
        throw {
          message: data?.detail || 'Échec du rafraîchissement du token',
          status: response.status,
        } as ApiError;
      }

      return data as LoginResponse;
    } catch (error: any) {
      console.error('❌ Erreur refresh token:', error);
      throw {
        message: error.message || 'Erreur de rafraîchissement',
        status: error.status,
      } as ApiError;
    }
  },
};

export const departureApi = {
  async loadAllDepartures(userId: number): Promise<LoadAllDepResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.loadAllDepartures}`;
      const payload = { user: userId };
      logRequest(url, payload);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse HTTP départs:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de chargement des départs: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('📦 Départs reçus:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de chargement des départs',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Départs chargés avec succès:', data.msg);
      return data as LoadAllDepResponse;
    } catch (error: any) {
      console.error('❌ Erreur API départs:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async createDeparture(request: CreateDepartureRequest): Promise<CreateDepartureResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.departures}`;
      logRequest(url, request);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP création départ:', { status: response.status, ok: response.ok });

      const data = await response.json();
      console.log('📦 Réponse création départ:', data);

      if (!response.ok) {
        throw {
          message: data?.detail || data?.msg || `Erreur de création du départ: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      console.log('✅ Départ créé avec succès:', data.id);
      return data as CreateDepartureResponse;
    } catch (error: any) {
      console.error('❌ Erreur API création départ:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async updateDeparture(request: UpdateDepartureRequest): Promise<UpdateDepartureResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.updateDepart}`;
      logRequest(url, request);

      const response = await apiFetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP mise à jour départ:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de mise à jour du départ: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('📦 Réponse mise à jour départ:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de mise à jour du départ',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Départ mis à jour avec succès:', data.msg);
      return data as UpdateDepartureResponse;
    } catch (error: any) {
      console.error('❌ Erreur API mise à jour départ:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async getByAgency(agencyId: number): Promise<DepartureV2[]> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.departures}?agencyId=${agencyId}`;
    logRequest(url, { agencyId });

    try {
      const response = await apiFetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      console.log('📡 Réponse HTTP départs:', { status: response.status, ok: response.ok });

      const data = await response.json();
      console.log('🚌 Départs reçus:', data);

      if (!response.ok) {
        throw {
          message: data?.detail || `Erreur de chargement des départs: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      return (Array.isArray(data) ? data : data.data ?? []) as DepartureV2[];
    } catch (error: any) {
      console.error('❌ Erreur API départs:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export const colisApi = {
  async colisByUser(userId: number, search: string = '', date: string): Promise<ColisByUserResponse> {
    try {
      const url = `${GUICHET_BASE_URL}${API_CONFIG.endpoints.colisByUser}`;
      const payload = { user: userId, search, date };
      logRequest(url, payload);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse HTTP colis:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de chargement des colis: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('📦 Colis reçus:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de chargement des colis',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Colis chargés avec succès:', data.msg);
      return data as ColisByUserResponse;
    } catch (error: any) {
      console.error('❌ Erreur API colis:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async createColis(request: CreateColisRequest): Promise<CreateColisResponse> {
    try {
      const url = `${GUICHET_BASE_URL}${API_CONFIG.endpoints.createColis}`;
      logRequest(url, request);
      console.log('📦 [createColis] Payload complet:', JSON.stringify(request, null, 2));

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP création colis:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de création du colis: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('📦 [createColis] Retour complet:', JSON.stringify(data, null, 2));

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de création du colis',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Colis créé avec succès:', data.msg);
      return data as CreateColisResponse;
    } catch (error: any) {
      console.error('❌ Erreur API création colis:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export const bagageApi = {
  async bagageByUser(userId: number, search: string = '', date: string): Promise<BagageByUserResponse> {
    try {
      const url = `${GUICHET_BASE_URL}${API_CONFIG.endpoints.bagageByUser}`;
      const payload = { user: userId, search, date };
      logRequest(url, payload);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse HTTP bagages:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de chargement des bagages: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('🎒 Bagages reçus:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de chargement des bagages',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Bagages chargés avec succès:', data.msg);
      return data as BagageByUserResponse;
    } catch (error: any) {
      console.error('❌ Erreur API bagages:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async createBagage(request: CreateBagageRequest): Promise<CreateBagageResponse> {
    try {
      const url = `${GUICHET_BASE_URL}${API_CONFIG.endpoints.createBagage}`;
      logRequest(url, request);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP création bagage:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de création du bagage: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('🎒 Réponse création bagage:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de création du bagage',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Bagage créé avec succès:', data.msg);
      return data as CreateBagageResponse;
    } catch (error: any) {
      console.error('❌ Erreur API création bagage:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export const ticketApi = {
  async ticketByUser(userId: number, search: string = '', date: string): Promise<TicketByUserResponse> {
    try {
      const url = `${GUICHET_BASE_URL}${API_CONFIG.endpoints.ticketByUser}`;
      const payload = { user: userId, search, date };
      logRequest(url, payload);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse HTTP billets:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de chargement des billets: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('🎫 Billets reçus:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de chargement des billets',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Billets chargés avec succès:', data.msg);
      return data as TicketByUserResponse;
    } catch (error: any) {
      console.error('❌ Erreur API billets:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async sellBillet(request: SellBilletRequest): Promise<SellBilletResponse> {
    try {
      const url = `${GUICHET_BASE_URL}${API_CONFIG.endpoints.sellBillet}`;
      logRequest(url, request);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP vente billet:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de vente du billet: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('🎫 Réponse vente billet:', data);
      console.log('🎫 data.data:', data.data);
      console.log('🎫 data.data est un tableau?', Array.isArray(data.data));

      // L'API retourne data comme un tableau
      const firstItem = Array.isArray(data.data) ? data.data[0] : data.data;
      console.log('🎫 Premier élément:', firstItem);
      console.log('🖼️ etp_img présent?', firstItem?.etp_img ? 'OUI' : 'NON');
      if (firstItem?.etp_img) {
        console.log('🖼️ etp_img:', firstItem.etp_img);
      }

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de vente du billet',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Billet vendu avec succès:', data.msg);
      return data as SellBilletResponse;
    } catch (error: any) {
      console.error('❌ Erreur API vente billet:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export const gareApi = {
  async loadGareDest(userId: number): Promise<LoadGareDestResponse> {
    try {
      const url = `${GUICHET_BASE_URL}${API_CONFIG.endpoints.loadGareDest}`;
      const payload = { user: userId };
      logRequest(url, payload);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse HTTP gares:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de chargement des gares: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('🏢 Gares reçues:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de chargement des gares',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Gares chargées avec succès:', data.msg);
      return data as LoadGareDestResponse;
    } catch (error: any) {
      console.error('❌ Erreur API gares:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export const destinationApi = {
  async loadDest(agenceId: number): Promise<LoadDestResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.loadDest}`;
      const payload = { agid: agenceId };
      logRequest(url, payload);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse HTTP destinations:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de chargement des destinations: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('📍 Destinations reçues:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de chargement des destinations',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Destinations chargées avec succès:', data.msg);
      return data as LoadDestResponse;
    } catch (error: any) {
      console.error('❌ Erreur API destinations:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async addDestination(request: AddDestinationRequest): Promise<AddDestinationResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.destinations}`;
      logRequest(url, request);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP ajout destination:', { status: response.status, ok: response.ok });

      const data = await response.json().catch(() => ({}));
      console.log('📍 Réponse ajout destination:', data);

      if (!response.ok) {
        throw {
          message: data?.detail || data?.msg || `Erreur d'ajout de la destination: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      console.log('✅ Destination ajoutée avec succès');
      return data as AddDestinationResponse;
    } catch (error: any) {
      console.error('❌ Erreur API ajout destination:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async updateDestination(id: number, request: UpdateDestinationRequest): Promise<any> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.destinations}/${id}`;
    logRequest(url, request);

    try {
      const response = await apiFetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP mise à jour destination:', { status: response.status, ok: response.ok });

      const data = await response.json().catch(() => ({}));
      console.log('📍 Réponse mise à jour destination:', data);

      if (!response.ok) {
        throw {
          message: data?.detail || data?.msg || `Erreur de mise à jour de la destination: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      console.log('✅ Destination mise à jour avec succès');
      return data;
    } catch (error: any) {
      console.error('❌ Erreur API mise à jour destination:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async getByAgency(agencyId: number): Promise<DestinationV2[]> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.destinations}?agencyId=${agencyId}`;
    logRequest(url, { agencyId });

    try {
      const response = await apiFetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      console.log('📡 Réponse HTTP destinations:', { status: response.status, ok: response.ok });

      const data = await response.json();
      console.log('📍 Destinations reçues:', data);

      if (!response.ok) {
        throw {
          message: data?.detail || `Erreur de chargement des destinations: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      return (Array.isArray(data) ? data : data.data ?? []) as DestinationV2[];
    } catch (error: any) {
      console.error('❌ Erreur API destinations:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export interface ItineraryDestination {
  id?: number;
  city?: string;
  destination?: {
    city: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Itinerary {
  id: number;
  name: string;
  agencyId: number;
  agencyName: string;
  destinations: ItineraryDestination[];
  [key: string]: any;
}

export interface ItineraryStepRequest {
  destinationId: number;
  stepOrder: number;
  isFinal: boolean;
  distanceFromPrevious: number;
  durationMinutes: number;
}

export interface CreateItineraryRequest {
  name: string;
  code: string;
  description: string;
  agencyId: number;
  destinations: ItineraryStepRequest[];
}

export const itineraryApi = {
  async getByAgency(agencyId: number): Promise<Itinerary[]> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.itineraries}/${agencyId}`;
    logRequest(url, { agencyId });

    try {
      const response = await apiFetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      console.log('📡 Réponse HTTP itinéraires:', { status: response.status, ok: response.ok });

      const data = await response.json();
      console.log('🗺️ Itinéraires reçus:', data);

      if (!response.ok) {
        throw {
          message: data?.detail || `Erreur de chargement des itinéraires: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      return (Array.isArray(data) ? data : data.data ?? []) as Itinerary[];
    } catch (error: any) {
      console.error('❌ Erreur API itinéraires:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },

  async create(request: CreateItineraryRequest): Promise<void> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.itineraries}`;
    logRequest(url, request);

    try {
      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP création itinéraire:', { status: response.status, ok: response.ok });

      const data = await response.json().catch(() => ({}));
      console.log('🗺️ Réponse création itinéraire:', data);

      if (!response.ok) {
        throw {
          message: data?.detail || data?.msg || `Erreur de création: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }
    } catch (error: any) {
      console.error('❌ Erreur API création itinéraire:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export interface Siege {
  siege: string;
  stat: number;
  price: string;
}

export interface DisplaySiegeResponse {
  status: number;
  data: Siege[];
  msg: string;
}

export interface SellGuichetRequest {
  destinationId: number;
  userId: number;
  customerName: string;
  customerPhone: string;
  seatNumbers: string[];
  paymentReference: string;
}

export const reservationApi = {
  async sellGuichet(departureId: number, request: SellGuichetRequest): Promise<any> {
    const url = `${API_CONFIG.baseUrl}/reservations/guichet/${departureId}`;
    logRequest(url, request);

    try {
      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP vente billet:', { status: response.status, ok: response.ok });

      const data = await response.json().catch(() => ({}));
      console.log('🎫 Réponse vente billet:', data);

      if (!response.ok) {
        throw {
          message: data?.detail || data?.msg || `Erreur de vente du billet: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      console.log('✅ Billet vendu avec succès');
      return data;
    } catch (error: any) {
      console.error('❌ Erreur API vente billet:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export const siegeApi = {
  async displaySiege(departId: number): Promise<DisplaySiegeResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.displaySiege}`;
      const payload = { depart: departId };
      logRequest(url, payload);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log('📡 Réponse HTTP sièges:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de chargement des sièges: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('💺 Sièges reçus:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.msg || 'Erreur de chargement des sièges',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Sièges chargés avec succès:', data.msg);
      return data as DisplaySiegeResponse;
    } catch (error: any) {
      console.error('❌ Erreur API sièges:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};

export interface StatTicket {
  totaltick: number;
  nbtick: number;
  dest_id: number;
  dest_user: number;
  dest_agence: number;
  dest_ville: string;
  dest_price: string;
  dest_create: string;
}

export interface DashboardData {
  cptcolis: number;
  caisse: number;
  cptbag: number;
  colcais: number | null;
  bagcais: number | null;
  statcolis: any[];
  statticket: StatTicket[];
  statbagage: any[];
  nbtick: number;
  totaltick: number;
}

export interface DashboardResponse {
  status: number;
  message: string;
  data: DashboardData;
}

export interface DashboardRequest {
  debut: string;
  fin: string;
  user: number;
}

export const dashboardApi = {
  async getDashboard(request: DashboardRequest): Promise<DashboardResponse> {
    try {
      const url = 'https://guichet-dev.createsarl.com/api/dashboard';
      logRequest(url, request);

      const response = await apiFetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Réponse HTTP dashboard:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw {
          message: `Erreur de chargement du dashboard: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      console.log('📊 Dashboard reçu:', data);

      // Vérifier si la réponse contient un statut d'erreur
      if (data.status !== 200) {
        throw {
          message: data.message || 'Erreur de chargement du dashboard',
          status: data.status,
        } as ApiError;
      }

      console.log('✅ Dashboard chargé avec succès:', data.message);
      return data as DashboardResponse;
    } catch (error: any) {
      console.error('❌ Erreur API dashboard:', error);
      throw {
        message: error.message || 'Erreur de connexion au serveur',
        status: error.status,
      } as ApiError;
    }
  },
};
