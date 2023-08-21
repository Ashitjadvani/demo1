import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {MCPHelperService} from './MCPHelper.service';
//import { DNApiService } from './DNApiService';
import {Person} from '../../../../fe-common-v2/src/lib/models/person';
class Credentials {
  brandColor: string;
  groupCount: string;
  token: string;
  person: Person;

  constructor(brandColor: string, groupCount: string, token: string, person: Person) {
    this.token = token;
    this.person = person;
    this.brandColor = brandColor;
    this.groupCount = groupCount;
  }
}
@Injectable()
export class AuthGuardService implements CanActivate {
  private userCredentials: Credentials;
  private authorizationToken: Credentials;
  constructor(
    public router: Router,
    public helper: MCPHelperService,
    //public apiService: DNApiService
  ){
  }
  canActivate(): boolean {
    let credentials: Credentials = JSON.parse(localStorage.getItem("credentials"));
    if (credentials != null){
      return true;
    }else {
      return false;
    }
  }
}
