// Définition du modèle Campagne
interface DataThemeCampagne {
  id: string;
  libelle: string;
  description: string;
  logo: string;
  icon: string;
  dateCreation: string;
  dateModification: string;
  supprime: boolean;
}

export default DataThemeCampagne;
