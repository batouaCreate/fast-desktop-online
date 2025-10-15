// Localités de Côte d'Ivoire organisées par district et région

export interface Destination {
  nom: string;
  code: string;
  district: string;
  region: string;
  type: 'ville' | 'commune' | 'village';
}

export const destinations: Destination[] = [
  // DISTRICT AUTONOME D'ABIDJAN
  { nom: 'Abidjan', code: 'ABJ', district: 'Abidjan', region: 'Abidjan', type: 'ville' },
  { nom: 'Abobo', code: 'ABO', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Adjamé', code: 'ADJ', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Attécoubé', code: 'ATT', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Cocody', code: 'COC', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Koumassi', code: 'KOU', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Marcory', code: 'MAR', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Plateau', code: 'PLA', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Port-Bouët', code: 'PBT', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Treichville', code: 'TRE', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Yopougon', code: 'YOP', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Bingerville', code: 'BIN', district: 'Abidjan', region: 'Abidjan', type: 'ville' },
  { nom: 'Songon', code: 'SON', district: 'Abidjan', region: 'Abidjan', type: 'commune' },
  { nom: 'Anyama', code: 'ANY', district: 'Abidjan', region: 'Abidjan', type: 'ville' },

  // DISTRICT AUTONOME DE YAMOUSSOUKRO
  { nom: 'Yamoussoukro', code: 'YMS', district: 'Yamoussoukro', region: 'Yamoussoukro', type: 'ville' },

  // DISTRICT DES LAGUNES
  // Région d'Agnéby-Tiassa
  { nom: 'Agboville', code: 'AGB', district: 'Lagunes', region: 'Agnéby-Tiassa', type: 'ville' },
  { nom: 'Rubino', code: 'RUB', district: 'Lagunes', region: 'Agnéby-Tiassa', type: 'ville' },
  { nom: 'Azaguié', code: 'AZA', district: 'Lagunes', region: 'Agnéby-Tiassa', type: 'ville' },
  { nom: 'Sikensi', code: 'SIK', district: 'Lagunes', region: 'Agnéby-Tiassa', type: 'ville' },
  { nom: 'Taabo', code: 'TAB', district: 'Lagunes', region: 'Agnéby-Tiassa', type: 'ville' },
  { nom: 'Tiassalé', code: 'TIA', district: 'Lagunes', region: 'Agnéby-Tiassa', type: 'ville' },
  { nom: 'Oress-Krobou', code: 'ORK', district: 'Lagunes', region: 'Agnéby-Tiassa', type: 'village' },

  // Région des Grands-Ponts
  { nom: 'Dabou', code: 'DAB', district: 'Lagunes', region: 'Grands-Ponts', type: 'ville' },
  { nom: 'Jacqueville', code: 'JAC', district: 'Lagunes', region: 'Grands-Ponts', type: 'ville' },
  { nom: 'Grand-Lahou', code: 'GLA', district: 'Lagunes', region: 'Grands-Ponts', type: 'ville' },
  { nom: 'Toupah', code: 'TOU', district: 'Lagunes', region: 'Grands-Ponts', type: 'village' },
  { nom: 'Attoutou', code: 'ATU', district: 'Lagunes', region: 'Grands-Ponts', type: 'village' },

  // Région de la Mé
  { nom: 'Adzopé', code: 'ADZ', district: 'Lagunes', region: 'La Mé', type: 'ville' },
  { nom: 'Akoupé', code: 'AKO', district: 'Lagunes', region: 'La Mé', type: 'ville' },
  { nom: 'Alépé', code: 'ALE', district: 'Lagunes', region: 'La Mé', type: 'ville' },
  { nom: 'Yakassé-Attobrou', code: 'YKA', district: 'Lagunes', region: 'La Mé', type: 'ville' },
  { nom: 'Afféry', code: 'AFF', district: 'Lagunes', region: 'La Mé', type: 'village' },

  // DISTRICT DE LA COMOÉ
  // Région du Bounkani
  { nom: 'Bouna', code: 'BNA', district: 'Comoé', region: 'Bounkani', type: 'ville' },
  { nom: 'Doropo', code: 'DOR', district: 'Comoé', region: 'Bounkani', type: 'ville' },
  { nom: 'Tehini', code: 'TEH', district: 'Comoé', region: 'Bounkani', type: 'ville' },
  { nom: 'Nassian', code: 'NAS', district: 'Comoé', region: 'Bounkani', type: 'village' },

  // Région de l'Indénié-Djuablin
  { nom: 'Abengourou', code: 'ABG', district: 'Comoé', region: 'Indénié-Djuablin', type: 'ville' },
  { nom: 'Agnibilékrou', code: 'AGN', district: 'Comoé', region: 'Indénié-Djuablin', type: 'ville' },
  { nom: 'Bettié', code: 'BET', district: 'Comoé', region: 'Indénié-Djuablin', type: 'ville' },
  { nom: 'Tanda', code: 'TAN', district: 'Comoé', region: 'Indénié-Djuablin', type: 'ville' },
  { nom: 'Zaranou', code: 'ZAR', district: 'Comoé', region: 'Indénié-Djuablin', type: 'ville' },
  { nom: 'Prikro', code: 'PRI', district: 'Comoé', region: 'Indénié-Djuablin', type: 'ville' },

  // DISTRICT DU DENGUÉLÉ
  // Région du Folon
  { nom: 'Minignan', code: 'MIN', district: 'Denguélé', region: 'Folon', type: 'ville' },
  { nom: 'Kaniasso', code: 'KAN', district: 'Denguélé', region: 'Folon', type: 'village' },
  { nom: 'Mahandiana-Sokourani', code: 'MHS', district: 'Denguélé', region: 'Folon', type: 'village' },

  // Région du Kabadougou
  { nom: 'Odienné', code: 'ODI', district: 'Denguélé', region: 'Kabadougou', type: 'ville' },
  { nom: 'Gbéléban', code: 'GBE', district: 'Denguélé', region: 'Kabadougou', type: 'ville' },
  { nom: 'Samatiguila', code: 'SAM', district: 'Denguélé', region: 'Kabadougou', type: 'ville' },
  { nom: 'Madinani', code: 'MAD', district: 'Denguélé', region: 'Kabadougou', type: 'ville' },
  { nom: 'Kimbirila-Nord', code: 'KIM', district: 'Denguélé', region: 'Kabadougou', type: 'village' },

  // DISTRICT DES MONTAGNES
  // Région du Cavally
  { nom: 'Guiglo', code: 'GUI', district: 'Montagnes', region: 'Cavally', type: 'ville' },
  { nom: 'Bloléquin', code: 'BLO', district: 'Montagnes', region: 'Cavally', type: 'ville' },
  { nom: 'Toulé  pleu', code: 'TLE', district: 'Montagnes', region: 'Cavally', type: 'ville' },
  { nom: 'Taï', code: 'TAI', district: 'Montagnes', region: 'Cavally', type: 'ville' },

  // Région du Guémon
  { nom: 'Duékoué', code: 'DUE', district: 'Montagnes', region: 'Guémon', type: 'ville' },
  { nom: 'Bangolo', code: 'BNG', district: 'Montagnes', region: 'Guémon', type: 'ville' },
  { nom: 'Facobly', code: 'FAC', district: 'Montagnes', region: 'Guémon', type: 'ville' },

  // Région du Tonkpi
  { nom: 'Man', code: 'MAN', district: 'Montagnes', region: 'Tonkpi', type: 'ville' },
  { nom: 'Biankouma', code: 'BIA', district: 'Montagnes', region: 'Tonkpi', type: 'ville' },
  { nom: 'Danané', code: 'DAN', district: 'Montagnes', region: 'Tonkpi', type: 'ville' },
  { nom: 'Sipilou', code: 'SIP', district: 'Montagnes', region: 'Tonkpi', type: 'ville' },
  { nom: 'Zouan-Hounien', code: 'ZOU', district: 'Montagnes', region: 'Tonkpi', type: 'ville' },

  // DISTRICT DE LA SASSANDRA-MARAHOUÉ
  // Région du Haut-Sassandra
  { nom: 'Daloa', code: 'DAL', district: 'Sassandra-Marahoué', region: 'Haut-Sassandra', type: 'ville' },
  { nom: 'Issia', code: 'ISS', district: 'Sassandra-Marahoué', region: 'Haut-Sassandra', type: 'ville' },
  { nom: 'Vavoua', code: 'VAV', district: 'Sassandra-Marahoué', region: 'Haut-Sassandra', type: 'ville' },
  { nom: 'Zoukougbeu', code: 'ZKG', district: 'Sassandra-Marahoué', region: 'Haut-Sassandra', type: 'ville' },

  // Région de la Marahoué
  { nom: 'Bouaflé', code: 'BFL', district: 'Sassandra-Marahoué', region: 'Marahoué', type: 'ville' },
  { nom: 'Sinfra', code: 'SIN', district: 'Sassandra-Marahoué', region: 'Marahoué', type: 'ville' },
  { nom: 'Zuénoula', code: 'ZUE', district: 'Sassandra-Marahoué', region: 'Marahoué', type: 'ville' },
  { nom: 'Bonon', code: 'BON', district: 'Sassandra-Marahoué', region: 'Marahoué', type: 'ville' },

  // DISTRICT DU BAS-SASSANDRA
  // Région du Gbôklé
  { nom: 'Sassandra', code: 'SAS', district: 'Bas-Sassandra', region: 'Gbôklé', type: 'ville' },
  { nom: 'Fresco', code: 'FRE', district: 'Bas-Sassandra', region: 'Gbôklé', type: 'ville' },
  { nom: 'Dakpadou', code: 'DAK', district: 'Bas-Sassandra', region: 'Gbôklé', type: 'village' },

  // Région du Nawa
  { nom: 'Soubré', code: 'SOU', district: 'Bas-Sassandra', region: 'Nawa', type: 'ville' },
  { nom: 'Buyo', code: 'BUY', district: 'Bas-Sassandra', region: 'Nawa', type: 'ville' },
  { nom: 'Méagui', code: 'MEA', district: 'Bas-Sassandra', region: 'Nawa', type: 'ville' },
  { nom: 'Grand-Zattry', code: 'GZA', district: 'Bas-Sassandra', region: 'Nawa', type: 'ville' },

  // Région de San-Pédro
  { nom: 'San-Pédro', code: 'SPE', district: 'Bas-Sassandra', region: 'San-Pédro', type: 'ville' },
  { nom: 'Tabou', code: 'TAO', district: 'Bas-Sassandra', region: 'San-Pédro', type: 'ville' },
  { nom: 'Grand-Béréby', code: 'GBR', district: 'Bas-Sassandra', region: 'San-Pédro', type: 'ville' },

  // DISTRICT DU GÔHD DJÂBOUA
  // Région du Gôh
  { nom: 'Gagnoa', code: 'GAG', district: 'Gôh-Djiboua', region: 'Gôh', type: 'ville' },
  { nom: 'Oumé', code: 'OUM', district: 'Gôh-Djiboua', region: 'Gôh', type: 'ville' },
  { nom: 'Bayota', code: 'BAY', district: 'Gôh-Djiboua', region: 'Gôh', type: 'ville' },
  { nom: 'Guibéroua', code: 'GUB', district: 'Gôh-Djiboua', region: 'Gôh', type: 'ville' },

  // Région du Lôh-Djiboua
  { nom: 'Divo', code: 'DIV', district: 'Gôh-Djiboua', region: 'Lôh-Djiboua', type: 'ville' },
  { nom: 'Lakota', code: 'LAK', district: 'Gôh-Djiboua', region: 'Lôh-Djiboua', type: 'ville' },
  { nom: 'Guitry', code: 'GIT', district: 'Gôh-Djiboua', region: 'Lôh-Djiboua', type: 'ville' },

  // DISTRICT DU LACS
  // Région du Bélier
  { nom: 'Toumodi', code: 'TOU', district: 'Lacs', region: 'Bélier', type: 'ville' },
  { nom: 'Didiévi', code: 'DID', district: 'Lacs', region: 'Bélier', type: 'ville' },
  { nom: 'Tiébissou', code: 'TIB', district: 'Lacs', region: 'Bélier', type: 'ville' },

  // Région des Lacs
  { nom: 'Dimbokro', code: 'DMB', district: 'Lacs', region: 'Lacs', type: 'ville' },
  { nom: 'Bongouanou', code: 'BOU', district: 'Lacs', region: 'Lacs', type: 'ville' },
  { nom: 'Arrah', code: 'ARR', district: 'Lacs', region: 'Lacs', type: 'ville' },
  { nom: 'M\'Bahiakro', code: 'MBA', district: 'Lacs', region: 'Lacs', type: 'ville' },
  { nom: 'Bocanda', code: 'BOC', district: 'Lacs', region: 'Lacs', type: 'ville' },

  // Région du Moronou
  { nom: 'Bongouanou', code: 'BGN', district: 'Lacs', region: 'Moronou', type: 'ville' },
  { nom: 'Arrah', code: 'ARA', district: 'Lacs', region: 'Moronou', type: 'ville' },
  { nom: 'M\'Bahiakro', code: 'MBH', district: 'Lacs', region: 'Moronou', type: 'ville' },

  // Région du N\'Zi
  { nom: 'Dimbokro', code: 'DIM', district: 'Lacs', region: 'N\'Zi', type: 'ville' },
  { nom: 'Bocanda', code: 'BCD', district: 'Lacs', region: 'N\'Zi', type: 'ville' },

  // DISTRICT DU VALLÉE DU BANDAMA
  // Région du Hambol
  { nom: 'Katiola', code: 'KAT', district: 'Vallée du Bandama', region: 'Hambol', type: 'ville' },
  { nom: 'Dabakala', code: 'DBK', district: 'Vallée du Bandama', region: 'Hambol', type: 'ville' },
  { nom: 'Niakaramandougou', code: 'NIA', district: 'Vallée du Bandama', region: 'Hambol', type: 'ville' },

  // Région du Gbêkê
  { nom: 'Bouaké', code: 'BKE', district: 'Vallée du Bandama', region: 'Gbêkê', type: 'ville' },
  { nom: 'Sakassou', code: 'SAK', district: 'Vallée du Bandama', region: 'Gbêkê', type: 'ville' },
  { nom: 'Béoumi', code: 'BEO', district: 'Vallée du Bandama', region: 'Gbêkê', type: 'ville' },
  { nom: 'Botro', code: 'BOT', district: 'Vallée du Bandama', region: 'Gbêkê', type: 'ville' },

  // DISTRICT DU WOROBA
  // Région du Béré
  { nom: 'Mankono', code: 'MKO', district: 'Woroba', region: 'Béré', type: 'ville' },
  { nom: 'Kounahiri', code: 'KNH', district: 'Woroba', region: 'Béré', type: 'village' },

  // Région du Bafing
  { nom: 'Touba', code: 'TOB', district: 'Woroba', region: 'Bafing', type: 'ville' },
  { nom: 'Koro', code: 'KOR', district: 'Woroba', region: 'Bafing', type: 'ville' },
  { nom: 'Ouaninou', code: 'OUA', district: 'Woroba', region: 'Bafing', type: 'ville' },

  // Région du Worodougou
  { nom: 'Séguéla', code: 'SEG', district: 'Woroba', region: 'Worodougou', type: 'ville' },
  { nom: 'Kani', code: 'KNI', district: 'Woroba', region: 'Worodougou', type: 'ville' },
  { nom: 'Massala', code: 'MAS', district: 'Woroba', region: 'Worodougou', type: 'ville' },

  // DISTRICT DU ZANZAN
  // Région du Bounkani (aussi dans Comoé)
  { nom: 'Nassian', code: 'NSN', district: 'Zanzan', region: 'Bounkani', type: 'ville' },

  // Région du Gontougo
  { nom: 'Bondoukou', code: 'BDK', district: 'Zanzan', region: 'Gontougo', type: 'ville' },
  { nom: 'Tanda', code: 'TND', district: 'Zanzan', region: 'Gontougo', type: 'ville' },
  { nom: 'Transua', code: 'TRS', district: 'Zanzan', region: 'Gontougo', type: 'ville' },
  { nom: 'Koun-Fao', code: 'KNF', district: 'Zanzan', region: 'Gontougo', type: 'ville' },
  { nom: 'Sandégué', code: 'SDG', district: 'Zanzan', region: 'Gontougo', type: 'ville' },

  // DISTRICT DU SAVANES
  // Région du Poro
  { nom: 'Korhogo', code: 'KRH', district: 'Savanes', region: 'Poro', type: 'ville' },
  { nom: 'Dikodougou', code: 'DKD', district: 'Savanes', region: 'Poro', type: 'ville' },
  { nom: 'Sinématiali', code: 'SNM', district: 'Savanes', region: 'Poro', type: 'ville' },
  { nom: 'M\'Bengué', code: 'MBG', district: 'Savanes', region: 'Poro', type: 'ville' },

  // Région du Tchologo
  { nom: 'Ferkessédougou', code: 'FRK', district: 'Savanes', region: 'Tchologo', type: 'ville' },
  { nom: 'Kong', code: 'KNG', district: 'Savanes', region: 'Tchologo', type: 'ville' },
  { nom: 'Ouangolodougou', code: 'OGL', district: 'Savanes', region: 'Tchologo', type: 'ville' },

  // Région du Bagoué
  { nom: 'Boundiali', code: 'BDL', district: 'Savanes', region: 'Bagoué', type: 'ville' },
  { nom: 'Kouto', code: 'KTO', district: 'Savanes', region: 'Bagoué', type: 'ville' },
  { nom: 'Tengrela', code: 'TGR', district: 'Savanes', region: 'Bagoué', type: 'ville' },

  // DISTRICT DU SUD-COMOÉ
  // Région de la Mé (répétée pour classification)
  { nom: 'Aboisso', code: 'ABS', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'ville' },
  { nom: 'Adiaké', code: 'ADK', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'ville' },
  { nom: 'Grand-Bassam', code: 'GBM', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'ville' },
  { nom: 'Tiapoum', code: 'TIP', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'ville' },
  { nom: 'Ayamé', code: 'AYA', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'village' },
  { nom: 'Etuéboué', code: 'ETU', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'village' },
  { nom: 'Noé', code: 'NOE', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'village' },

  // Autres villages et localités importants
  { nom: 'Assinie', code: 'ASS', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'village' },
  { nom: 'Maféré', code: 'MAF', district: 'Sud-Comoé', region: 'Sud-Comoé', type: 'village' },
];

