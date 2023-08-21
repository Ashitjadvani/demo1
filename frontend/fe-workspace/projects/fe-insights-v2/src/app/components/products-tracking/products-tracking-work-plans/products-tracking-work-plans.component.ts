import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductsTrackingService } from 'projects/fe-common-v2/src/lib/services/products-tracking.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { Subject } from 'rxjs';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import swal from 'sweetalert2';
import { debounceTime } from 'rxjs/operators';
import { DateAdapter } from '@angular/material/core';
import { EventHelper } from 'projects/fe-common-v2/src/lib';

/*

X LANCIO PRODUZIONE FINALE (PIANI DI LAVORAZIONE):
- Aggoungere menu: (Piani di Lavorazione)
- New vista: 
    Forno (centro di lavoro), Turno, Articolo (S/L), (colonne delle giornate 5gg -> settimana corrente) con Qty da produrre, Fornitore abituale (dati articolo)
        -> ACCORDION con
            Codice articolo (prodotto finito), 
            Descrizione,
            Destinazione (dato impostato sull'ordine) da recuperare nella tabella, 
            Qty da evadere (in ordine del cliente)
            Tempo di lavorazione (da aggiungere nell'anagrafica degli articoli).
        	
            Bottone -> Rapportino di lavorazione:
                Operatorre che farà il pezzo
                La qty da lavorare
                Il turno (1/2/3)
                Reparto (stringa) 
                Data (default oggi)
                Destinazione (dato impostato sull'ordine)
                Minuti x lavorare il singolo pezzo
                Tipo di lavorazione: LC -> Lavorazione Completa / LP -> Lavorazione Parziale / CF -> Collaudo Finale
                Produzione a Ciclo Continuo oppure Ciclo Interrotto (va sul piazzale)
                Note: campo libero
            	
                -> OUTPUT Attiva
                    - Magazzino: per gli accessori (sono nella distinta base per l'articolo (PF))
                    - Carrelista: QTY / ARTICOLO e operatore addetto al montaggio
                    - Operatore: scheda completa (Rapportino di lavorazione).

*/

@Component({
    selector: 'app-products-tracking-work-plans',
    templateUrl: './products-tracking-work-plans.component.html',
    styleUrls: ['./products-tracking-work-plans.component.scss'],
    animations: [EventHelper.animationForDetailExpand()]
})
export class ProductsTrackingWorkPlansComponent implements OnInit {
    private subject: Subject<string> = new Subject();

    page: any = 1;
    totalItems: any = 0;
    limit: any = 10;
    itemsPerPage: any = '10';
    search: any = '';
    sortBy: any = '-1';
    sortKey = null;
    noRecordFound = false;

    displayedColumns: string[] = [
        'code_resource',
        'shift',
        'item_code_sl',
        'qty_day_1',
        'qty_day_2',
        'qty_day_3',
        'qty_day_4',
        'qty_day_5',
        'item_provider'
    ];
    listOfWorkingPlans: any = new MatTableDataSource([]);
    currentWeekDate: Date = new Date();

    expandedElement: any | null;
    currentPlanItems: any;
    degreeDisplayedColumns: string[];

    qty_col_names = [
        'day 1',
        'day 2',
        'day 3',
        'day 4',
        'day 5'
    ]

    public requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '' };

    constructor(public dialog: MatDialog,
        public commonService: CommonService,
        private productsTrackingService: ProductsTrackingService,
        private router: Router,
        private helper: MCPHelperService,
        private dateAdapter: DateAdapter<Date>,
        public translate: TranslateService) {

        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
        this.setSearch();
    }


    private setSearch(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.page = 1;
            this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            };
            this.getWorkingPlans();
        });
    }

    private updateQtyColumnsTitle() {
        let weekStartDate = new Date();
        weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1);

        let month = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC']
        let col = ['', '', '', '', ''];
        for (let i = 0; i < col.length; i++) {
            weekStartDate.setDate(weekStartDate.getDate() + 1);
            let m = weekStartDate.getMonth();
            this.qty_col_names[i] = month[m] + weekStartDate.getDate();
        }
    }

    async ngOnInit() {
        this.degreeDisplayedColumns = EventHelper.getDegreeDisplayedColumns();
        
        this.updateQtyColumnsTitle();
        await this.getWorkingPlans();
    }

    onKeyUp(searchTextValue: any): void {
        this.subject.next(searchTextValue);
    }

    async pageChanged(page) {
        this.requestPara = {
            page: page, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
        };
        await this.getWorkingPlans();

        this.page = page;
    }

    changeItemsPerPage(event): void {
        this.itemsPerPage = event
        this.page = 1;
        this.limit = this.itemsPerPage;
    }

    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        };
        this.getWorkingPlans();
    }

    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch() {
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        }
        this.getWorkingPlans();
    }

    async getWorkingPlans() {
        /*
        let res = await this.productsTrackingService.getWorkingPlans(this.requestPara);
        if (!this.commonService.isValidResponse(res)) {
            swal.fire('', res.reason, 'error');
        } else {
            this.listOfWorkingPlans = res.meta.data;
            this.totalItems = res.meta.totalCount;
            this.noRecordFound = this.listOfWorkingPlans.length > 0;
        }
        */
    }

    async onRefreshTable() {
        await this.getWorkingPlans();
    }

    async onFilterItems() {

    }

    async onSyncWorkingPlans() {
        /*
        let res = await this.productsTrackingService.syncWorkingPlans(this.commonService.toYYYYMMDD(this.productionDate));
        if (this.commonService.isValidResponse(res)) {
            swal.fire('', 'Sincronizzazione OK', 'success');
        } else {
            swal.fire('', res.reason, 'error');
        }
        */
    }
}
