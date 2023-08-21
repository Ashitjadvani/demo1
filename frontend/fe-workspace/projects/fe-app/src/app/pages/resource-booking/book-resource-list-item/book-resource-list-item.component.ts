import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IrinaResource } from 'projects/fe-common/src/lib/models/bookable-assets';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';

@Component({
    selector: 'app-book-resource-list-item',
    templateUrl: './book-resource-list-item.component.html',
    styleUrls: ['./book-resource-list-item.component.scss']
})
export class BookResourceListItemComponent implements OnInit {

    @Input() resourceItem: IrinaResource;
    @Input() displayActions = true;
    @Output() selected = new EventEmitter<IrinaResource>();

    imageUrl: SafeUrl = null;
    features: any[] = [];

    constructor(private dataStorageManagementService: DataStorageManagementService) { }

    async ngOnInit() {
        console.log('BookResourceListItemComponent.init: ', this.resourceItem);
         if (this.resourceItem.imageURL) {
             this.imageUrl = await this.dataStorageManagementService.downloadImageFile(this.resourceItem.imageURL);
         }
    }
    
    safeNameDisplay() {
        return this.resourceItem ? this.resourceItem.code + ' - ' + this.resourceItem.description : '';
    }

    safeAddressDisplay() {
        return this.resourceItem ? this.resourceItem.custom.layout + ' - ' + this.resourceItem.site : '';
    }

    getFeatureImage(feature: string) {
        return './assets/images/' + feature.toLowerCase() + '.svg';
    }

    onResourceSelect() {
        this.selected.emit(this.resourceItem);
    }
}
