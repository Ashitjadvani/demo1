import { Injectable } from '@angular/core';
import { LoggedUser } from '../models/admin/logged-user';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { User, UserProfile } from '../models/admin/user';
import { UserDailyAccess } from '../models/admin/user-daily-access';
import { BaseResponse } from './base-response';
import { ApiService, buildRequest } from './api';
import { Person, PersonHistory , PERSON_SCOPE} from '../models/person';
import { UserAccount } from '../models/user-account';
import { PersonProfileGroup } from '../models/person-profile-group';
import { Area, Company, CompanyJustification, JustificationsSettings, Scope } from '../models/company';
import {RecruitingCandidateDocument} from "../models/admin/recruiting-candidate-document";
import { GreenPass, GreenPassValidation, GREENPASS_LEVEL } from '../models/greenpass';
import { CustomACQrCode } from '../models/custom-access-control-qr-code';
import { Document, UserDocument } from '../models/user-document';
import { Observable } from 'rxjs';
import { UserACQrCode } from '../models/user-access-control-qr-code';


export class UserCountResponse extends BaseResponse {
    usersCount: number;
}

export class PeopleGroupResponse extends BaseResponse {
    groups: PersonProfileGroup[];
}

export class PeopleResponse extends BaseResponse {
    people: Person[];
}

export class AccountResponse extends BaseResponse {
    accounts: UserAccount[];
}

export class CompanyResponse extends BaseResponse {
    company: Company;
}

export class DocumentResponse extends BaseResponse {
    document: Document;
}

export class DocumentsResponse extends BaseResponse {
    documents: Document[];
}

export class UserDocumentsResponse extends BaseResponse {
    documents: UserDocument[];
}

export class UserDocumentResponse extends BaseResponse {
    documents: UserDocument;
}

export class UserDocumentPathResponse extends BaseResponse {
    path: string;
}

export class GreenpassResponse extends BaseResponse {
    greenpasses: GreenPass[];
}

export class PersonHistoryResponse extends BaseResponse {
    history: PersonHistory[];
}

export class CompanyFunctionsResponse extends BaseResponse {
    functions: string[];
}

export class PersonActivitiesResponse extends BaseResponse {
    activities: any[];
}

export class QrCodeResponse extends BaseResponse {
    qrcode: string;
}

export class BadgeResponse extends BaseResponse {
    badge: UserACQrCode;
}

export class CustomQrCodeResponse extends BaseResponse {
    customQrCode: CustomACQrCode;
}

export class CustomQrCodeListResponse extends BaseResponse {
    customQrCodes: CustomACQrCode[];
}

export class UserQrCodeListResponse extends BaseResponse {
    userQrCodes: UserACQrCode[];
}


@Injectable({
    providedIn: 'root'
})
export class AdminUserManagementService {
    private loggedUser: LoggedUser;

    constructor(private apiService: ApiService) { }

    getToken() {
        if (!this.loggedUser)
            return null;

        return this.loggedUser.token;
    }

    async getUserInfo(userId: string): Promise<User> {
        let url = buildRequest(this.apiService.API.ADMIN.USER_INFO,
            {
                ':id': userId
            });
        return await this.apiService.get<User>(url).toPromise();
    }


    async registerUser(id: string, name: string, surname: string, profile: UserProfile, email: string, site: string, manager: string, password: string): Promise<BaseResponse> {
        let bodyRequest = {
            id: id,
            name: name,
            surname: surname,
            company: '',
            profile: profile,
            email: email,
            password: password,
            site: site,
            manager: manager
        };
        return this.apiService.post<BaseResponse>(this.apiService.API.ADMIN.USER_REGISTER, bodyRequest).toPromise();
    }

