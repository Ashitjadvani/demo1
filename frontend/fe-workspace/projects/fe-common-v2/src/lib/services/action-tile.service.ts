import { Injectable } from '@angular/core';
import { ActionTile } from '../models/app';
import { ApiService } from './api';
import { BaseResponse } from './base-response';

export class ActionTileListResponse extends BaseResponse {
    data: ActionTile[];
}

@Injectable({
    providedIn: 'root'
})
export class ActionTileService {

    constructor(private apiService: ApiService) { }

    async actionTileList(data: any): Promise<ActionTileListResponse> {
        return await this.apiService.post<ActionTileListResponse>(this.apiService.API.BE.ACTION_TILES,data).toPromise();
    }

    async updateActionTile(actionTile: ActionTile): Promise<BaseResponse> {
        return await this.apiService.put<BaseResponse>(this.apiService.API.BE.UPDATE_ACTION_TILE, actionTile).toPromise();
    }
}
