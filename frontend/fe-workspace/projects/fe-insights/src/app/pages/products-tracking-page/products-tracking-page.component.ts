import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions, ChartType } from 'chart.js';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { Order, OrderItem, Product } from 'projects/fe-common/src/lib/models/product-tracking/products-tracking';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { DashboardResult, ProductsTrackingService } from 'projects/fe-common/src/lib/services/products-tracking.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { throwIfEmpty } from 'rxjs/operators';
import { Action, ColumnTemplate } from '../../components/table-data-view/table-data-view.component';


class OverviewCard {
    id: number;
    image: string;
    title: string;
    data: string;
    mainColor: string;
    footerColor: string;
    footerText: string;
    totalCount: string;
    count: boolean;
    counterIndex: number;

    constructor(id: number,
        image: string,
        title: string,
        data: string,
        mainColor: string,
        footerColor: string,
        footerText: string,
        totalCount: string,
        count: boolean,
        counterIndex: number
    ) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.data = data;
        this.mainColor = mainColor;
        this.footerColor = footerColor;
        this.footerText = footerText;
        this.totalCount = totalCount;
        this.count = count;
        this.counterIndex = counterIndex;
    }
}

enum CardType {
    Openings,
    Candidates,
    JobApplication
}

enum UIState {
    uiDashboard,
    uiOrders,
    uiProduct
}

