import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from 'projects/fe-common/src/lib/services/base-response';
import { ApiService, buildRequest } from './api';

export class DataRepositoryEntry {
    entityId: string;
    entityObject: any;
}

export class DataRepositorySingleEntryResponse extends BaseResponse {
    data: DataRepositoryEntry;
}

export class DataRepositoryEntriesResponse extends BaseResponse {
    data: DataRepositoryEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class DataRepositoryManagementService {
    
    constructor(private apiService: ApiService,
        private _http: HttpClient
    ) {

    }

    addOrUpdateDataRepositoryEntry(repository: string, id: string, data: any): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DATA_REPOSITORY_REF,
            {
                ':repository': repository,
                ':id': id
            });
        return this.apiService.post<BaseResponse>(url, data).toPromise();
    }

    getDataRepositorySingleEntry(repository: string, id: string): Promise<DataRepositorySingleEntryResponse> {
        let url = buildRequest(this.apiService.API.BE.DATA_REPOSITORY_REF,
            {
                ':repository': repository,
                ':id': id
            });
        return this.apiService.get<DataRepositorySingleEntryResponse>(url).toPromise();
    }

    deleteDataRepositoryEntry(repository: string, id: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DATA_REPOSITORY_REF,
            {
                ':repository': repository,
                ':id': id
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    getDataRepositoryEntries(repository: string, query: any = { }): Promise<DataRepositoryEntriesResponse> {
        let url = buildRequest(this.apiService.API.BE.DATA_REPOSITORY_LIST,
            {
                ':repository': repository
            });
        return this.apiService.post<DataRepositoryEntriesResponse>(url, query).toPromise();
    }

}
