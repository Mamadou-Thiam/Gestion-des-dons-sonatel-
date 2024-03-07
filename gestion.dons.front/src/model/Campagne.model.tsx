export interface DataCampagne {
    id:string;
    libelle: string; 
    reference:string;
    description: string; 
    dateDebut: string; 
    dateFin: string; 
    montantCible: string; 
    montantActuel: string; 
    montantKit: string; 
    montantDonFixe: string; 
    nombreDon: string; 
    banniere: string; 
    groupe: { id: string }; 
    theme: { id: string };
    // dateCreation: string; 
    // dateModification: string; 
    supprime:boolean;
    
  }
  