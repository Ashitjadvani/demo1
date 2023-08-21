export class IState {
    choices: [string: any[]];
    currentPerson: Person;
    currentJobOpening: JobOpening;
    currentJobApplication: JobApplication;
    mandatoryFields: MandatoryField[];
    dashboard: Dashboard;
}

export class DashboardJA {
    status: any;
    total: number;
}

export class DashboardCandidates {
    total: number;
    opening: number;
    position: number
}

export class Dashboard {
    JobOpening: number;
    JobApplications: DashboardJA;
    Candidates: DashboardCandidates;
}

export class JobOpening {
    id: number = null;
    code = '';
    name = '';
    description = '';
    shortDescription = '';
    longDescription = '';
    successMessage = '';
    short_description = '';
    on_complete = '';
    start = '';
    city = '';
    end = '';
    jobImageId = '';
    mandatory_fields: any = [];
    mandatoryFields: any = [];
    customFields: any = [];
    videoAssessment: any = [];
    quizFields: any = [];
    quizFieldId: string = '';
    status: string = '';
    site: string = '';
    applications_count: number;
    type = 'OPENING';
    area: string;
    jobType: string;
    scope: string;
    custom_fields: number[];
    address: string = '';
    noOfOpening: string = '';
    totalExperience: string = '';
    isCandidateRead: string = '';
  quizSequence: any;
}

export class Person {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    telefono: string;
    data_nascita: string;
    age: number;
    azienda: string;
    titolo: string;
    sesso: string;
    indirizzo: string;
    livello_studi: string;
    univ: Universita;
    laurea: Laurea;
    voto_laurea: string;
    anno_laurea: number;
    isReadCandidate?: any;
    applications: JobApplication[];
}

export class MandatoryField {
    field: string;
    label: string
}


export class CustomField {
    id: number;
    label: string;
}
export class Laurea {
    id: number;
    description: string;
}

export class Universita {
    id: number;
    description: string;
}

export class JobApplicationStatus {
    status: string;
    description: string;
}

export class JobHistory {
    created_at: string;
    updated_at: string;
    application: number;
    from_state: JobApplicationStatus;
    to_state: JobApplicationStatus;
    notes: string;
}

export class JobApplication {
    id: number;
    person_id: number;
    person: Person;
    opening_id: number;
    opening: JobOpening;
    data_completamento: string;
    fitindex: number;
    status_id: number;
    status: JobApplicationStatus;
    history?: JobHistory[];
    isReadJob?:any;

    clear() {
        this.id = null;
        this.person_id = null;
        this.person = null;
        this.opening_id = null;
        this.opening = null;
        this.data_completamento = null;
        this.fitindex = null;
        this.status_id = null;
        this.status = null;
        this.history = [];
        this.isReadJob =null;
    }
}

export enum CRUDMode {
    ADD = '[CRUDMode] add',
    EDIT = '[CRUDMode] edit',
    VIEW = '[CRUDMode] view',
    DELETE = '[CRUDMode] delete'
}

