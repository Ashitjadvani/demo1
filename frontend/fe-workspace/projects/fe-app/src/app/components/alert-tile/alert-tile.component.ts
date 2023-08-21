import { Component, Input, OnInit } from '@angular/core';
import { NewsDocument } from 'projects/fe-common/src/lib/models/admin/news-document';

const COLOR_UNREAD = '#ff0000';
const COLOR_READED = '#025450';
const COLOR_CONFIRMED = '#14aab9';

const BACKGROUND_UNREAD = '#FDF1E6';
const BACKGROUND_READ = '#E6F3FE';
const BACKGROUND_CONFIRMED = '#E9F8F0';

const ICON_BACKGROUND_UNREAD = '#FFB266';
const ICON_BACKGROUND_READ = '#66C0FF';
const ICON_BACKGROUND_CONFIRMED = '#66D197';

@Component({
    selector: 'app-alert-tile',
    templateUrl: './alert-tile.component.html',
    styleUrls: ['./alert-tile.component.scss']
})
export class AlertTileComponent implements OnInit {
    @Input() newsDocument: NewsDocument;

    textColor: string;
    backgroundColor: string;
    icon: string;
    iconBackgroundColor: string;

    ICON_UNREAD = 'news-unread';
    ICON_READ = 'news-read';
    ICON_CONFIRMED = 'news-confirmed';

    constructor() {
        
    }

    async ngOnInit() {
        this.icon = this.ICON_UNREAD;
        this.backgroundColor = BACKGROUND_UNREAD;
        this.iconBackgroundColor = ICON_BACKGROUND_UNREAD;
        this.textColor = 'black';

        if (this.newsDocument.readed) {
            this.icon = this.ICON_READ;
            this.iconBackgroundColor = ICON_BACKGROUND_READ;
            this.backgroundColor = BACKGROUND_READ;
        }

        if (this.newsDocument.confirmed) {
            this.icon = this.ICON_CONFIRMED;
            this.iconBackgroundColor = ICON_BACKGROUND_CONFIRMED;
            this.backgroundColor = BACKGROUND_CONFIRMED;
        }
    }

    onClick() {

    }
}
