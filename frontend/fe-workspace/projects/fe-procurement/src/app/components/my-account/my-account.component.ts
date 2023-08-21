import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../service/helper.service';
import Swal from 'sweetalert2';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../service/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  constructor(public dialog: MatDialog,
              private Api: ApiService,
              private router: Router,
              private Helper: HelperService) { }

  ngOnInit(): void {
  }

  logout(): void {
    HelperService.onLogOut();
    this.router.navigate(['/']);
  }
}