// Fonction pour obtenir toutes les destinations par district
export const getDestinationsByDistrict = (district: string): Destination[] => {
  return destinations.filter(d => d.district === district);
};

// Fonction pour obtenir toutes les destinations par région
export const getDestinationsByRegion = (region: string): Destination[] => {
  return destinations.filter(d => d.region === region);
};

// Fonction pour obtenir toutes les destinations par type
export const getDestinationsByType = (type: 'ville' | 'commune' | 'village'): Destination[] => {
  return destinations.filter(d => d.type === type);
};

// Fonction pour rechercher des destinations par nom
export const searchDestinations = (query: string): Destination[] => {
  const lowerQuery = query.toLowerCase();
  return destinations.filter(d =>
    d.nom.toLowerCase().includes(lowerQuery) ||
    d.code.toLowerCase().includes(lowerQuery)
  );
};

// Liste des districts
export const districts = [
  'Abidjan',
  'Yamoussoukro',
  'Lagunes',
  'Comoé',
  'Denguélé',
  'Montagnes',
  'Sassandra-Marahoué',
  'Bas-Sassandra',
  'Gôh-Djiboua',
  'Lacs',
  'Vallée du Bandama',
  'Woroba',
  'Zanzan',
  'Savanes',
  'Sud-Comoé',
];
