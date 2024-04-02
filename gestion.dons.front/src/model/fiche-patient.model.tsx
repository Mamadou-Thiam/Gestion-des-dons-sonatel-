export interface DataPatient {
  key?: string;
  id: string;
  nom: string;
  prenom: string;
  age: number;
  adresse: string;
  maladie: string;
  details: string;
  supprime: boolean;
  active?: boolean;
  numeroTelephone: string;
  numeroIdentification: string;
  typeIdentification: string;
  dateCreation: string;
  dateModification: string;
}
