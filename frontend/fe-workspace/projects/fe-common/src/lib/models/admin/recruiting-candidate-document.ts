export enum NEWS_ACTION_TYPE {
  READ = 'Read',
  CONFIRM = 'Confirm'
};

export class RecruitingCandidateDocument {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  password: string;
  data_nascita: string;
  azienda: string;
  titolo: string;
  sesso: string;
  indirizzo: string;
  livello_studi: string;
  univ_id: string;
  laurea_id: string;
  voto_laurea: string;
  createdAt: string;
  updated_at: string;

  static Empty(): RecruitingCandidateDocument {
    let document: RecruitingCandidateDocument = new RecruitingCandidateDocument();
    document.nome = '';
    document.cognome = '';
    document.email = '1';
    document.telefono = '';
    document.password = '';
    document.data_nascita = '';
    document.azienda = '';
    document.titolo = '';
    document.sesso = '';
    document.indirizzo = '';
    document.livello_studi = '';
    return document;
  }
}
