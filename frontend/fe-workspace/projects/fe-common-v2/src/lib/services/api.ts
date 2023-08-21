import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, retry } from 'rxjs/operators';
import { SessionManagementService } from './session-management.service';
import { Configurations } from '../configurations';
import { CommonService } from './common.service';
import { T } from "@angular/cdk/keycodes";

export interface ApiParam {
    paramname: string;
    paramvalue: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public API = {
        // AUTH
        AUTH: {
            LOGIN: "/auth/login"
        },

        ACCOUNT: {
            LOGIN: "/v2/user-manager/account/login",
            LOGINRESETPASSWORD: "/v2/user-manager/account/login-reset-password",
            ForgotPassword: "/v2/user-manager/account/forgot-password",
            ResetPassword: "/v2/user-manager/account/reset-password",
        },

        // ADMIN
        ADMIN: {
            // USER MANAGEMENT API
            USER_REGISTER: "/user/register",
            USER_LIST: "/user/list/:id",
            USER_DELETE: "/user/:id",
            USER_INFO: "/user/:id",
            CHANGE_PASSWORD: "/user/change-password",
            USER_UPDATE: "/user",
            UPLOAD_USERS: "/users/upload",
            UPLOAD_USERS_LIST: "/users/uploadlist",
            UPLOAD_SAFETY_USERS: "/users/upload/safetyroles",
            USERS: "/users",
            USERS_COUNT: "/users/count"
        },

        // BE
        BE: {
            // BOOK-REQUEST-MANAGEMENT
            USER_REQUEST_BOOK: "/v2/user-request-book",
            TRACK_USER_PLAN_ACTIVITY: "/v2/user-plan-activity",
            GET_USER_REQUEST_BOOK: "/v2/get-user-request-book/:site/:id",
            GET_USER_DAILY_INFO: "/v2/user-daily-info/:id",
            TRACK_USER_ACTIVITY: "/v2/user-activity/track",

            GET_USER_REQUEST_BOOK_BY_DATE: "/v2/get-user-request-book/:id/date/:date",
            DELETE_USER_PLANS_BY_DATE_RANGE: "/v2/update/user-plans/:siteKey/:startDate/:endDate",

            // USER-ACTIVITY
            GET_USER_ACTIVITY: "/v2/user-activity/:id",
            GET_USER_ACTIVITY_BY_DATE: "/v2/user-activity/:id/:date",
            DELETE_USER_ACTIVITY: "/v2/user-activity/:id/:date",

            // USER-AREAS
            GET_USER_AREAS: "/v2/user/areas/:siteKey",
            GET_DEPARTMENT_USERS: "/v2/department/:departmentId/users",

            // USER HOME DATA
            GET_USER_HOME_DATA: "/v2/home/:userId",
            GET_USER_HOME_TILES: "/v2/home/tiles/:userId/:lang",

            GET_USER_HIERARCHY: "/v2/user/hierarchy/:userId",
            GET_USER_DEPARTMENT: "/v2/user/department/:userId",
            USER_HAS_OFFICE_RESERVATION: "/v2/user/office/reservation/:userId/:siteKey",

            // USER CALENDAR DATA
            GET_USER_CALENDAR_DATA: "/v2/user/calendar/:siteKey/:userId/:year/:month",
            GET_USER_PLAN_DATA: "/v2/user/plan/:year/:month",

            // SITE MANAGEMENT API
            SITE_LIST: "/v2/site-list",
            SITE_KEY: "/v2/site/:key",
            SITE: "/v2/site",
            UPLOAD_SITES: "/v2/sites/upload",

            // SITE-DAILY-STATUS
            SITE_DAILY_STATUS: "/v2/site-daily-status",
            GET_SITE_DAILY_STATUS: "/v2/site-daily-status/:siteKey",
            UPDATE_SITE_DAILY_STATUS_CAP: "/v2/site-daily-status/capacity/:siteKey/:date",

            // SITE CAPACITY TIMEFRAMES
            SITE_CAPACITY_TIMEFRAME: "/v2/site-capacity-rages/:siteKey",

            // USER-DAILY-ACCESS
            USER_DAILY_ACCESS: "/v2/user-daily-access",
            GET_USER_DAILY_ACCESS: "/v2/user-daily-access/:siteKey/:userId",

            // SITE STATISTICS
            SITE_DAILY_STATISTICS: "/v2/site/statistics/:siteKey/:date",
            USER_DAILY_ACTIVITIES: "/v2/users/statistics/activities/:date",
            SITE_PRESENCE_STATS: "/v2/site/statistics/presence/:siteKey/:startDate/:endDate",

            // NEWS
            NEWS_UPLOAD: "/v2/news/upload",
            NEWS_DOCLIST: "/v2/news/:userId",
            NEWS_DOC: "/v2/news/:id",
            NEWS_ACTION: "/v2/news/action/:id",
            NEWS_DOWNLOAD: "/v2/news/download/:id",

            // USER/TEAM/DEPARTMENT STATISTICS
            USER_STATISTICS: "/v2/user/statistics/:period/:siteKey/:userId",
            TEAM_STATISTICS: "/v2/team/statistics/:period/:siteKey/:userId",
            DEPARTMENT_STATISTICS: "/v2/department/statistics/:period/:siteKey/:userId",
            CSV_TEAM_STATISTICS: "/v2/csv/team/statistics/:userId/:dateFrom/:dateTo",
            USER_STATISTICS_DAILY: "/v2/statistics/:userId/:dateFrom/:dateTo",
            TEAM_WEEKLY_STATISTICS: "/v2/team/weekly/statistics/:siteKey/:userId/:dateFrom/:dateTo",
            DEPARTMENT_WEEKLY_STATISTICS: "/v2/department/weekly/statistics/:siteKey/:userId/:dateFrom/:dateTo",
            DEPARTMENT_WEEKLY_STATISTICS_BY_AREA: "/v2/department/weekly/statistics/:departmentId/:dateFrom/:dateTo",
            GLOBAL_STAT_ACTIVITY: "/v2/global/statistics/activity/:date",
            CSV_DEPARTMENT_STATISTICS_DAILY: "/v2/csv/department/statistics/:departmentId/:dateFrom/:dateTo",
            USERS_DAILY_STATISTICS: "/v2/users/daily/statistics/:dateFrom/:dateTo",
            USERS_DAILY_STATISTICS_BY_SITE: "/v2/users/daily/statistics/:siteKey/:dateFrom/:dateTo",
            CSV_SINGLE_USER_STATISTICS_DAILY: "/v2/csv/user/statistics/:userId/:dateFrom/:dateTo",
            SINGLE_USER_STATISTICS_DAILY: "/v2/single/user/statistics/:userId/:dateFrom/:dateTo",
            SAFETY_USERS_DAILY: "/v2/safety/users/daily/:dateFrom/:dateTo",
            BOARD_DIRECTORS_USER_STATS: "/v2/board/directors/statistics/:dateFrom/:dateTo",
            APM_SITE_STATS: "/v2/apm/statistics/:dateFrom/:dateTo",
            APM_SITE_STATS_CSV: "/v2/apm/statistics/csv/:dateFrom/:dateTo",

            // USER HEALTH
            USER_TEAM_HEALTH: "/v2/user/team/health",

            // LOGGING EVENT
            LOG_EVENT: "/v2/log/event",
            GET_LOG_EVENTS: "/v2/log/events",

            // SAFETY
            GET_SAFETY: "/v2/safety/:siteKey",

            // SCHEDULER
            GET_SCHEDULE_EVENTS: "/v2/scheduler/events",
            ADD_SCHEDULE_EVENT: "/v2/scheduler/event",
            UPDATE_SCHEDULE_EVENTS: "/v2/scheduler/event/:id",
            DELETE_SCHEDULE_EVENTS: "/v2/scheduler/event/:id",

            // WORKFLOW
            GET_WORKFLOW_TEMPLATES: "/v2/workflow/templates",
            UPDATE_WORKFLOW_TEMPLATE: "/v2/workflow/update/template",
            GET_WORKFLOW_INSTANCES: "/v2/workflow/instances",
            GET_ALL_WORKFLOW_INSTANCES: "/v2/workflow/instances/all",
            GET_USER_WORKFLOW_INSTANCES: "/v2/workflow/user/instances/:id",
            CREATE_WORKFLOW_INSTANCE: "/v2/workflow/create/instance/:userId/:templateId/:startAt",
            DELETE_WORKFLOW_INSTANCE: "/v2/workflow/delete/instance/:workflowId",
            EXEC_WORKFLOW_ACTION: "/v2/workflow/:workflowId/user/:userId/execute/:actionId",
            UPLOAD_WORKFLOW_INSTANCE: "/v2/workflow/instance/upload",

            // PROFILE-SETTINGS
            SETTINGS: "/v2/settings",
            SETTINGS_BY_ID: "/v2/settings/:id",
            EMAIL_CONFIGURATION: "/v2/user-manager/company",

            // ACTION-TILES
            ACTION_TILES: "/v2/action-tiles",
            UPDATE_ACTION_TILE: "/v2/action-tile",

            // RESERVATION
            GET_RESERVATION_SITE: "/v2/reservation/sites",
            UPDATE_RESERVATION_SITE: "/v2/reservation/site",
            DELETE_RESERVATION_SITE: "/v2/reservation/site/:id",
            GET_RESERVATION_ITEMS: "/v2/reservation/site/:id/items",
            UPDATE_RESERVATION_ITEM: "/v2/reservation/site/item",
            DELETE_RESERVATION_ITEM: "/v2/reservation/item/:id",
            USER_RESERVATION: "/v2/user/reservation/item/:id/:userId",
            USER_MANUAL_RESERVATION: "/v2/user/reservation/manual/:siteId/:date/:userId",
            USER_SITE_RESERVATION: "/v2/user/reservation/site/:id/:userId",
            CHECK_USER_SITE_RESERVATION: "/v2/check/user/reservation/site/:userId",
            CHECK_USER_ITEM_RESERVATION: "/v2/check/user/reservation/item/:userId",
            CSV_USER_SITE_PRERESERVATION: "/v2/csv/user/pre-reservation/site",
            CSV_USER_SITE_RESERVATION: "/v2/csv/user/reservation/site/:id",
            SITE_AVAILABLE: "/v2/reservation/site/available/:id",

            // BOOKABLE RESOURCES
            GET_BOOKABLE_RESOURCE_TYPES: "/v2/booking/resource/types",
            ACTION_BOOKABLE_RESOURCE_TYPE: "/v2/booking/resource/type",
            DELETE_BOOKABLE_RESOURCE_TYPE: "/v2/booking/resource/type/:id",
            GET_BOOKABLE_RESOURCES: "/v2/booking/resources/:type",
            ACTION_BOOKABLE_RESOURCE: "/v2/booking/resource",
            DELETE_BOOKABLE_RESOURCE: "/v2/booking/resource/:id",
            DELETE_BOOKABLE_MULTIPLE_RESOURCE: "/v2/booking/resource/delete",
            BOOKABLE_RESOURCE_UPLOAD_CSV: "/v2/booking/resource/upload/:type",
            GET_RESOURCE_STATUS: "/v2/booking/resource/status/:date/:resourceType",
            RESERVE_RESOURCE_SLOT: "/v2/booking/reserve/:resourceType/resource/:id/slot/:slot/date/:date",
            RESERVE_USER_RESOURCE_SLOT: "/v2/booking/reserve/:resourceType/resource/:id/slot/:slot/date/:date/user/:userId",
            RESOURCE_RESERVATION_STATUS: "/v2/booking/resource/reservation/status/:date/:resourceType/:resourceId",
            RESOURCE_AVAILABLE: "/v2/booking/resource/type/available/:resourceType",
            RESOURCE_SEARCH_AVAILABILITY: "/v2/booking/resource/search/availability",
            RESERVE_RESOURCE_TIMEFRAME: "/v2/booking/reserve/:resourceType/resource/:resourceId/timeframe",
            GET_USER_RESOURCE_RESERVATIONS: "/v2/booking/resource/reservations/:startDate/:endDate",
            RESOURCE_RESERVATION_TIMEFRAME: "/v2/booking/resource/reservations/:reservationId/:timeframeId",
            USER_RESOURCE_INTERACTION: "/v2/booking/interact/:resourceId",
            USER_RESOURCE_ACTION: "/v2/booking/resource/:resourceId/action",
            CURRENT_RESOURCE_STATUS: "/v2/booking/resource/:resourceId/status/:date",
            GET_BOOKABLE_RESOURCE_TYPE: "/v2/booking/resource/type/:id",
            GET_GROUP_BOOKABLE_RESOURCES: "/v2/booking/resources/:type/group/:groupId",
            GET_RESOURCE_BY_CODE: "/v2/booking/resource/:code",
            RESOURCE_TYPE_LIST: "/v2/booking/resource/list-resource-type",
            RESOURCE_TYPE_DELETE: "/v2/booking/resource/delete-resource-type",
            RESOURCE_TYPE_ADD_EDIT: "/v2/booking/resource/add-edit-resource-type",
            RESOURCE_TYPE_GET_BY_ID: "/v2/booking/resource/view-resource-type",


            // TOUCHPOINT
            TOUCHPOINT_KEEP_ALIVE: "/v2/touchpoint/keep-alive",
            TOUCHPOINT_KEEP_ALIVE_LEGACY: "/v2/touchpoint/keep-alive/legacy",
            TOUCHPOINT_LIST: "/v2/touchpoint/list",
            TOUCHPOINT_SETTINGS: "/v2/touchpoint/settings",
            TOUCHPOINT_PAIR: "/v2/touchpoint/pair",
            TOUCHPOINT_REGISTER: "/v2/touchpoint/register",
            TOUCHPOINT_CHECK_PAIR: "/v2/touchpoint/check-pair",
            TOUCHPOINT_DELETE: "/v2/touchpoint/:id",
            TOUCHPOINT_AUTH: "/v2/touchpoint/auth/:id",
            TOUCHPOINT_UNLOCK_PAIR: "/v2/touchpoint/unlock/:id",

            // SURVEY
            GET_SURVEY: "/v2/survey/:id",
            GET_SURVEY_RESULTS: "/v2/survey/results/:id",
            USER_SURVEY_ACTION: "/v2/survey/:id/user/action/:action",
            SUBMIT_SURVEY: "/v2/survey/:id/submit",
            SURVEY_USER_ENABLED: "/v2/survey/:id/user/enabled",
            GET_SURVEY_CSV: "/v2/survey/results/csv/:id",
            ADD_SURVEY: "/v2/mqs-quiz/quiz-create",
            VIEW_SURVEY: "/v2/mqs-quiz/quiz/view",
            // MATRIX
            MATRIX_LIST: "/v2/mqs-quiz/metric/list",
            ADD_MATRIX: "/v2/mqs-quiz/metric/save",
            DELETE_MATRIX: "/v2/mqs-quiz/metric/delete",
            VIEW_MATRIX: "/v2/mqs-quiz/metric/view",
            //QUIZ
            QUIZ_LISTING: '/v2/mqs-questions/list',
            QUIZ_QUESTION_DELETE: '/v2/mqs-questions/delete',
            VIEW_QUIZ_DEATILS: "/v2/mqs-questions/view",
            ADD_QUESTION: '/v2/mqs-questions/create',
            // ADD_QUESTION: '/v2/mqs-quiz/quiz-create',


            // SUSTAINABILITY
            SUSTAINABILITY_TRANS_TYPE: "/v2/sustainability/transport-type",
            GET_SUSTAINABILITY_TRANS_TYPES: "/v2/sustainability/transport-types",
            DEL_SUSTAINABILITY_TRANS_TYPE: "/v2/sustainability/transport-type/:id",
            USER_HABIT: "/v2/sustainability/user/habit",
            GET_ALL_USERS_HABITS: "/v2/sustainability/all/users/habits",
            GET_ALL_USERS_HABITS_STATS: "/v2/sustainability/user/habit/statistics",
            GET_VIEW_SUMMARY: "/v2/sustainability/view/summary",

            // PERSON GROUPS/PROFILES
            GET_GROUPS_BY_COMPANY: "/v2/user-manager/group/:companyId",
            GET_GROUPS_LIST_BY_COMPANY_: "/v2/user-manager/groupList/:companyId",
            ADD_UPDATE_GROUP: "/v2/user-manager/group",
            DELETE_GROUP: "/v2/user-manager/group/:id",
            UPDATE_GROUP_PERSON: "/v2/user-manager/group/:groupId/person/:personId",
            GROUP_ADD_PEOPLE: "/v2/user-manager/group/:id",
            GROUP_EDIT_PEOPLE: "/v2/user-manager/view/group",

            // PERSON
            GET_PEOPLE: "/v2/user-manager/person/all",
            GET_PEOPLE_WAITING_ACCOUNT: "/v2/user-manager/person/waiting-account",
            GET_PEOPLE_BY_COMPANY: "/v2/user-manager/person/:companyId",
            PERSON: "/v2/user-manager/person",
            DELETE_PERSON: "/v2/user-manager/person/:id",
            GET_PERSON_HISTORY: "/v2/user-manager/person/:id/history",
            GET_PERSON_FOR_EDIT: "/v2/user-manager/view/person",
            GET_PERSON_ACCOUNT_FOR_EDIT: "/v2/user-manager/view/account",

            // ACCOUNT
            GET_ADMIN: "/v2/user-manager/admin",
            GET_ACCOUNTS_BY_COMPANY: "/v2/user-manager/accounts/:companyId",
            DELETE_ACCOUNT: "/v2/user-manager/account/:id",
            ADD_USER_ACCOUNT: "/v2/user-manager/account/add",
            UPDATE_USER_ACCOUNT: "/v2/user-manager/account/update",
            // UPLOAD_USERS: "/v2/user-manager/users/upload",
            UPLOAD_USERS: "/v2/user-manager/import/accounts",
            // UPLOAD_USERS_LIST: "/v2/user-manager/users/listupload",
            UPLOAD_USERS_LIST: "/v2/user-manager/users/people/import",
            DOWNLOAD_USERS_LIST: "/v2/user-manager/users/listdownload/:companyId/:scope",

            // GREENPASS
            GET_GREENPASSES: "/v2/user-manager/greenpass/all",
            GET_GREENPASSES_BY_USER: "/v2/user-manager/greenpass/:userId",
            DELETE_GREENPASS: "/v2/user-manager/greenpass/:id",
            ADD_GREENPASS: "/v2/user-manager/greenpass/add",
            UPDATE_GREENPASS: "/v2/user-manager/greenpass/update",
            UPLOAD_GREENPASS: "/v2/user-manager/greenpass/upload-document/:userId/:companyId",
            VALIDATE_GREENPASS: "/v2/user-manager/greenpass/validate/:companyId",

            GET_TODAY_USER_GREENPASS_VALIDATION: "/v2/user-manager/greenpass/validations/today/:userId",
            ADD_GREENPASS_VALIDATION: "/v2/user-manager/greenpass/validations/today",
            DELETE_GREENPASS_VALIDATION: "/v2/user-manager/greenpass/validations/:id",

            // SITE
            GET_SITES: "/v2/site-manager/sites",
            GET_FULL_SITE_LIST: "/v2/site-manager/company-sites",
            ADD_UPDATE_SITE: "/v2/site-manager/site",
            VIEW_UPDATE_SITE: "/v2/site-manager/site/view",
            DELETE_SITE: "/v2/site-manager/site/:id",

            // COMPANY
            GET_COMPANY: "/v2/user-manager/company/:id",
            UPDATE_COMPANY: "/v2/user-manager/company",
            GET_COMPANY_FUNCTIONS: "/v2/user-manager/company/functions",
            GET_COMPANY_FUNCTIONS_BY_GROUPS: "/v2/user-manager/company/functions-by-groups",
            ADD_COMPANY_JUSTIFICATION: "/v2/user-manager/company/:id/justification",
            COMPANY_JUSTIFICATION: "/v2/user-manager/company/:id/justification/:justificationId",
            ADD_COMPANY_SCOPE: "/v2/user-manager/company/:id/scope",
            COMPANY_SCOPE: "/v2/user-manager/company/:id/scope/:scopeName",
            ADD_COMPANY_AREA: "/v2/user-manager/company/:id/area",
            EDIT_COMPANY_AREA: "/v2/user-manager/company/:id/edit/area/:areaName",
            ADD_AREA_SCOPE_LIST: "/v2/user-manager/company/scope/list",
            COMPANY_AREA: "/v2/user-manager/company/:id/area/:areaName",
            ADD_COMPANY_ROLE: "/v2/user-manager/company/:id/role/:role",
            UPDATE_COMPANY_ROLE: "/v2/user-manager/company/:id/role-update/:roleName/:role",
            DELETE_COMPANY_ROLE: "/v2/user-manager/company/:id/role-delete/:roleName",
            ADD_COMPANY_JOBTITLE: "/v2/user-manager/company/:id/jobTitle/:jobTitle",
            UPDATE_COMPANY_JOBTITLE: "/v2/user-manager/company/:id/jobTitle-update/:jobTitleName/:jobTitle",
            DELETE_COMPANY_JOBTITLE: "/v2/user-manager/company/:id/jobTitle-delete/:jobTitleName",
            ADD_COMPANY_DIRECTION: "/v2/user-manager/company/:id/direction/:direction",
            UPDATE_COMPANY_DIRECTION: "/v2/user-manager/company/:id/direction-update/:directionName/:direction",
            DELETE_COMPANY_DIRECTION: "/v2/user-manager/company/:id/direction-delete/:directionName",
            VIEW_AREA_DETAILS: "/v2/user-manager/company/:id/area/:areaName/view",

            // CALENDAR
            GET_CALENDAR: "/v2/calendar/user/:year/:month",
            UPDATE_CALENDAR: "/v2/calendar/event/:calendarId/:date",

            // NEWS
            ALERT_UPLOAD: "/v2/alert/upload",
            ALERT_EDIT: '/v2/alert/edit',
            ALERT_DOCLIST: "/v2/alert/:userId",
            ALERT_LISTALL: "/v2/alert-list",
            ALERT_DOC: "/v2/alert/:id",
            ALERT_ACTION: "/v2/alert/action/:id",
            ALERT_DOWNLOAD: "/v2/alert/download/:id",


            // Ticket Generate
            TICKET_UPLOAD: "/v2/ticket/upload",
            TICKET_DOCLIST: "/v2/ticket/:userId",
            TICKET_LISTALL: "/v2/tickets",
            TICKET_DOC: "/v2/ticket/:id",
            TICKET_ACTION: "/v2/ticket/action/:id",
            TICKET_DOWNLOAD: "/v2/ticket/download/:id",

            // Recruiting Dashboard
            RECRUITING_DASHBOARD_MANAGEMEN: '/v2/mqs-recruiting/dashboard',

            // Recruiting Management Opening
            RECRUITING_OPENING_LISTING: "/v2/mqs-recruiting/job-listing",
            RECRUITING_OPENING_CREATE: "/v2/mqs-recruiting/job-create",
            RECRUITING_DATA_STORAGE_UPLOAD: "/v2/data-storage/upload",
            RECRUITING_DATA_STORAGE_UPLOAD_DEFAULT: "/v2/data-storage/upload-default",
            RECRUITING_DATA_STORAGE_IMAGE: "/v2/data-storage/image",
            RECRUITING_DATA_STORAGE_DETAILS: "/v2/data-storage/details",
            RECRUITING_DATA_STORAGE_DEFAULT_IMAGE: "/v2/data-storage/default-image",
            RECRUITING_DATA_STORAGE_DOWNLOAD: "/v2/data-storage/download/:id",
            RECRUITING_OPENING_DELETE: "/v2/mqs-recruiting/job-delete",
            RECRUITING_OPENING_QUIZ_LISTING: "/v2/mqs-quiz/quiz-list",
            RECRUITING_OPENING_QUIZ_DELETE: "/v2/mqs-quiz/quiz-delete",
            RECRUITING_DASHBOARD_LISTING: "/v2/mqs-dashboard/list",
            RECRUITING_OPENING_QUIZ_JOB_LISTING: "/v2/mqs-quiz/survey/question/list",
            RECRUITING_OPENING_CUSTOMFIELD_JOB_LISTING: "/v2/mqs-quiz/quiz-job-list-custom-field",
            RECRUITING_OPENING_JOB_VIEW: "/v2/mqs-recruiting/job-view",
            RECRUITING_OPENING_QRCODE_CREATE: "/v2/mqs-recruiting/qrcode-create",
            RECRUITING_OPENING_QRCODE_PARAM_URL: "/legance/job-details/##ID##",

            RECRUITING_OPENING_HISTORY_LISTING: "/v2/mqs-recruiting/history-listing",

            RECRUITING_DASHBOARD_SCOPES_LIST: '/v2/user-manager/company/scope',
            RECRUITING_DASHBOARD_EVENT_TYPE_LIST: '/v2/user-manager/company/event/type/:id',
            RECRUITING_DASHBOARD_EVENT_TYPE_DELETE: '/v2/user-manager/company/:id/justification/:justificationId',
            RECRUITING_DASHBOARD_DISPUTE_TYPE_LIST: '/v2/user-manager/company/:id/disputeList',
            RECRUITING_DASHBOARD_ADD_DISPUTE_TYPE_LIST: "/v2/user-manager/company/:id/dispute/add",
            RECRUITING_DASHBOARD_DELETE_DISPUTE: "/v2/user-manager/company/:id/dispute-delete/:disputeName",
            RECRUITING_DASHBOARD_EDIT_DISPUTE: "/v2/user-manager/company/:id/dispute-update/:disputeName",

            //MASTER_COST_CENTER_TYPE
            MASTER_COST_CENTER_TYPE_ADD: '/v2/event-manager/cost-center-type/add',
            MASTER_COST_CENTER_TYPE_EDIT: '/v2/event-manager/cost-center-type/edit',
            MASTER_COST_CENTER_TYPE_LIST: '/v2/event-manager/cost-center-type/list',
            MASTER_COST_CENTER_TYPE_DELETE: '/v2/event-manager/cost-center-type/delete',
            MASTER_COST_CENTER_TYPE_MULTIPLE_DELETE: '/v2/event-manager/delete/cost-center-type',

            //DOCUMENT_TYPE
            MASTER_DOCUMENT_TYPE_ADD: '/v2/event-manager/document-type/add',
            MASTER_DOCUMENT_TYPE_EDIT: '/v2/event-manager/document-type/edit',
            MASTER_DOCUMENT_TYPE_LIST: '/v2/event-manager/document-type/list',
            MASTER_DOCUMENT_TYPE_DELETE: '/v2/event-manager/document-type/delete',
            MASTER_DOCUMENT_TYPE_MULTIPLE_DELETE: '/v2/event-manager/delete/document-type',

            //STAFF_DOCUMENT_LIST
            MASTER_STAFF_DOCUMENT_LIST: '/v2/user-manager/documents/list/',
            MASTER_STAFF_DOCUMENT_ADD: '/v2/user-manager/documents/document',
            MASTER_STAFF_DOCUMENT_EDIT: '/v2/user-manager/staff-document/edit',
            MASTER_STAFF_DOCUMENT_DELETE: '/v2/user-manager/staff-document/delete',
            MASTER_STAFF_DOCUMENT_MULTIPLE_DELETE: '/v2/user-manager/documents/delete',
            MASTER_STAFF_DOCUMENT_VIEW: '/v2/user-manager/documents/document/view',

            RECRUITING_DASHBOARD_UNIVERSITY_LIST: "/v2/mqs-dashboard/university/list",
            RECRUITING_DASHBOARD_UNIVERSITY_SAVE: "/v2/mqs-dashboard/university/save",
            RECRUITING_DASHBOARD_UNIVERSITY_DELETE: "/v2/mqs-dashboard/university/delete",
            RECRUITING_DASHBOARD_UNIVERSITY_EDIT: "/v2/mqs-dashboard/university/edit",

            RECRUITING_DASHBOARD_DEGREE_LIST: "/v2/mqs-dashboard/degree/list",
            RECRUITING_DASHBOARD_DEGREE_SAVE: "/v2/mqs-dashboard/degree/save",
            RECRUITING_DASHBOARD_DEGREE_EDIT: "/v2/mqs-dashboard/degree/edit",
            RECRUITING_DASHBOARD_DEGREE_DELETE: "/v2/mqs-dashboard/degree/delete",

            RECRUITING_DASHBOARD_CUSTOM_FIELD_LIST: "/v2/mqs-recruiting/custom-filed/list",
            RECRUITING_DASHBOARD_CUSTOM_FIELD_SAVE: "/v2/mqs-recruiting/custom-filed/save",
            RECRUITING_DASHBOARD_CUSTOM_FIELD_DELETE: "/v2/mqs-recruiting/custom-filed/delete",

            RECRUITING_DASHBOARD_VIDEO_QUESTION_LIST: "/v2/mqs-recruiting/video-question/list",
            RECRUITING_DASHBOARD_VIDEO_QUESTION_SAVE: "/v2/mqs-recruiting/video-question/save",
            RECRUITING_DASHBOARD_VIDEO_QUESTION_DELETE: "/v2/mqs-recruiting/video-question/delete",


            // Recruiting Management Opening
            RECRUITING_CANDIDATE_LISTING: "/v2/mqs-recruiting/candidate-listing",
            RECRUITING_CANDIDATE_CREATE: "/v2/mqs-recruiting/candidate-create",
            RECRUITING_CANDIDATE_DELETE: "/v2/mqs-recruiting/candidate-delete",

            // Recruiting Management Application
            RECRUITING_APPLICATION_LISTING: "/v2/mqs-recruiting/application-listing",
            RECRUITING_APPLICATION_BUDGE_COUNT: "/v2/mqs-recruiting/application-budge-count",
            RECRUITING_APPLICATION_CREATE: "/v2/mqs-recruiting/application-create",
            RECRUITING_APPLICATION_DELETE: "/v2/mqs-recruiting/application-delete",
            RECRUITING_APPLICATION_VIEW: '/v2/job-application/get-job-application',
            RECRUITING_APPLICATION_VIEW_Details: '/v2/mqs-recruiting/application/view',
            RECRUITING_CANDIDATE_APPLICATION_LISTING: "/v2/mqs-recruiting/candidate-application-listing",
            RECRUITING_CANDIDATE_APPLICATION_VIEW: "/v2/mqs-recruiting/candidate/view",
            RECRUITING_STATUS_READ_JOB_APPLICATION: "/v2/mqs-recruiting/read-job-application",
            RECRUITING_STATUS_READ_CANDIDATE: "/v2/mqs-recruiting/read-candidate",
            RECRUITING_STATUS_APPLICATION_LISTING: "/v2/mqs-recruiting/status-application-listing",
            RECRUITING_SAVE_HISTORY: "/v2/job-application/save-application-history",
            RECRUITING_GET_HISTORY: "/v2/job-application/list-application-history",
            RECRUITING_GET_SURVEY_METRIC: "/v2/job-application/list-application-fit-index",
            RECRUITING_JOB_OPENING_VIEW: "/v2/mqs-recruiting/job-view",
            RECRUITING_CANDIDATE_UNIVERSITIES: "/v2/mqs-recruiting/candidate/university",
            RECRUITING_CANDIDATE_AREAS: "/v2/mqs-recruiting/candidate/areas",
            GET_QUESTION_BY_JOB_APPLICATION: "/v2/mqs-quiz/getQuestionByJobApplication",
            RECRUITING_CANDIDATE_SEND_REMAINDER: "/v2/mqs-recruiting/candidate/remainder",

            // INFORMATION
            INFO_UPLOAD: "/v2/info/upload",
            INFO_LISTALL: "/v2/info",
            INFO_DOC: "/v2/info/:id",
            INFO_DOWNLOAD: "/v2/info/download/:filename",
            INFO_CATEGORY_LISTALL: "/v2/info-category",
            INFO_CATEGORY_DOC: "/v2/info-category/:id",
            CREATE_CATEGORY: "/v2/info-new-category",
            UPDATE_CATEGORY: "/v2/info-category",
            CREATE_OR_UPDATE_CATEGORY: "/v2/info-category-create-or-update",
            GET_CATEGORY_BY_ID: "/v2/info-category/:id",

            // USER ACTION
            USER_ACTION_OFFICE: "/v2/user-manager/action/office/:siteKey",
            TOUCHPOINT_ACTION_OFFICE: "/v2/user-manager/action/office/:siteKey/:userId",
            USER_ACTION_DESK: "/v2/user-manager/action/desk/:deskId",
            USER_ACTION_SMARTWORKING: "/v2/user-manager/action/smartworking",
            USER_ACTION_LUNCH: "/v2/user-manager/action/lunch",
            USER_ACTION_OVERTIME: "/v2/user-manager/action/overtime",
            GET_USER_ACTIVITIES: "/v2/user-manager/person/:id/activities/:dateFrom/:dateTo",
            USER_ACTION_LUNCH_SETTINGS: "/v2/user-manager/action/lunch/settings",
            USER_ACTION_UPDATE: "/v2/user-manager/person/activity",

            // APPROVAL REQUESTS
            UPDATE_REQUEST: "/v2/approval/request",
            GET_ALL_REQUESTS: "/v2/approval/requests/all",
            GET_USER_REQUESTS: "/v2/approval/requests/all/user/:userId",
            GET_ACCOUNTABLE_REQUESTS: "/v2/approval/requests/all/accountable/:accountableId",
            GET_RESPONSABLE_REQUESTS: "/v2/approval/requests/all/responsable/:responsableId",
            GET_CONSULTED_REQUESTS: "/v2/approval/requests/all/consulted/:consultedId",
            GET_INFORMED_REQUESTS: "/v2/approval/requests/all/informed/:informedId",

            GET_ALL_REQUESTS_BYSTATE: "/v2/approval/requests/all/state/:state",
            GET_USER_REQUESTS_BYSTATE: "/v2/approval/requests/user/state/:userId/:state",
            GET_ACCOUNTABLE_REQUESTS_BYSTATE: "/v2/approval/requests/accountable/state/:accountableId/:state",
            GET_RESPONSABLE_REQUESTS_BYSTATE: "/v2/approval/requests/responsable/state/:responsableId/:state",
            GET_CONSULTED_REQUESTS_BYSTATE: "/v2/approval/requests/consulted/state/:consultedId/:state",
            GET_INFORMED_REQUESTS_BYSTATE: "/v2/approval/requests/informed/state/:informedId/:state",

            GET_ALL_REQUESTS_BYDATE: "/v2/approval/requests/all/date/:start/:end",
            GET_USER_REQUESTS_BYDATE: "/v2/approval/requests/user/date/:userId/:start/:end",
            GET_ACCOUNTABLE_REQUESTS_BYDATE: "/v2/approval/requests/accountable/date/:accountableId/:start/:end",
            GET_RESPONSABLE_REQUESTS_BYDATE: "/v2/approval/requests/responsable/date/:responsableId/:start/:end",
            GET_CONSULTED_REQUESTS_BYDATE: "/v2/approval/requests/consulted/date/:consultedId/:start/:end",
            GET_INFORMED_REQUESTS_BYDATE: "/v2/approval/requests/informed/date/:informedId/:start/:end",

            GET_ALL_REQUESTS_BYJUSTIFICATIVE: "/v2/approval/requests/all/justificative/:justificative",
            GET_USER_REQUESTS_BYJUSTIFICATIVE: "/v2/approval/requests/user/justificative/:userId/:justificative",
            GET_ACCOUNTABLE_REQUESTS_BYJUSTIFICATIVE: "/v2/approval/requests/accountable/justificative/:accountableId/:justificative",
            GET_RESPONSABLE_REQUESTS_BYJUSTIFICATIVE: "/v2/approval/requests/responsable/justificative/:responsableId/:justificative",
            GET_CONSULTED_REQUESTS_BYJUSTIFICATIVE: "/v2/approval/requests/consulted/justificative/:consultedId/:justificative",
            GET_INFORMED_REQUESTS_BYJUSTIFICATIVE: "/v2/approval/requests/informed/justificative/:informedId/:justificative",

            GET_ALL_REQUESTS_BYUSER: "/v2/approval/requests/all/user/:userId",
            GET_ACCOUNTABLE_REQUESTS_BYUSER: "/v2/approval/requests/accountable/user/:accountableId/:userId",
            GET_RESPONSABLE_REQUESTS_BYUSER: "/v2/approval/requests/responsable/user/:responsableId/:userId",
            GET_CONSULTED_REQUESTS_BYUSER: "/v2/approval/requests/consulted/user/:consultedId/:userId",
            GET_INFORMED_REQUESTS_BYUSER: "/v2/approval/requests/informed/user/:informedId/:userId",

            GET_USER_ACTIVITIES_CSV: "/v2/user-manager/person/csv/:scope/:userId/activities/:dateFrom/:dateTo",

            // REPORT
            GET_REPORT_USERS_PRESENCE: "/v2/report/users/presence/:year/:month",


            // CMS
            CMS_DETAILS: "/v2/mqs-dashboard/cms",
            CMS_LIST: "/v2/mqs-dashboard/cms/list",
            CMS_SAVE_LIST: "/v2/mqs-dashboard/cms/save",
            RECRUITING_SAVE_DEFAULT_IMAGE: "/v2/mqs-dashboard/default-image/save",
            RECRUITING_GET_DEFAULT_IMAGE: "/v2/mqs-dashboard/default-image",

            // PRODUCT TRACKING
            ORDER_LIST: "/v2/product-tracking/orders",
            ORDER: "/v2/product-tracking/order",
            ORDER_BY_ID: "/v2/product-tracking/order/:id",
            ORDER_WITH_PRODUCT: "/v2/product-tracking/order/product/:productId/exists",
            UPDATE_ORDER_PRODUCT: "/v2/product-tracking/order/product/:productId",
            PRODUCT_ACTIVATE: "/v2/product-tracking/order/:orderId/product/:itemId/activate/:codeId",
            PRODUCT_UPDATE: "/v2/product-tracking/order/product/:codeId/status",
            ORDER_PRODUCTS: "/v2/product-tracking/order/:orderId/products",
            PRODUCT_BY_CODE: "/v2/product-tracking/order/products/:codeId",
            ALL_PRODUCTS: "/v2/product-tracking/products",
            DASHBOARD_INFO: "/v2/product-tracking/dashboard",
            PRODUCT_OPERATION_UPDATE: "/v2/product-tracking/order/product/:codeId/operation",

            LIST_ITEMS: '/v2/product-tracking/items',
            SYNC_ITEMS: '/v2/product-tracking/items/sync',

            LIST_CUSTOMER_ORDERS: '/v2/product-tracking/customer-orders',
            LIST_CUSTOMER_ORDERS_GROUPED: '/v2/product-tracking/customer-orders/grouped',
            SYNC_CUSTOMER_ORDERS: '/v2/product-tracking/customer-orders/sync',

            LIST_WORKING_ORDERS: '/v2/product-tracking/working-orders',
            SYNC_WORKING_ORDERS: '/v2/product-tracking/working-orders/sync',

            LIST_PRODUCTION_PLANS: '/v2/product-tracking/production-plans',
            SYNC_PRODUCTION_PLANS: '/v2/product-tracking/production-plans/sync/:date',

            LIST_WORKING_PLANS: '/v2/product-tracking/working-plans',
            SYNC_WORKING_PLANS: '/v2/product-tracking/working-plans/sync/:date',

            // PARKING
            PARKING_STATUS: "/v2/parking/status/:action",
            PARKING_BOOK: "/v2/parking/book",
            PARKING_BOOK_REMOVE: "/v2/parking/book/:id",
            PARKING_BOOK_FOR_USER: "/v2/parking/book/:date/:id",
            PARKING_RESOURCES: "/v2/parking/resources",
            PARKING_GET_PERSONAL: "/v2/parking/personal",
            PARKING_UPDATE_POOL: "/v2/parking/pool/:id",
            PARKING_GET_CSV: "/v2/parking/csv",
            PARKING_PREBOOK: "/v2/parking/prebook",
            PARKING_BOOK_AVAILABLE: "/v2/parking/book/available",
            PARKING_STATISTICS: "/v2/parking/statistics",

            // DATA REPOSITORY:
            DATA_REPOSITORY_REF: '/v2/data-repository/:repository/:id',
            DATA_REPOSITORY_LIST: '/v2/data-repository/list/:repository/entry',


            // DATA STORAGE
            DATA_STORAGE_UPLOAD: "/v2/data-storage/upload",
            DATA_STORAGE_DOWNLOAD: "/v2/data-storage/download/:id",
            DATA_STORAGE_REMOVE: "/v2/data-storage/remove/:id",
            DATA_STORAGE_FILE_DETAILS: "/v2/data-storage/details",
            DATA_STORAGE_GET_BASE64: "/v2/data-storage/image",

            BELL_NOTIFICATION_LIST: '/v2/mqs-recruiting/notification-listing',
            PUSH_NOTIFICATION: '/v2/mqs-recruiting/push-notification/add',
            DELETE_PUSH_NOTIFICATION: '/v2/mqs-recruiting/push-notification/delete',
            NOTIFICATION_READ_UNREAD: "/v2/mqs-recruiting/notification/read-unread",
            ADDRESS_COUNTRY_LISTING: 'v2/mqs-procurement/country/list',
            ADDRESS_ADD_COUNTRY: "v2/mqs-procurement/country/add",

            // ACCESS CONTROL LOGS
            READ_ACLOGS: "/v2/access-control-manager/logs/read",
            LIST_ACLOGS_BY_SITE: "/v2/access-control-manager/logs/by-site/:id",
            LIST_ACLOGS_BY_UNIT: "/v2/access-control-manager/logs/by-unit",
            LIST_ACLOGS_BY_DATE: "/v2/access-control-manager/logs/by-date/:start/:end",
            LIST_ACLOGS_BY_SITE_AND_DATE: "/v2/access-control-manager/logs/by-site-date-range/:id/:start/:end",
            LIST_ACLOGS_BY_UNIT_AND_DATE: "/v2/access-control-manager/logs/by-unit-date-range/:start/:end",

            // ACCESS CONTROL USER QR CODE
            GENERATE_ACCESS_CONTROL_QR_CODE: "/v2/access-control-manager/generate-qr-code/:id",
            GET_ACCESS_CONTROL_QR_CODE: "/v2/access-control-manager/qr-code/:id",
            GET_ACCESS_CONTROL_BADGE: "/v2/access-control-manager/badge",
            BLOCK_USER_AC_QR_CODE: "/v2/access-control-manager/block-user-qrcode/:id",
            LIST_USER_AC_QR_CODE: "/v2/access-control-manager/list-user-qr-code",
            GET_USER_AC_QR_CODE: "/v2/access-control-manager/get-user-qr-code/:userId",
            ACTIVATE_USER_RING: "/v2/access-control-manager/activate-ring/:gateId",

            // CUSTOM QR CODE OLD
            GENERATE_CUSTOM_ACCESS_CONTROL_QR_CODE: "/v2/access-control-manager/generate-custom-qr-code",
            UPDATE_CUSTOM_ACCESS_CONTROL_QR_CODE: "/v2/access-control-manager/update-custom-qr-code",
            GET_CUSTOM_AC_QR_CODE: "/v2/access-control-manager/custom-qr-code/:id",
            LIST_CUSTOM_AC_QR_CODE: "/v2/access-control-manager/list-custom-qr-code",
            BLOCK_CUSTOM_AC_QR_CODE: "/v2/access-control-manager/block-custom-qrcode/:id",
            DELETE_CUSTOM_AC_QR_CODE: "/v2/access-control-manager/delete-custom-qrcode/:id",

            //DOCUMENTS
            ADD_UPDATE_DOCUMENT: "/v2/user-manager/documents/document",
            GET_COMPANY_DOCUMENTS: "/v2/user-manager/documents/list/:companyId",
            ADD_UPDATE_STAFF_DOCUMENT: "/v2/user-manager/user-documents/user-document",

            //USER DOCUMENTS
            ADD_UPDATE_USER_DOCUMENT: "/v2/user-manager/user-documents/user-document",
            GET_USER_DOCUMENTS: "/v2/user-manager/user-documents/list",
            LIST_DELETED_USER_DOCUMENTS: "/v2/user-manager/user-documents/list-deleted",
            GET_DOCUMENT_PATH: "/v2/user-manager/user-documents/path/:documentId",

            //Event Management scope
            EVENT_MANAGEMENT_SCOPES_LIST: "/v2/event-manager/scope/list",
            EVENT_MANAGEMENT_SCOPES_DELETE: "/v2/event-manager/scope/delete",
            EVENT_MANAGEMENT_SCOPES_ADD: "/v2/event-manager/scope/add",
            EVENT_MANAGEMENT_SCOPES_EDIT: "/v2/event-manager/scope/edit",
            EVENT_MANAGEMENT_SCOPES_MULTIPLE_DELETE: "/v2/event-manager/delete/scope",
            EVENT_MANAGEMENT_EVENT_SCOPES_LIST: "/v2/event-manager/event/scope/list",

            //EventManagement external venues
            EVENT_MANAGEMENT_EXTERNAL_VENUES_LIST: "/v2/event-manager/external-venue/list",
            EVENT_MANAGEMENT_EXTERNAL_VENUES_DELETE: "/v2/event-manager/external-venue/delete",
            EVENT_MANAGEMENT_EXTERNAL_VENUES_ADD: "/v2/event-manager/external-venue/add",
            EVENT_MANAGEMENT_EXTERNAL_VENUES_EDIT: "/v2/event-manager/external-venue/edit",
            EVENT_MANAGEMENT_EXTERNAL_VENUES_MULTIPLE_DELETE: "/v2/event-manager/delete/external-venue",

            //Event Management scope
            EVENT_MANAGEMENT_COST_CENTER_LIST: "/v2/event-manager/cost-center/list",
            EVENT_MANAGEMENT_COST_CENTER_DELETE: "/v2/event-manager/cost-center/delete",
            EVENT_MANAGEMENT_COST_CENTER_ADD: "/v2/event-manager/cost-center/add",
            EVENT_MANAGEMENT_COST_CENTER_EDIT: "/v2/event-manager/cost-center/edit",
            EVENT_MANAGEMENT_COST_CENTER_MULTIPLE_DELETE: "/v2/event-manager/delete/cost-center",
            EVENT_MANAGEMENT_COST_CENTER_TYPE_LIST: "/v2/event-manager/cost-center-type-list",
            EVENT_MANAGEMENT_EVENT_COST_CENTER_LIST: "/v2/event-manager/event/costCenter/list",

            //Event Management event services
            EVENT_MANAGEMENT_EVENT_SERVICES_LIST: "/v2/event-manager/event-service/list",
            EVENT_MANAGEMENT_EVENT_SERVICES_DELETE: "/v2/event-manager/event-service/delete",
            EVENT_MANAGEMENT_EVENT_SERVICES_ADD: "/v2/event-manager/event-service/add",
            EVENT_MANAGEMENT_EVENT_SERVICES_EDIT: "/v2/event-manager/event-service/edit",
            EVENT_MANAGEMENT_EVENT_SERVICES_MULTIPLE_DELETE: "/v2/event-manager/delete/event-service",

            //Event Managment List Of Event
            EVENT_MANAGEMENT_LIST_OF_EVENT_LIST: "/v2/event-manager/event/list",
            EVENT_MANAGEMENT_CREATE_EVENT: "/v2/event-manager/event/add",
            EVENT_MANAGEMENT_EDIT_EVENT: "/v2/event-manager/event/edit",
            EVENT_CHECK_IN_DATA: "/v2/event-manager/event/get-event-checkin-data",
            EVENT_MANAGEMENT_EDIT_ATTENDEES_CREDITS: "/v2/event-manager/event/edit-event-credit",
            EVENT_MANAGEMENT_LIST_OF_EVENT_MULTIPLE_DELETE: "/v2/event-manager/delete/event",
            EVENT_MANAGEMENT_LIST_OF_EVENT_DELETE: "/v2/event-manager/event/delete",
            EVENT_MANAGEMENT_LIST_OF_EVENT_CANCEL: "/v2/event-manager/event/cancel",
            EVENT_MANAGEMENT_LIST_OF_EVENT_RE_ACTIVATE: "/v2/event-manager/event/re-active",
            EVENT_MANAGEMENT_LIST_OF_EVENT_ACTIVITY_LOG: "/v2/event-manager/event/activityLogList",
            EVENT_MANAGEMENT_LIST_OF_EVENT_Attendee_ACTIVITY_LOG: "/v2/event-manager/event/AttendeesActivityLogList",
            EVENT_MANAGEMENT_EDIT_EVENT_DETAILS_COUNT: "/v2/event-manager/event/insights",
            EVENT_MANAGEMENT_SEND_PUSH_NOTIFICATION: '/v2/event-manager/event/send/push-notification',
            EVENT_MANAGEMENT_WEBEX_CHECKIN_OUT: '/v2/event-manager/event/webex-checkIn-out',
            EVENT_MANAGEMENT_SEND_PERSONAL_PINCODE_EMAIL: '/v2/event-manager/event/send-personal-pincode-email',
            EVENT_MANAGEMENT_SEND_INDIVIDUAL_PERSONAL_PINCODE_EMAIL : "/v2/event-manager/event/send-personal-pincode-email-individual",
            EVENT_MANAGEMENT_ACTIVE_MEETING_LINK: "/v2/event-manager/event/active-meeting-link",
            EVENT_MANAGEMENT_CHECKPOINT_CONTROL: "/v2/event-manager/event/checkpoint/control",

            //Create Event
            EVENT_MANAGEMENT_LIST_OF_ASSET_TYPE: "/v2/event-manager/event/resource-types",
            EVENT_MANAGEMENT_LIST_OF_RESOURCE_BY_ASSET_TYPE: "/v2/event-manager/event/resource-by-types",
            GET_PEOPLE_BY_EVENT_COMPANY: "/v2/user-manager/event/person/:companyId",
            EVENT_MANAGEMENT_RESEND_INVITATION_EMAIL: '/v2/event-manager/event/resend-invitation-email',
            EVENT_MANAGEMENT_RESEND_INVITATION_USER: '/v2/event-manager/event/resend-invitation-user',
            EVENT_MANAGEMENT_SEND_ATTENDEE_CERTIFICATE: '/v2/event-manager/event/send-attendee-certificate',
            EVENT_MANAGEMENT_SEND_REMINDER_INVITATION: '/v2/event-manager/event/send-reminder-invitation',

            //Calendar
            EVENT_MANAGEMENT_GET_CALENDER_EVENTS: "/v2/event-manager/event/calender",

            //Setting
            EVENT_MANAGEMENT_LIST_EMAIL_CONFIG: "/v2/event-manager/list-email-configuration",
            EVENT_MANAGEMENT_LIST_GENERAL_SETTINGS: "/v2/event-manager/event/get-general-setting",
            EVENT_MANAGEMENT_UPDATE_EMAIL_CONFIG: "/v2/event-manager/add-email-configuration",
            EVENT_MANAGEMENT_UPDATE_GENERAL_SETTINGS: "/v2/event-manager/event/add-general-setting",
            EVENT_MANAGEMENT_LIST_EMAIL_TEMPLATE: "/v2/event-manager/list-email-template",
            EVENT_MANAGEMENT_LIST_EMAIL_TEMPLATE_PROCURMENT: "/v2/mqs-procurement/list-email-template",

            // Event Dashboard
            EVENT_MANAGEMENT_GET_DASHBOARD: "/v2/event-manager/event/dashboard",
            EVENT_MANAGEMENT_UPDATE_EMAIL_TEMPLATE: "/v2/event-manager/update-email-template",
            EVENT_MANAGEMENT_UPDATE_EMAIL_TEMPLATE_PROCUREMENT: "/v2/mqs-procurement/update-email-template",

            // Download ICS file
            EVENT_MANAGEMENT_CREATE_ICS_FILE: "/v2/event-manager/event/createICS",
            EVENT_MANAGEMENT_DOWNLOAD_ICS_FILE: "/v2/event-manager/event/downloadICS",

            // Event management
            EVENT_MANAGEMENT_ATTENDEES_CERTIFICATE_LIST: "/v2/event-manager/event/getAttendees",
            EVENT_MANAGEMENT_ACCEPT_EVENT: "/v2/event-manager/event/accept-invitation",
            EVENT_MANAGEMENT_DECLINE_EVENT: "/v2/event-manager/event/decline-invitation",
            EVENT_CHECK_IN_OUT_ACTION: "/v2/event-manager/event/checkIn-out",

            //Assets Management
            ASSETS_MANAGEMENT_RESOURCE_GROUP_DELETE: "/v2/booking/resource/type/:id",

            //EMC Mini app
            EMC_LOGIN: "/v2/user-manager/account/login/event-attendee"

        }
    };

