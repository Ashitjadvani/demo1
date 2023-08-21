import { ChangeDetectorRef, Component } from '@angular/core';
import { NSHelperService } from './service/NSHelper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe-superadmin';
  loaderVisible:boolean;
  
  constructor(private helper:NSHelperService,
    private cdRef: ChangeDetectorRef,){
    this.helper.loaderVisibilityChange.subscribe((value) => {
      this.loaderVisible = value;
      this.cdRef.detectChanges();
    });
  }  
}
