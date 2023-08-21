export class Safety {
    id: string;
    name: string;
    description : string
    type : string;
    icon: string;
    sequence: number;
    color: string;

    constructor() {

    }

    static Clone(safety: Safety): Safety {
        let newSafety = new Safety();
        newSafety.id = safety.id;
        newSafety.name = safety.name;
        newSafety.description = safety.description;
        newSafety.type = safety.type;
        newSafety.icon = safety.icon;
        newSafety.sequence = safety.sequence;
        newSafety.color = safety.color;
        return newSafety;
    }

    static filterMatch(data: Safety, filter: string): boolean {
        let lowerFilter = filter.toLocaleLowerCase();
        return ((data.name && data.name.toLocaleLowerCase().includes(lowerFilter)) ||
            (data.description && data.description.toLocaleLowerCase().includes(lowerFilter)));
    }
}