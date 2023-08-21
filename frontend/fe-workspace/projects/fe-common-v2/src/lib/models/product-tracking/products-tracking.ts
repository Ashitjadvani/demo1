import { User } from "../admin/user";

export enum ITEM_STATUS {
    DRAFT = "draft",
    ACTIVE = "active",
    ELIGIBLE = "eligible",
    SCRAP = "scrap",
    PACKAGING = "packaging",
    SHIP = "ship"
};

export class OrderOperationLog {
    timestamp: Date;
    user: any;
    action: string;
    extra: any;
}

export class OrderItem {
    code: string;
    id: string;
    description: string;
    quantity: number;
    
    

    owner: any;
    status: ITEM_STATUS;
    operationLog: OrderOperationLog[];
    timestamp: Date;

    static Empty(): OrderItem {
        let orderItem = new OrderItem();

        orderItem.status = ITEM_STATUS.DRAFT;
        orderItem.operationLog = [];

        return orderItem;
    }
}

export class Order {
    id: string;
    name: string;
    description: string;
    orderData: any;
    items: OrderItem[];
    operationLog: OrderOperationLog[];

    static Empty(): Order {
        let order = new Order();

        order.orderData = { };
        order.items = [];
        order.operationLog = [];

        return order;
    }
}

export class PlanItem {
    code: string;
    id: string;
    description: string;
    shift: string;
    quantity: number;  
    activation_id: string;  

    qty_prod: number;
    qty_sca: number;
    qty_dif: number;
    qty_d_prod: number;
    qty_d_sca: number;
    qty_d_dif: number;

    owner: any;
    status: PRODUCT_STATUS;
    operationLog: OrderOperationLog[];
    timestamp: Date;

    static Empty(): PlanItem {
        let orderItem = new PlanItem();

        orderItem.status = PRODUCT_STATUS.DRAFT;
        orderItem.operationLog = [];

        return orderItem;
    }
}

export class Plan {
    id: string;
    serial: string;
    code_odl: string;
    date: string; // YYYYMMDD
    planType: string; // TR__TIPO
    code_resource: string; // Forno

    name: string;
    description: string;
    orderData: any;
    items: PlanItem[];
    operationLog: OrderOperationLog[];

    static Empty(): Plan {
        let order = new Plan();

        order.orderData = { };
        order.items = [];
        order.operationLog = [];

        return order;
    }
}

export enum PRODUCT_STATUS {
    DRAFT = "draft",
    ACTIVE = "attivato",
    ELIGIBLE = "valido",
    SCRAP = "scrap",
    DEFECT = "difettoso",

    START_MOVE_WORKING = "spostamento in lavorazione",
    END_MOVE_WORKING = "arrivato in lavorazione",
    WORKING = "in lavorazione",
    DONE_WORKING = "fine lavorazione",
    
    START_MOVE_PACKAGING = "spostamento in packaging",
    END_MOVE_PACKAGING = "arrivato in packaging",
    PACKAGING = "packaging",
    DONE_PACKAGING = "fine packaging",

    LOGISTIC = "logistica",
    
    SHIP = "distribuzione",
    SHIPPED = "spedito",
    QUALITY_CHECK_OK = "qualità ok",

    RETURNED = 'reso'
};

export class ProductOperationLog {
    timestamp: Date;
    user: string;
    status: PRODUCT_STATUS;
    extra: any;
}

export class Product {
    id: string;
    codeId: string;
    orderId: string;
    itemCode: string;
    status: PRODUCT_STATUS;
    operationLog: ProductOperationLog[];
}
