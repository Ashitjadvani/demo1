import { User } from "./admin/user";

export enum CONTROL_TYPE {
    BUTTON = "button",
    BUTTON_LIST = "buttonlist",
    MULTISELECT = "multiselect"
}

export class WorkflowTemplateAction {
    id: string;
    text: string;
    stageParameters: any;
    nextState: string;
}

export class WorkflowUserInstanceLog {
    timestamp: Date;
    id: string;
    data: any;
}

export class WorkflowUserInstance {
    id: string;
    userId: string;
    templateId: string;
    title: string;
    actions: WorkflowTemplateAction[];
    currentState: string;
    startedAt: Date;
    contextData: any;
    logs: WorkflowUserInstanceLog[];
    userInfo: User[];

    static getAction(workflowUserInstance: WorkflowUserInstance, actionId: string) {
        return workflowUserInstance.actions.find(act => act.id == actionId);
    }

    static filterMatch(data: WorkflowUserInstance, filter: string): boolean {
        try {
            if (filter) {
                let lowerFilter = filter.toLocaleLowerCase();
                let currentStatus = data.contextData && data.contextData.closed ? 'closed' : 'open';

                return currentStatus.includes(lowerFilter) ||
                    (data.userInfo[0].name && data.userInfo[0].name.toLocaleLowerCase().includes(lowerFilter)) ||
                    (data.userInfo[0].surname && data.userInfo[0].surname.toLocaleLowerCase().includes(lowerFilter)) ||
                    (data.contextData && data.contextData.text && data.contextData.text.toLocaleLowerCase().includes(lowerFilter));
            }
        } catch (ex) {
            console.log('WorkflowUserInstance.filterMatch exception: ', ex);
        }
        return false;
    }
}

export class WorkflowTemplateActionDef {
    id: string;
    text: string;
    stageParameters: any;
    nextState: string;
    runEvents: string[];
}

export class WorkflowTemplateState {
    id: string;
    actions: WorkflowTemplateActionDef[];
}

export class WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    authorId: string;
    global: any;
    states: WorkflowTemplateState[];
    createdAt: Date;

    static Clone(workflowTemplate: WorkflowTemplate) {
        return Object.assign({}, workflowTemplate);
    }
}