    config: Configurations;

    constructor(@Inject(Configurations) config: Configurations,
        private commonService: CommonService,
        private sessionManagementService: SessionManagementService,
        private _http: HttpClient) {
        //console.log('ApiService: contructor config: ', config);
        this.config = this.commonService.cloneObject(config);
    }

    prepare(api: string, apiParams: ApiParam[]) {
        for (let apiParam of apiParams)
            api = api.replace("{" + apiParam.paramname + "}", apiParam.paramvalue);
        return api;
    }

    resolveApiUrl(endpoint: string) {
        let apiUrl = this.config.env.api_host + endpoint;
        //console.log('ApiService.resolveApiUrl: ', apiUrl);
        return apiUrl;
    }

    /*getRetryCount() {
        try {
            return this.getRetryCount();
        } catch (ex) {
            return 5;
        }
    }*/

    getRetryCount() {
        return 0;
    }

    // tslint:disable-next-line:no-shadowed-variable
    get<T>(endpoint: string, options?: {}): Observable<T> {
        return this._http.get<T>(this.resolveApiUrl(endpoint), options).pipe(retry(this.getRetryCount()), tap(
            (data) => {
                return data;
            },
            (error: HttpErrorResponse) => {
                return this.handleError(error);
            }
        ));
    }

    post<T>(endpoint: string, body: any, options?: {}): Observable<T> {
        return this._http.post<T>(this.resolveApiUrl(endpoint), body, options).pipe(retry(this.getRetryCount()), tap(
            (data) => {
                return data;
            },
            (error: HttpErrorResponse) => {
                return this.handleError(error);
            }
        ));
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this._http.put<T>(this.resolveApiUrl(endpoint), body).pipe(retry(this.getRetryCount()), tap(
            (data) => {
                return data;
            },
            (error: HttpErrorResponse) => {
                return this.handleError(error);
            }
        ));
    }