    async changePassword(email: string, oldPassword: string, newPassword: string) {
        let bodyRequest = {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        let ret = await this.apiService.post<any>(this.apiService.API.ADMIN.CHANGE_PASSWORD, bodyRequest).toPromise();
        return ret;
    }

    logout() {
        this.loggedUser = null;
        localStorage.removeItem("user_token");
        localStorage.removeItem("credentials");
    }

    async userList(userId: string): Promise<User[]> {
        let url = buildRequest(this.apiService.API.ADMIN.USER_LIST,
            {
                ':id': userId
            });
        return await this.apiService.get<User[]>(url).toPromise();
    }

    async deleteUser(userId: string): Promise<any> {
        let url = buildRequest(this.apiService.API.ADMIN.USER_DELETE,
            {
                ':id': userId
            });
        return await this.apiService.delete<any>(url).toPromise();
    }

    async deleteAllUsers(): Promise<any> {
        return await this.apiService.delete<any>(this.apiService.API.ADMIN.USERS).toPromise();
    }

    async updateUser(userUpdated: User): Promise<any> {
        console.log('call server: ' + userUpdated.name);
        let bodyRequest = userUpdated;
        let ret = await this.apiService.put<any>(this.apiService.API.ADMIN.USER_UPDATE, bodyRequest).toPromise();
        return ret;
    }

    async uploadUsers(file: File, isSafetyUsers: boolean): Promise<any> {
        let url = isSafetyUsers ? this.apiService.API.ADMIN.UPLOAD_SAFETY_USERS : this.apiService.API.BE.UPLOAD_USERS;
        return this.apiService.uploadFile(file, url).toPromise();
    }

    async uploadUsersList(users: any[], companyId: string): Promise<any> {
        let bodyRequest = {
            users: users,
            companyId: companyId
        };
        return this.apiService.post<BaseResponse>(this.apiService.API.BE.UPLOAD_USERS_LIST, bodyRequest).toPromise();
    }

    async downloadUsersList(companyId: string, scope: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.DOWNLOAD_USERS_LIST,
            {
                ':companyId': companyId,
                ':scope': scope
            });
        let ret = await this.apiService.get<any>(url).toPromise();
        return ret;
    }

    async storeUserDailyAccess(userDailyAccess: UserDailyAccess[]) {
        let ret = await this.apiService.post<any>(this.apiService.API.BE.USER_DAILY_ACCESS, userDailyAccess).toPromise();
        return ret;
    }

    async getUserDailyAccess(siteKey: string, userId: string) {
        let url = buildRequest(this.apiService.API.BE.GET_USER_DAILY_ACCESS,
            {
                ':siteKey': siteKey,
                ':userId': userId
            });
        let ret = await this.apiService.get<any>(url).toPromise();
        return ret;
    }

    async getUsersCount(): Promise<UserCountResponse> {
        return await this.apiService.get<UserCountResponse>(this.apiService.API.ADMIN.USERS_COUNT).toPromise();
    }

    async getAdminConfigured(): Promise<BaseResponse> {
        return await this.apiService.get<BaseResponse>(this.apiService.API.BE.GET_ADMIN).toPromise();
    }

