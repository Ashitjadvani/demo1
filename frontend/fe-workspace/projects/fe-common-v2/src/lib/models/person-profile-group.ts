export class PersonProfileGroup {
    id: string;
    companyId: string;
    name: string;
    description: string;
    persons: string[];
    functions: string[];

    static Empty(): PersonProfileGroup {
        let personProfileGroup = new PersonProfileGroup();

        personProfileGroup.name = '';
        personProfileGroup.description = '';
        personProfileGroup.persons = [];
        personProfileGroup.functions = [];

        return personProfileGroup;
    }
}
