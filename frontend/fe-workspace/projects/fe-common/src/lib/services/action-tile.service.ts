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

    async actionTileList(): Promise<ActionTileListResponse> {
        return await this.apiService.get<ActionTileListResponse>(this.apiService.API.BE.ACTION_TILES).toPromise();
    }

    async updateActionTile(actionTile: ActionTile): Promise<BaseResponse> {
        return await this.apiService.put<BaseResponse>(this.apiService.API.BE.UPDATE_ACTION_TILE, actionTile).toPromise();
    }
}