    // PERSON PROFILE GROUP API
    async getPeopleGroups(companyId: string): Promise<PeopleGroupResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_GROUPS_BY_COMPANY,
            {
                ':companyId': companyId
            });
        return await this.apiService.get<PeopleGroupResponse>(url).toPromise();
    }

    async addPeopleGroup(peopleGroup: PersonProfileGroup): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.ADD_UPDATE_GROUP, peopleGroup).toPromise();
    }

    async updatePeopleGroup(peopleGroup: PersonProfileGroup): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.ADD_UPDATE_GROUP, peopleGroup).toPromise();
    }

    async deletePeopleGroup(groupId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_GROUP,
            {
                ':id': groupId
            });
        return await this.apiService.delete<BaseResponse>(url).toPromise();
    }

    async addPersonToGroup(groupId: string, personId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.UPDATE_GROUP_PERSON,
            {
                ':groupId': groupId,
                ':personId': personId
            });
        return await this.apiService.put<BaseResponse>(url, {}).toPromise();
    }

    async removePersonFromGroup(groupId: string, personId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.UPDATE_GROUP_PERSON,
            {
                ':groupId': groupId,
                ':personId': personId
            });
        return await this.apiService.delete<BaseResponse>(url).toPromise();
    }

    // PERSON API
    async getPeople(companyId: string): Promise<PeopleResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_PEOPLE_BY_COMPANY,
            {
                ':companyId': companyId
            });
        return await this.apiService.get<PeopleResponse>(url).toPromise();
    }

    async addOrUpdatePerson(person: Person): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.PERSON, person).toPromise();
    }

    async deletePerson(personId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_PERSON,
            {
                ':id': personId
            });

        return await this.apiService.delete<BaseResponse>(url).toPromise();
    }

    async getPersonHistory(personId: string): Promise<PersonHistoryResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_PERSON_HISTORY,
            {
                ':id': personId
            });

        return await this.apiService.get<PersonHistoryResponse>(url).toPromise();
    }

    async generateAccessControlQrCode(personId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.GENERATE_ACCESS_CONTROL_QR_CODE,
            {
                ':id': personId
            });

        return await this.apiService.get<BaseResponse>(url).toPromise();
    }

    async getUserKeys(personId: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_AVAILABLE_KEYS,
            {
                ':id': personId
            });

        return await this.apiService.get<any>(url).toPromise();
    }

    async generateCustomAccessControlQrCode(codeData: any, siteId: string, autoRenew: Boolean): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.GENERATE_CUSTOM_ACCESS_CONTROL_QR_CODE,
            {
                ':siteId': siteId
            });
        let body = {
            codeData: codeData,
            autoRenew: autoRenew
        }
        return await this.apiService.post<any>(url, body).toPromise();
    }
    
    async updateCustomAccessControlQrCode(code: CustomACQrCode): Promise<any> {
        return await this.apiService.post<any>(this.apiService.API.BE.UPDATE_CUSTOM_ACCESS_CONTROL_QR_CODE, code).toPromise();
    }

    async getCustomAccessControlQrCode(id: string): Promise<CustomQrCodeResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_CUSTOM_AC_QR_CODE,
            {
                ':id': id
            });

        return await this.apiService.get<CustomQrCodeResponse>(url).toPromise();
    }

    async listCustomAccessControlQrCode(): Promise<CustomQrCodeListResponse> {
        return await this.apiService.get<CustomQrCodeListResponse>(this.apiService.API.BE.LIST_CUSTOM_AC_QR_CODE).toPromise();
    }

    async listUserAccessControlQrCode(): Promise<UserQrCodeListResponse> {
        return await this.apiService.get<UserQrCodeListResponse>(this.apiService.API.BE.LIST_USER_AC_QR_CODE).toPromise();
    }
  
    async getUserAccessControlQrCode(userId: string): Promise<UserQrCodeListResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_AC_QR_CODE,
            {
                ':userId': userId
            });
        return await this.apiService.get<UserQrCodeListResponse>(url).toPromise();
    }

    async activateUserRing(gateId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ACTIVATE_USER_RING,
            {
                ':gateId': gateId
            });
        return await this.apiService.get<BaseResponse>(url).toPromise();
    }

    async getAccessControlQrCode(personId: string): Promise<QrCodeResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCESS_CONTROL_QR_CODE,
            {
                ':id': personId
            });

        return await this.apiService.get<QrCodeResponse>(url).toPromise();
    }
    
    async getAccessControlBadge(code: string): Promise<BadgeResponse> {
        let body = {
            code: code
        };

        return await this.apiService.post<BadgeResponse>(this.apiService.API.BE.GET_ACCESS_CONTROL_BADGE, body).toPromise();
    }
    
    async blockCustomAccessControlQrCode(codeId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.BLOCK_CUSTOM_AC_QR_CODE,
            {
                ':id': codeId
            });

        return await this.apiService.get<BaseResponse>(url).toPromise();
    }
        
    async deleteCustomAccessControlQrCode(codeId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_CUSTOM_AC_QR_CODE,
            {
                ':id': codeId
            });

        return await this.apiService.get<BaseResponse>(url).toPromise();
    }
        
    async blockUserAccessControlQrCode(codeId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.BLOCK_USER_AC_QR_CODE,
            {
                ':id': codeId
            });

        return await this.apiService.get<BaseResponse>(url).toPromise();
    }

    // ACCOUNT API
    async getAccounts(companyId: string): Promise<AccountResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_ACCOUNTS_BY_COMPANY,
            {
                ':companyId': companyId
            });
        return await this.apiService.get<AccountResponse>(url).toPromise();
    }

    async deleteAccount(accountId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_ACCOUNT,
            {
                ':id': accountId
            });
        return await this.apiService.delete<BaseResponse>(url).toPromise();
    }

    async addAccount(userAccount: UserAccount): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.ADD_USER_ACCOUNT, userAccount).toPromise();
    }

    async updateAccount(userAccount: UserAccount): Promise<BaseResponse> {
        return await this.apiService.put<BaseResponse>(this.apiService.API.BE.UPDATE_USER_ACCOUNT, userAccount).toPromise();
    }

    // GREENPASS API
    async getGreenpasses(userId: string): Promise<GreenpassResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_GREENPASSES_BY_USER,
            {
                ':userId': userId
            });
        return await this.apiService.get<GreenpassResponse>(url).toPromise();
    }

    async deleteGreenpass(greenpassId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_GREENPASS,
            {
                ':id': greenpassId
            });
        return await this.apiService.delete<BaseResponse>(url).toPromise();
    }

    async addGreenpass(greenpass: GreenPass): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.ADD_GREENPASS, greenpass).toPromise();
    }

    async updateGreenpass(greenpass: GreenPass): Promise<BaseResponse> {
        return await this.apiService.put<BaseResponse>(this.apiService.API.BE.UPDATE_GREENPASS, greenpass).toPromise();
    }

    async uploadGreenpass(file: File, userId: string, companyId: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.UPLOAD_GREENPASS,
            {
                ':userId': userId,
                ':companyId': companyId
            });
            console.log(url);
        return this.apiService.uploadFile(file, url).toPromise();
    }

    async validateGreenpass(greenpass: GreenPass, companyId: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.VALIDATE_GREENPASS,
            {
                ':companyId': companyId
            });
        return await this.apiService.post<any>(url, greenpass).toPromise();
    }

    
    async addGreenpassValidation(validation: GreenPassValidation): Promise<BaseResponse> {
        return await this.apiService.post<BaseResponse>(this.apiService.API.BE.ADD_GREENPASS_VALIDATION, validation).toPromise();
    }

    async deleteGreenpassValidation(greenpassValidationId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_GREENPASS_VALIDATION,
            {
                ':id': greenpassValidationId
            });
        return await this.apiService.delete<BaseResponse>(url).toPromise();
    }

    async getTodayUserGreenpassValidation(userId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_TODAY_USER_GREENPASS_VALIDATION,
            {
                ':userId': userId
            });
        return await this.apiService.get<BaseResponse>(url).toPromise();
    }

    // DOCUMENTS API
    async createUpdateDocument(doc: Document): Promise<DocumentResponse> {
        return await this.apiService.post<DocumentResponse>(this.apiService.API.BE.ADD_UPDATE_DOCUMENT, doc).toPromise();
    }    
    
    async getCompanyDocuments(companyId: string): Promise<DocumentsResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_COMPANY_DOCUMENTS,
            {
                ':companyId': companyId
            });
        return await this.apiService.get<DocumentsResponse>(url).toPromise();
    }

    // USER DOCUMENTS API

    async addUpdateUserDocument(doc: UserDocument): Promise<UserDocumentResponse> {
        return await this.apiService.post<UserDocumentResponse>(this.apiService.API.BE.ADD_UPDATE_USER_DOCUMENT, doc).toPromise();
    }  

    async getUserDocuments(userId: string): Promise<UserDocumentsResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_DOCUMENTS,
            {
                ':userId': userId
            });
        return await this.apiService.get<UserDocumentsResponse>(url).toPromise();
    }

    async listDeletedUserDocuments(): Promise<UserDocumentsResponse> {
        return await this.apiService.get<UserDocumentsResponse>(this.apiService.API.BE.LIST_DELETED_USER_DOCUMENTS).toPromise();
    }

    // COMPANY API
    async getCompany(companyId: string): Promise<CompanyResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_COMPANY,
            {
                ':id': companyId
            });
        return await this.apiService.get<CompanyResponse>(url).toPromise();
    }

    async updateCompany(company: Company): Promise<CompanyResponse> {
        return await this.apiService.put<CompanyResponse>(this.apiService.API.BE.UPDATE_COMPANY, company).toPromise();
    }

    async getCompanyFunctions(): Promise<CompanyFunctionsResponse> {
        return await this.apiService.get<CompanyFunctionsResponse>(this.apiService.API.BE.GET_COMPANY_FUNCTIONS).toPromise();
    }

    async getUserActivities(userId: string, dateFrom: string, dateTo: string): Promise<PersonActivitiesResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_ACTIVITIES,
            {
                ':id': userId,
                ':dateFrom': dateFrom,
                ':dateTo': dateTo
            });
        return await this.apiService.get<PersonActivitiesResponse>(url).toPromise();
    }

    addCompanyJustification(companyId: string, justification: CompanyJustification): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_JUSTIFICATION,
            {
                ':id': companyId
            });
        return this.apiService.post<BaseResponse>(url, justification).toPromise();
    }
    
    sendHtmlMailWithAttachments(to: string, subject: string, mailHtml: string, docName: string, ): Promise<BaseResponse> {
        let body = {
            to: to,
            subject: subject,
            mailHtml: mailHtml,
            docName: docName
        }
        return this.apiService.post<BaseResponse>(this.apiService.API.BE.SEND_HTML_MAIL_WITH_ATTACHMENTS, body).toPromise();
    }

    updateCompanyJustification(companyId: string, justificationId: string, justification: CompanyJustification): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.COMPANY_JUSTIFICATION,
            {
                ':id': companyId,
                ':justificationId': justificationId
            });
        return this.apiService.put<BaseResponse>(url, justification).toPromise();
    }

    deleteCompanyJustification(companyId: string, justificationId: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.COMPANY_JUSTIFICATION,
            {
                ':id': companyId,
                ':justificationId': justificationId
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    addCompanyScope(companyId: string, scope: Scope): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_SCOPE,
            {
                ':id': companyId
            });
        return this.apiService.post<BaseResponse>(url, scope).toPromise();
    }

    updateCompanyScope(companyId: string, scopeName: string, scope: Scope): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.COMPANY_SCOPE,
            {
                ':id': companyId,
                ':scopeName': scopeName
            });
        return this.apiService.put<BaseResponse>(url, scope).toPromise();
    }

    deleteCompanyScope(companyId: string, scopeName: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.COMPANY_SCOPE,
            {
                ':id': companyId,
                ':scopeName': scopeName
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    addCompanyRole(companyId: string, role: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_ROLE,
            {
                ':id': companyId,
                ':role': role
            });
        return this.apiService.post<BaseResponse>(url, role).toPromise();
    }

    updateCompanyRole(companyId: string, roleName: string, role: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.UPDATE_COMPANY_ROLE,
            {
                ':id': companyId,
                ':roleName': roleName,
                ':role': role
            });
        return this.apiService.put<BaseResponse>(url, role).toPromise();
    }

    deleteCompanyRole(companyId: string, roleName: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_COMPANY_ROLE,
            {
                ':id': companyId,
                ':roleName': roleName
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    addCompanyJobTitle(companyId: string, jobTitle: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_JOBTITLE,
            {
                ':id': companyId,
                ":jobTitle": jobTitle
            });
        return this.apiService.post<BaseResponse>(url, jobTitle).toPromise();
    }

    updateCompanyJobTitle(companyId: string, jobTitleName: string, jobTitle: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.UPDATE_COMPANY_JOBTITLE,
            {
                ':id': companyId,
                ':jobTitleName': jobTitleName,
                ':jobTitle': jobTitle
            });
        return this.apiService.put<BaseResponse>(url,jobTitle).toPromise();
    }

    deleteCompanyJobTitle(companyId: string, jobTitleName: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_COMPANY_JOBTITLE,
            {
                ':id': companyId,
                ':jobTitleName': jobTitleName
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    addCompanyArea(companyId: string, area: Area): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_AREA,
            {
                ':id': companyId
            });
        return this.apiService.post<BaseResponse>(url, area).toPromise();
    }

    updateCompanyArea(companyId: string, areaName: string, area: Area): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.COMPANY_AREA,
            {
                ':id': companyId,
                ':areaName': areaName
            });
        return this.apiService.put<BaseResponse>(url, area).toPromise();
    }

    deleteCompanyArea(companyId: string, areaName: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.COMPANY_AREA,
            {
                ':id': companyId,
                ':areaName': areaName
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

    addCompanyDirection(companyId: string, direction: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.ADD_COMPANY_DIRECTION,
            {
                ':id': companyId,
                ':direction': direction
            });
        return this.apiService.post<BaseResponse>(url, direction).toPromise();
    }

    updateCompanyDirection(companyId: string, directionName: string, direction: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.UPDATE_COMPANY_DIRECTION,
            {
                ':id': companyId,
                ':directionName': directionName,
                ':direction': direction
            });
        return this.apiService.put<BaseResponse>(url, direction).toPromise();
    }

    deleteCompanyDirection(companyId: string, directionName: string): Promise<BaseResponse> {
        let url = buildRequest(this.apiService.API.BE.DELETE_COMPANY_DIRECTION,
            {
                ':id': companyId,
                ':directionName': directionName
            });
        return this.apiService.delete<BaseResponse>(url).toPromise();
    }

}
