import {ChangeDetectorRef, Component} from '@angular/core';
import {HelperService} from "./service/helper.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe-procurement';
  loaderVisible: boolean;
  constructor(
    private helper: HelperService,
    private cdRef: ChangeDetectorRef
  ) {
    this.helper.loaderVisibilityChange.subscribe((value) => {
      this.loaderVisible = value;
      this.cdRef.detectChanges();
    });
  }
}