    delete<T>(endpoint: string): Observable<T> {
        return this._http.delete<T>(this.resolveApiUrl(endpoint)).pipe(retry(this.getRetryCount()), tap(
            (data) => {
                return data;
            },
            (error: HttpErrorResponse) => {
                return this.handleError(error);
            }
        ));
    }

    request(req: HttpRequest<any>): any {
        this._http.request(req).pipe(retry(this.getRetryCount()), tap(
            (data) => {
                return data;
            },
            (error: HttpErrorResponse) => {
                return this.handleError(error);
            }
        ));
    }

    uploadFile(file: File, endpoint: string): any {
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);

        let url = this.resolveApiUrl(endpoint); //isSafetyUsers ? this.apiService.API.ADMIN.UPLOAD_SAFETY_USERS : this.apiService.API.BE.UPLOAD_USERS;
        let req = new HttpRequest("POST", url, formData, {
            reportProgress: true
        });

        return this._http.request(req).pipe(retry(this.getRetryCount()), tap(
            (data) => {
                return data;
            },
            (error: HttpErrorResponse) => {
                return this.handleError(error);
            }
        ));
    }

    private handleError(error: HttpErrorResponse) {
        console.error("Api error: ", error);

        // session expired
        if (error.status == 401) {
            this.sessionManagementService.fireSessionExpired();
        } else {
            console.error("Something went wrong. Please try again later");
        }

        return of(null);
    }
}

export let buildRequest = (string, params) =>
    string.split("/").map(el => {
        return params[el] ? params[el] : el
    }).join("/");
