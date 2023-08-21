import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api";
import {RecruitingCandidateDocument} from "../models/admin/recruiting-candidate-document";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MasterDocumentTypeService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }


  async getDocumentType(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_DOCUMENT_TYPE_LIST, data).toPromise();
  }

  async deleteDocumentType(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_DOCUMENT_TYPE_DELETE, data).toPromise();
  }

  async addDocumentType(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_DOCUMENT_TYPE_ADD, data).toPromise();
  }

  async editDocumentType(data: any): Promise<RecruitingCandidateDocument[]> {
    return this.apiService.post<RecruitingCandidateDocument[]>(this.apiService.API.BE.MASTER_DOCUMENT_TYPE_ADD, data).toPromise();
  }

  // multipleDeleteCostCenterType(data: any):<Observable<any> {
  //   return this.apiService.post<any>(this.apiService.API.BE.MASTER_COST_CENTER_TYPE_MULTIPLE_DELETE, data);
  // }

  multipleDeleteDocumentType(data: any): Observable<any>{
    return this.apiService.post<any>(this.apiService.API.BE.MASTER_DOCUMENT_TYPE_MULTIPLE_DELETE, data);
  }

  getSingleRecord(data: any): Observable<any>{
    return this.apiService.post<any>(this.apiService.API.BE.MASTER_DOCUMENT_TYPE_EDIT, data);
  }

}
