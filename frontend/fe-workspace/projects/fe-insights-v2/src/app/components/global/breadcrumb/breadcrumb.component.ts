import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
    @Input() element: any;
  @Input() title: string
  @Input() title2: string
  @Input() title3: string
  @Input() title4: string = ''
  @Input() routePath: string
  @Input() routePath2: string
  @Input() routePath3: string
  @Input() type: string
  @Input() type2: string
  @Input() size: number
  @Input() backPath: string

    @Output() back = new EventEmitter<any>();
  ngOnInit(): void {
  }
    Back() {
        this.back.emit(this.element)
    }


}
