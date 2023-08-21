import { Injectable } from '@angular/core';
import { ITEM_STATUS, Order, Plan, Product, PRODUCT_STATUS } from '../models/product-tracking/products-tracking';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';

export class OrderListResult extends BaseResponse {
    orders: Order[];
}

export class OrderResult extends BaseResponse {
    order: Plan;
}

export class ProductResult extends BaseResponse {
    product: Product;
}

export class OrderProductsResult extends BaseResponse {
    products: Product[];
}

export class OrderProductResult extends BaseResponse {
    product: Product;
    order: Order;
}

export class DashboardResult extends BaseResponse {
    productCount: number;
    orderCount: number;
}

export class MetaResult extends BaseResponse {
    meta: any;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsTrackingService {

    constructor(private apiService: ApiService) { }

    // ARTICOLI
    //
    async getItems(queryParams): Promise<MetaResult> {
        return this.apiService.post<MetaResult>(this.apiService.API.BE.LIST_ITEMS, queryParams).toPromise();
    }

    async syncItems(): Promise<BaseResponse> {
        return this.apiService.get<BaseResponse>(this.apiService.API.BE.SYNC_ITEMS).toPromise();
    }

    // ORDINI CLIENTI
    //
    async getCustomerOrders(queryParams): Promise<MetaResult> {
        return this.apiService.post<MetaResult>(this.apiService.API.BE.LIST_CUSTOMER_ORDERS, queryParams).toPromise();
    }

    async syncCustomerOrders(): Promise<BaseResponse> {
        return this.apiService.get<BaseResponse>(this.apiService.API.BE.SYNC_CUSTOMER_ORDERS).toPromise();
    }

    async getCustomerOrdersGrouped(queryParams): Promise<MetaResult> {
        return this.apiService.post<MetaResult>(this.apiService.API.BE.LIST_CUSTOMER_ORDERS_GROUPED, queryParams).toPromise();
    }

    // ORDINI LAVORAZIONE ODL
    //
    async getWorkingOrders(queryParams): Promise<MetaResult> {
        return this.apiService.post<MetaResult>(this.apiService.API.BE.LIST_WORKING_ORDERS, queryParams).toPromise();
    }

    async syncWorkingOrders(): Promise<BaseResponse> {
        return this.apiService.get<BaseResponse>(this.apiService.API.BE.SYNC_WORKING_ORDERS).toPromise();
    }

    // PROGRAMMI DI PRODUZIONE (BY DAY)
    //
    async getProductionPlans(queryParams): Promise<MetaResult> {
        return this.apiService.post<MetaResult>(this.apiService.API.BE.LIST_PRODUCTION_PLANS, queryParams).toPromise();
    }

    async syncProductionPlans(productionDate: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.SYNC_PRODUCTION_PLANS,
            {
                ':date': productionDate
            });
        return this.apiService.get<BaseResponse>(url).toPromise();
    }

    // PIANI DI PRODUZIONE (BY WEEK)
    //
    async getWorkingPlans(queryParams): Promise<MetaResult> {
        return this.apiService.post<MetaResult>(this.apiService.API.BE.LIST_WORKING_PLANS, queryParams).toPromise();
    }

    async syncWorkingPlans(productionDate: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.SYNC_WORKING_PLANS,
            {
                ':date': productionDate
            });
        return this.apiService.get<BaseResponse>(url).toPromise();
    }

    /////////////
    // DEPRECATED
    /////////////
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
