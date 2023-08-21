import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActionTile } from 'projects/fe-common/src/lib/models/app';
import { ActionTileService } from 'projects/fe-common/src/lib/services/action-tile.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-action-tile-page',
    templateUrl: './action-tile-page.component.html',
    styleUrls: ['./action-tile-page.component.scss']
})
export class ActionTilePageComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    actionTiles: ActionTile[];
    tileSourceItems = new MatTableDataSource<any>();

    constructor(private actionTilesService: ActionTileService,
        public commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) { }

    async ngOnInit() {
        await this.loadActionTileList();
    }

    async loadActionTileList() {
        let res = await this.actionTilesService.actionTileList();
        if (res.result)
            this.actionTiles = res.data;
        else
            this.actionTiles = [];

        this.tileSourceItems.data = this.actionTiles;
        this.tileSourceItems.paginator = this.paginator;
    }

    async onEnableClick(item: ActionTile) {
        item.available = !item.available;
        let res = await this.actionTilesService.updateActionTile(item);
        if (res.result) {
            await this.loadActionTileList();
        }
    }
}
