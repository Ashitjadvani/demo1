import { Injectable } from '@angular/core';
import { ITEM_STATUS, Plan, PlanItem } from 'projects/fe-common-v2/src/lib/models/product-tracking/products-tracking';
import { Order, Product, PRODUCT_STATUS } from '../models/product-tracking/products-tracking';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';

export class OrderListResult extends BaseResponse {
    orders: Order[];
}

export class OrderResult extends BaseResponse {
    order: Order;
}

export class ProductResult extends BaseResponse {
    product: Product;
}

export class OrderProductsResult extends BaseResponse {
    products: Product[];
}

export class OrderProductResult extends BaseResponse {
    product: PlanItem;
    order: Plan;
}

export class DashboardResult extends BaseResponse {
    productCount: number;
    orderCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsTrackingService {

    constructor(private apiService: ApiService) { }

    async getOrders(): Promise<OrderListResult> {
        return this.apiService.get<OrderListResult>(this.apiService.API.BE.ORDER_LIST).toPromise();
    }

    async getOrder(id: string): Promise<OrderResult> {
        let url = buildRequest(this.apiService.API.BE.ORDER_BY_ID,
            {
                ':id': id
            });
        return this.apiService.get<OrderResult>(url).toPromise();
    }

    async createOrUpdateOrder(order: Order): Promise<BaseResponse> {
        return this.apiService.post<BaseResponse>(this.apiService.API.BE.ORDER, order).toPromise();
    }

    async deleteOrder(id: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ORDER_BY_ID,
            {
                ':id': id
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    async getOrderWithProduct(productId): Promise<OrderResult> {
        let url = buildRequest(this.apiService.API.BE.ORDER_WITH_PRODUCT,
            {
                ':productId': productId
            });
        return this.apiService.get<OrderResult>(url).toPromise();
    }

    async updateOrderProduct(productId, data: any): Promise<OrderResult> {
        let url = buildRequest(this.apiService.API.BE.UPDATE_ORDER_PRODUCT,
            {
                ':productId': productId
            });
        let body = {
            data: data
        }
        return this.apiService.put<OrderResult>(url, body).toPromise();
    }

    async activateProduct(orderId: string, itemId: string, codeId: string): Promise<ProductResult> {
        let url = buildRequest(this.apiService.API.BE.PRODUCT_ACTIVATE,
            {
                ':orderId': orderId,
                ':itemId': itemId,
                ':codeId': codeId
            });
        let body = {
            status: PRODUCT_STATUS.ACTIVE
        }
        return this.apiService.post<ProductResult>(url, body).toPromise();
    }


    async updateProductStatus(codeId: string, productStatus: PRODUCT_STATUS): Promise<ProductResult> {
        let url = buildRequest(this.apiService.API.BE.PRODUCT_UPDATE,
            {
                ':codeId': codeId
            });
        let body = {
            status: productStatus 
        }
        return this.apiService.post<ProductResult>(url, body).toPromise();
    }

    async getOrderProducts(orderId: string): Promise<OrderProductsResult> {
        let url = buildRequest(this.apiService.API.BE.ORDER_PRODUCTS,
            {
                ':orderId': orderId
            });
        return this.apiService.get<OrderProductsResult>(url).toPromise();
    }

    async getProductByCode(codeId: string): Promise<OrderProductResult> {
        let url = buildRequest(this.apiService.API.BE.PRODUCT_BY_CODE,
            {
                ':codeId': codeId
            });
        return this.apiService.get<OrderProductResult>(url).toPromise();
    }

    async getProducts(): Promise<OrderProductsResult> {
        return this.apiService.get<OrderProductsResult>(this.apiService.API.BE.ALL_PRODUCTS).toPromise();
    }

    async getDashboardStats(): Promise<DashboardResult> {
        return this.apiService.get<DashboardResult>(this.apiService.API.BE.DASHBOARD_INFO).toPromise();
    }
 
    async updateProductOperationLog(codeId: string, productStatus: PRODUCT_STATUS): Promise<ProductResult> {
        let url = buildRequest(this.apiService.API.BE.PRODUCT_OPERATION_UPDATE,
            {
                ':codeId': codeId
            });
        let body = {
            status: productStatus 
        }
        return this.apiService.post<ProductResult>(url, body).toPromise();
    }


    
    
}