@Component({
    selector: 'app-products-tracking-page',
    templateUrl: './products-tracking-page.component.html',
    styleUrls: ['./products-tracking-page.component.scss'],
    animations: [
        trigger('slideInOutV', [
            state('in', style({
                overflow: 'hidden',
                height: '*',
            })),
            state('out', style({
                opacity: '0',
                overflow: 'hidden',
                height: '0px',
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ])
    ]

})
export class ProductsTrackingPageComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

    UIState = UIState;

    overviewDataCards: any = [
        new OverviewCard(UIState.uiOrders, 'receipt_long', 'Ordini', '', '#82DAC4', '#79D2B6', 'Visualizza', 'totalJobOpening', false, 0),
        new OverviewCard(UIState.uiProduct, 'category', 'Prodotti', '', '#E38698', '#DF5E7C', 'Visualizza', 'totalCandidates', false, 1)
    ]

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: 'Codice', columnName: 'OrderCode', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Cliente', columnName: 'Customer', columnDataField: 'orderData.customer', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Numero Ordine', columnName: 'OrderNo', columnDataField: 'orderData.orderNo', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: 'Gestisci', image: null, icon: 'settings', color: '#000000', action: 'onModifyOrder', context: this },
        { tooltip: 'Visualizza QR', image: null, icon: 'qr_code', color: '#000000', action: 'onShowOrderQR', context: this },
        { tooltip: 'Cancella', image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteOrder', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: 'Indietro', image: null, icon: 'arrow_back', color: '#ffffff', action: 'onBackToDashboard', context: this },
        { tooltip: 'Aggiorna', image: null, icon: 'refresh', color: '#ffffff', action: 'onRefreshOrderList', context: this },
        { tooltip: 'Aggiungi Ordine', image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddOrder', context: this }/* ,
        { tooltip: this.translate.instant('PRODUCT_TRACKING.TOGGLE_CHARTS'), image: null, icon: 'stacked_bar_chart', color: '#ffffff', action: 'onToggleCharts', context: this } */
    ]

    tableProductsColumnTemplates: ColumnTemplate[] = [
        { columnCaption: 'Codice Prodotto', columnName: 'ProductCode', columnDataField: 'itemCode', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Codice QR', columnName: 'QRCode', columnDataField: 'codeId', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Stato', columnName: 'Status', columnDataField: 'status', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableProductsRowActions: Action[] = [
        { tooltip: 'Log Attività', image: null, icon: 'list_alt', color: '#000000', action: 'onShowProductActivity', context: this }
    ]

    tableProductsMainActions: Action[] = [
        { tooltip: 'Indietro', image: null, icon: 'arrow_back', color: '#ffffff', action: 'onBackToDashboard', context: this },
        { tooltip: 'Aggiorna', image: null, icon: 'refresh', color: '#ffffff', action: 'onRefreshProductList', context: this }
    ]

    plantSites: any[] = [
        { name: 'Montà IT' },
        { name: 'Caldonazzo IT' },
        { name: 'Brignano IT' },
        { name: 'Malo IT' },
        { name: 'Sheffield UK' },
        { name: 'Greater Nida INDIA' },
        { name: 'Chennai INDIA' }
    ]

    currentUIState: UIState = UIState.uiDashboard;

    chartDrawerAction: string = "out";

    userAccount: Person;

    sites: Site[];
    ordersTableData: any;
    titleCard: string;

    datePipe: DatePipe = new DatePipe('it-IT');

    currentOrder: Order = Order.Empty();

    showQR: boolean = false;
    orderQR: string;
    qrLevel: string = 'Q';

    pieChartData: number[] = [];
    pieChartLegend: string[] = [];
    pieChartType: ChartType = 'doughnut';
    pieChartOptions: ChartOptions = {
        responsive: true
    }

    orderItem: OrderItem = OrderItem.Empty();
    currentOrderProducts: Product[] = [];
    currentProducts: Product[] = [];

    showActivity: boolean;
    currentActivityPtoduct: Product;

    dashboardDataCounter: number[] = [0, 0];

    constructor(private commonService: CommonService,
        private adminSiteManagementService: AdminSiteManagementService,
        private productsTrackingService: ProductsTrackingService,
        private userManagementService: UserManagementService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) { }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();

        // await this.loadSites();
        // await this.loadOrders();
        await this.loadDashboard();
    }

    async loadDashboard() {
        let res = await this.productsTrackingService.getDashboardStats();
        if (this.commonService.isValidResponse(res)) {
            this.dashboardDataCounter[0] = res.orderCount;
            this.dashboardDataCounter[1] = res.productCount;
        } else {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async loadSites() {
        let allSite: Site = Site.Empty();
        allSite.key = '-1';
        allSite.name = this.translate.instant('ADMIN DIALOGS.ALL SITES');

        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.sites = [allSite].concat(res.sites);
        } else {
            this.sites = [allSite];
        }
    }

    async loadOrders() {
        let res = await this.productsTrackingService.getOrders();
        if (this.commonService.isValidResponse(res)) {
            this.ordersTableData = res.orders;
        } else {
            this.ordersTableData = [];
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async onRefreshProductList() {
        let res = await this.productsTrackingService.getProducts();
        if (this.commonService.isValidResponse(res)) {
            this.currentProducts = res.products;
        } else {
            this.currentProducts = [];
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async loadProductionItems() {
        let res = await this.productsTrackingService.getOrderProducts(this.currentOrder.id);
        if (this.commonService.isValidResponse(res)) {
            this.currentOrderProducts = res.products;
        } else {
            this.currentOrderProducts = [];
        }
    }

    async onRefreshOrderList() {
        await this.loadOrders();
    }

    onToggleCharts() {
        this.chartDrawerAction = this.chartDrawerAction == 'out' ? 'in' : 'out';
    }

    onAddOrder() {
        this.titleCard = "Nuovo Ordine Produzione";
        this.currentOrder = Order.Empty();
        this.tabgroup.selectedIndex = 1;
    }

    async onModifyOrder(order: Order) {
        this.titleCard = "Gestione Ordine Produzione";
        this.currentOrder = order;
        await this.loadProductionItems();

        this.tabgroup.selectedIndex = 1;
    }

    onShowOrderQR(order: Order) {
        this.showQR = true;
        this.orderQR = window.location.origin + '/insights/order-info/' + order.id;
    }

    async onDeleteOrder(order: Order) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('PRODUCT_TRACKING.DELETE_ORDER'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.productsTrackingService.deleteOrder(order.id);
            if (res.result)
                await this.loadOrders();
            else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    isConfirmEnabled() {
        return true;
    }

    onCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onConfirmClick() {
        let res = await this.productsTrackingService.createOrUpdateOrder(this.currentOrder)
        if (this.commonService.isValidResponse(res)) {
            this.loadOrders();
        } else {
            this.snackBar.open('Error :' + res.reason, this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }

        this.tabgroup.selectedIndex = 0;
    }

    onCloseLoginQR() {
        this.showQR = false;
    }

    onDownloadLoginQR(qrcode) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this.commonService.downloadImageBase64(qrImage, 'order-qr');
    }

    onAddOrderItem() {
        this.currentOrder.items = this.currentOrder.items.concat([this.orderItem]);
        this.orderItem = OrderItem.Empty();
    }

    onDeleteOrderItem(index, element) {
        let i = 0;

        this.currentOrder.items = this.currentOrder.items.filter(item => i++ != index);
    }

    onShowProductActivity(product: Product) {
        this.currentActivityPtoduct = product;
        this.showActivity = true;
    }

    onCloseProductActivity() {
        this.showActivity = false;
    }

    onBackToDashboard() {
        this.currentUIState = UIState.uiDashboard;
    }

    async onNavigateUIState(state: UIState) {
        if (state == UIState.uiOrders) {
            await this.loadSites();
            await this.loadOrders();
            this.currentUIState = state;

            await this.onRefreshOrderList();
        } else if (state == UIState.uiProduct) {
            this.currentUIState = state;

            await this.onRefreshProductList();
        }
    }
}
