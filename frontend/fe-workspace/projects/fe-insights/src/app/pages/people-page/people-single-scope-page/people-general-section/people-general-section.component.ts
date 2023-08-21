import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'projects/fe-common/src/lib/models/person';

@Component({
    selector: 'app-people-general-section',
    templateUrl: './people-general-section.component.html',
    styleUrls: ['./people-general-section.component.scss']
})
export class PeopleGeneralSectionComponent implements OnInit {
    @Input() currentEditPerson: Person;
    
    genderList = [
        'Not specified',
        'Male',
        'Female'
    ];

    provITA = [
        'AG', 'AL', 'AN', 'AO', 'AR ', 'AP', 'AT', 'AV',
        'BA', 'BT', 'BL', 'BN', 'BG', 'BI', 'BO', 'BZ', 'BS', 'BR',
        'CA', 'CL', 'CB', 'CE', 'CT', 'CZ', 'CH', 'CO', 'CS', 'CR', 'KR', 'CN',
        'EN',
        'FM', 'FE', 'FI', 'FG', 'FC', 'FR',
        'GE', 'GO', 'GR',
        'IM', 'IS',
        'SP', 'LT', 'LE', 'LC', 'LI', 'LO', 'LU',
        'MC', 'MC', 'MS', 'MT', 'VS', 'ME', 'MI', 'MO', 'MB',
        'NA', 'NO', 'NU',
        'OR',
        'PD', 'PA', 'PR', 'PV', 'PG', 'PU', 'PE', 'PC', 'PI', 'PT', 'PN', 'PZ', 'PO',
        'RG', 'RA', 'RC', 'RE', 'RI', 'RN', 'RM', 'RO',
        'SA', 'SS', 'SV', 'SI', 'SR', 'SO',
        'TA', 'TE', 'TR', 'TO', 'TP', 'TN', 'TV', 'TS',
        'UD',
        'VA', 'VE', 'VB', 'VC', 'VR', 'VV', 'VI', 'VT'
    ];
        
    constructor() { }

    ngOnInit(): void {
    }

}
