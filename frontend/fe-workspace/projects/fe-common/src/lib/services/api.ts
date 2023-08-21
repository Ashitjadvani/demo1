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
            LOGIN: "/v1/user-manager/account/login",
            LOGINRESETPASSWORD: "/v1/user-manager/account/login-reset-password",
            ForgotPassword: "/v1/user-manager/account/forgot-password",
            ResetPassword: "/v1/user-manager/account/reset-password",
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
            USER_REQUEST_BOOK: "/v1/user-request-book",
            TRACK_USER_PLAN_ACTIVITY: "/v1/user-plan-activity",
            GET_USER_REQUEST_BOOK: "/v1/get-user-request-book/:site/:id",
            GET_USER_DAILY_INFO: "/v1/user-daily-info/:id",
            TRACK_USER_ACTIVITY: "/v1/user-activity/track",

            GET_USER_REQUEST_BOOK_BY_DATE: "/v1/get-user-request-book/:id/date/:date",
            DELETE_USER_PLANS_BY_DATE_RANGE: "/v1/update/user-plans/:siteKey/:startDate/:endDate",

            // USER-ACTIVITY
            GET_USER_ACTIVITY: "/v1/user-activity/:id",
            GET_USER_ACTIVITY_BY_DATE: "/v1/user-activity/:id/:date",
            DELETE_USER_ACTIVITY: "/v1/user-activity/:id/:date",

            // USER-AREAS
            GET_USER_AREAS: "/v1/user/areas/:siteKey",
            GET_DEPARTMENT_USERS: "/v1/department/:departmentId/users",

            // USER HOME DATA
            GET_USER_HOME_DATA: "/v1/home/:userId",
            GET_USER_HOME_TILES: "/v1/home/tiles/:userId/:lang",

            GET_USER_HIERARCHY: "/v1/user/hierarchy/:userId",
            GET_USER_DEPARTMENT: "/v1/user/department/:userId",
            USER_HAS_OFFICE_RESERVATION: "/v1/user/office/reservation/:userId/:siteKey",

            // USER CALENDAR DATA
            GET_USER_CALENDAR_DATA: "/v1/user/calendar/:siteKey/:userId/:year/:month",
            GET_USER_PLAN_DATA: "/v1/user/plan/:year/:month",

            // SITE MANAGEMENT API
            SITE_LIST: "/v1/site-list",
            SITE_KEY: "/v1/site/:key",
            SITE: "/v1/site",
            UPLOAD_SITES: "/v1/sites/upload",

            // SITE-DAILY-STATUS
            SITE_DAILY_STATUS: "/v1/site-daily-status",
            GET_SITE_DAILY_STATUS: "/v1/site-daily-status/:siteKey",
            UPDATE_SITE_DAILY_STATUS_CAP: "/v1/site-daily-status/capacity/:siteKey/:date",

            // SITE CAPACITY TIMEFRAMES
            SITE_CAPACITY_TIMEFRAME: "/v1/site-capacity-rages/:siteKey",

            // USER-DAILY-ACCESS
            USER_DAILY_ACCESS: "/v1/user-daily-access",
            GET_USER_DAILY_ACCESS: "/v1/user-daily-access/:siteKey/:userId",

            // SITE STATISTICS
            SITE_DAILY_STATISTICS: "/v1/site/statistics/:siteKey/:date",
            USER_DAILY_ACTIVITIES: "/v1/users/statistics/activities/:date",
            SITE_PRESENCE_STATS: "/v1/site/statistics/presence/:siteKey/:startDate/:endDate",

            // NEWS
            NEWS_UPLOAD: "/v1/news/upload",
            NEWS_DOCLIST: "/v1/news/:userId",
            NEWS_DOC: "/v1/news/:id",
            NEWS_ACTION: "/v1/news/action/:id",
            NEWS_DOWNLOAD: "/v1/news/download/:id",

            // USER/TEAM/DEPARTMENT STATISTICS
            USER_STATISTICS: "/v1/user/statistics/:period/:siteKey/:userId",
            TEAM_STATISTICS: "/v1/team/statistics/:period/:siteKey/:userId",
            DEPARTMENT_STATISTICS: "/v1/department/statistics/:period/:siteKey/:userId",
            CSV_TEAM_STATISTICS: "/v1/csv/team/statistics/:userId/:dateFrom/:dateTo",
            USER_STATISTICS_DAILY: "/v1/statistics/:userId/:dateFrom/:dateTo",
            TEAM_WEEKLY_STATISTICS: "/v1/team/weekly/statistics/:siteKey/:userId/:dateFrom/:dateTo",
            DEPARTMENT_WEEKLY_STATISTICS: "/v1/department/weekly/statistics/:siteKey/:userId/:dateFrom/:dateTo",
            DEPARTMENT_WEEKLY_STATISTICS_BY_AREA: "/v1/department/weekly/statistics/:departmentId/:dateFrom/:dateTo",
            GLOBAL_STAT_ACTIVITY: "/v1/global/statistics/activity/:date",
            CSV_DEPARTMENT_STATISTICS_DAILY: "/v1/csv/department/statistics/:departmentId/:dateFrom/:dateTo",
            USERS_DAILY_STATISTICS: "/v1/users/daily/statistics/:dateFrom/:dateTo",
            USERS_DAILY_STATISTICS_BY_SITE: "/v1/users/daily/statistics/:siteKey/:dateFrom/:dateTo",
            CSV_SINGLE_USER_STATISTICS_DAILY: "/v1/csv/user/statistics/:userId/:dateFrom/:dateTo",
            SINGLE_USER_STATISTICS_DAILY: "/v1/single/user/statistics/:userId/:dateFrom/:dateTo",
            SAFETY_USERS_DAILY: "/v1/safety/users/daily/:dateFrom/:dateTo",
            BOARD_DIRECTORS_USER_STATS: "/v1/board/directors/statistics/:dateFrom/:dateTo",
            APM_SITE_STATS: "/v1/apm/statistics/:dateFrom/:dateTo",
            APM_SITE_STATS_CSV: "/v1/apm/statistics/csv/:dateFrom/:dateTo",

            // USER HEALTH
            USER_TEAM_HEALTH: "/v1/user/team/health",

            // LOGGING EVENT
            LOG_EVENT: "/v1/log/event",
            GET_LOG_EVENTS: "/v1/log/events",

            // SAFETY
            GET_SAFETY: "/v1/safety/:siteKey",

            // SCHEDULER
            GET_SCHEDULE_EVENTS: "/v1/scheduler/events",
            ADD_SCHEDULE_EVENT: "/v1/scheduler/event",
            UPDATE_SCHEDULE_EVENTS: "/v1/scheduler/event/:id",
            DELETE_SCHEDULE_EVENTS: "/v1/scheduler/event/:id",

            // WORKFLOW
            GET_WORKFLOW_TEMPLATES: "/v1/workflow/templates",
            UPDATE_WORKFLOW_TEMPLATE: "/v1/workflow/update/template",
            GET_WORKFLOW_INSTANCES: "/v1/workflow/instances",
            GET_ALL_WORKFLOW_INSTANCES: "/v1/workflow/instances/all",
            GET_USER_WORKFLOW_INSTANCES: "/v1/workflow/user/instances/:id",
            CREATE_WORKFLOW_INSTANCE: "/v1/workflow/create/instance/:userId/:templateId/:startAt",
            DELETE_WORKFLOW_INSTANCE: "/v1/workflow/delete/instance/:workflowId",
            EXEC_WORKFLOW_ACTION: "/v1/workflow/:workflowId/user/:userId/execute/:actionId",
            UPLOAD_WORKFLOW_INSTANCE: "/v1/workflow/instance/upload",

            // SETTINGS
            SETTINGS: "/v1/settings",

            // ACTION-TILES
            ACTION_TILES: "/v1/action-tiles",
            UPDATE_ACTION_TILE: "/v1/action-tile",

            // RESERVATION
            GET_RESERVATION_SITE: "/v1/reservation/sites",
            UPDATE_RESERVATION_SITE: "/v1/reservation/site",
            DELETE_RESERVATION_SITE: "/v1/reservation/site/:id",
            GET_RESERVATION_ITEMS: "/v1/reservation/site/:id/items",
            UPDATE_RESERVATION_ITEM: "/v1/reservation/site/item",
            DELETE_RESERVATION_ITEM: "/v1/reservation/item/:id",
            USER_RESERVATION: "/v1/user/reservation/item/:id/:userId",
            USER_MANUAL_RESERVATION: "/v1/user/reservation/manual/:siteId/:date/:userId",
            USER_SITE_RESERVATION: "/v1/user/reservation/site/:id/:userId",
            CHECK_USER_SITE_RESERVATION: "/v1/check/user/reservation/site/:userId",
            CHECK_USER_ITEM_RESERVATION: "/v1/check/user/reservation/item/:userId",
            CSV_USER_SITE_PRERESERVATION: "/v1/csv/user/pre-reservation/site",
            CSV_USER_SITE_RESERVATION: "/v1/csv/user/reservation/site/:id",
            SITE_AVAILABLE: "/v1/reservation/site/available/:id",

            // BOOKABLE RESOURCES
            GET_BOOKABLE_RESOURCE_TYPES: "/v2/booking/resource/types",
            ACTION_BOOKABLE_RESOURCE_TYPE: "/v2/booking/resource/type",
            DELETE_BOOKABLE_RESOURCE_TYPE: "/v2/booking/resource/type/:id",
            GET_BOOKABLE_RESOURCES: "/v2/booking/resources/:type",
            ACTION_BOOKABLE_RESOURCE: "/v2/booking/resource",
            DELETE_BOOKABLE_RESOURCE: "/v2/booking/resource/:id",
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
            
            // TOUCHPOINT
            TOUCHPOINT_KEEP_ALIVE: "/v1/touchpoint/keep-alive",
            TOUCHPOINT_KEEP_ALIVE_LEGACY: "/v1/touchpoint/keep-alive/legacy",
            TOUCHPOINT_LIST: "/v1/touchpoint/list",
            TOUCHPOINT_SETTINGS: "/v1/touchpoint/settings",
            TOUCHPOINT_PAIR: "/v1/touchpoint/pair",
            TOUCHPOINT_REGISTER: "/v1/touchpoint/register",
            TOUCHPOINT_CHECK_PAIR: "/v1/touchpoint/check-pair",
            TOUCHPOINT_DELETE: "/v1/touchpoint/:id",
            TOUCHPOINT_AUTH: "/v1/touchpoint/auth/:id",
            TOUCHPOINT_UNLOCK_PAIR: "/v1/touchpoint/unlock/:id",

            // SURVEY
            GET_SURVEY: "/v1/survey/:id",
            GET_SURVEY_RESULTS: "/v1/survey/results/:id",
            USER_SURVEY_ACTION: "/v1/survey/:id/user/action/:action",
            SUBMIT_SURVEY: "/v1/survey/:id/submit",
            SURVEY_USER_ENABLED: "/v1/survey/:id/user/enabled",
            GET_SURVEY_CSV: "/v1/survey/results/csv/:id",

            // SUSTAINABILITY
            SUSTAINABILITY_TRANS_TYPE: "/v1/sustainability/transport-type",
            GET_SUSTAINABILITY_TRANS_TYPES: "/v1/sustainability/transport-types",
            DEL_SUSTAINABILITY_TRANS_TYPE: "/v1/sustainability/transport-type/:id",
            USER_HABIT: "/v1/sustainability/user/habit",
            GET_ALL_USERS_HABITS: "/v1/sustainability/all/users/habits",
            GET_ALL_USERS_HABITS_STATS: "/v1/sustainability/user/habit/statistics",
            GET_VIEW_SUMMARY: "/v1/sustainability/view/summary",

            // PERSON GROUPS/PROFILES
            GET_GROUPS_BY_COMPANY: "/v1/user-manager/group/:companyId",
            ADD_UPDATE_GROUP: "/v1/user-manager/group",
            DELETE_GROUP: "/v1/user-manager/group/:id",
            UPDATE_GROUP_PERSON: "/v1/user-manager/group/:groupId/person/:personId",
            GROUP_ADD_PEOPLE: "/v1/user-manager/group/:id",

            // PERSON
            GET_PEOPLE: "/v1/user-manager/person/all",
            GET_PEOPLE_BY_COMPANY: "/v1/user-manager/person/:companyId",
            PERSON: "/v1/user-manager/person",
            DELETE_PERSON: "/v1/user-manager/person/:id",
            GET_PERSON_HISTORY: "/v1/user-manager/person/:id/history",

            // ACCESS CONTROL OLD
            /*GENERATE_ACCESS_CONTROL_QR_CODE: "/v1/user-manager/access-control/generate-qr-code/:id",
            GET_ACCESS_CONTROL_QR_CODE: "/v1/user-manager/access-control/qr-code/:id",
            BLOCK_USER_AC_QR_CODE: "/v1/user-manager/access-control/block-user-qrcode/:id",
            LIST_USER_AC_QR_CODE: "/v1/user-manager/access-control/list-user-qr-code",
            GET_USER_AC_QR_CODE: "/v1/user-manager/access-control/get-user-qr-code/:userId",
            //ACTIVATE_USER_RING: "/v1/user-manager/access-control/activate-ring/:gateId",*/

            // ACCESS CONTROL
            GENERATE_ACCESS_CONTROL_QR_CODE: "/v1/access-control-manager/generate-qr-code/:id",
            GET_ACCESS_CONTROL_QR_CODE: "/v1/access-control-manager/qr-code/:id",
            GET_ACCESS_CONTROL_BADGE: "/v1/access-control-manager/badge",
            BLOCK_USER_AC_QR_CODE: "/v1/access-control-manager/block-user-qrcode/:id",
            LIST_USER_AC_QR_CODE: "/v1/access-control-manager/list-user-qr-code",
            GET_USER_AC_QR_CODE: "/v1/access-control-manager/get-user-qr-code/:userId",
            ACTIVATE_USER_RING: "/v1/access-control-manager/activate-ring/:gateId",

            // CUSTOM QR CODE OLD
            /*GENERATE_CUSTOM_ACCESS_CONTROL_QR_CODE: "/v1/user-manager/access-control/generate-custom-qr-code/:siteId",
            UPDATE_CUSTOM_ACCESS_CONTROL_QR_CODE: "/v1/user-manager/access-control/update-custom-qr-code",
            GET_CUSTOM_AC_QR_CODE: "/v1/user-manager/access-control/custom-qr-code/:id",
            LIST_CUSTOM_AC_QR_CODE: "/v1/user-manager/access-control/list-custom-qr-code",
            BLOCK_CUSTOM_AC_QR_CODE: "/v1/user-manager/access-control/block-custom-qrcode/:id",
            DELETE_CUSTOM_AC_QR_CODE: "/v1/user-manager/access-control/delete-custom-qrcode/:id",*/

            // CUSTOM QR CODE OLD
            GENERATE_CUSTOM_ACCESS_CONTROL_QR_CODE: "/v1/access-control-manager/generate-custom-qr-code/:siteId",
            UPDATE_CUSTOM_ACCESS_CONTROL_QR_CODE: "/v1/access-control-manager/update-custom-qr-code",
            GET_CUSTOM_AC_QR_CODE: "/v1/access-control-manager/custom-qr-code/:id",
            LIST_CUSTOM_AC_QR_CODE: "/v1/access-control-manager/list-custom-qr-code",
            BLOCK_CUSTOM_AC_QR_CODE: "/v1/access-control-manager/block-custom-qrcode/:id",
            DELETE_CUSTOM_AC_QR_CODE: "/v1/access-control-manager/delete-custom-qrcode/:id",

            // ACCOUNT
            GET_ADMIN: "/v1/user-manager/admin",
            GET_ACCOUNTS_BY_COMPANY: "/v1/user-manager/account/:companyId",
            DELETE_ACCOUNT: "/v1/user-manager/account/:id",
            ADD_USER_ACCOUNT: "/v1/user-manager/account/add",
            UPDATE_USER_ACCOUNT: "/v1/user-manager/account/update",
            UPLOAD_USERS: "/v1/user-manager/users/upload",
            UPLOAD_USERS_LIST: "/v1/user-manager/users/listupload/:userId",
            DOWNLOAD_USERS_LIST: "/v1/user-manager/users/listdownload/:companyId/:scope",

            // GREENPASS
            GET_GREENPASSES: "/v1/user-manager/greenpass/all",
            GET_GREENPASSES_BY_USER: "/v1/user-manager/greenpass/:userId",
            DELETE_GREENPASS: "/v1/user-manager/greenpass/:id",
            ADD_GREENPASS: "/v1/user-manager/greenpass/add",
            UPDATE_GREENPASS: "/v1/user-manager/greenpass/update",
            UPLOAD_GREENPASS: "/v1/user-manager/greenpass/upload-document/:userId/:companyId",
            VALIDATE_GREENPASS: "/v1/user-manager/greenpass/validate/:companyId",

            GET_TODAY_USER_GREENPASS_VALIDATION: "/v1/user-manager/greenpass/validations/today/:userId",
            ADD_GREENPASS_VALIDATION: "/v1/user-manager/greenpass/validations/today",
            DELETE_GREENPASS_VALIDATION: "/v1/user-manager/greenpass/validations/:id",

            //DOCUMENTS
            ADD_UPDATE_DOCUMENT: "/v1/user-manager/documents/document",
            GET_COMPANY_DOCUMENTS: "/v1/user-manager/documents/list/:companyId",

            //USER DOCUMENTS
            ADD_UPDATE_USER_DOCUMENT: "/v1/user-manager/user-documents/user-document",
            GET_USER_DOCUMENTS: "/v1/user-manager/user-documents/list/:userId",
            LIST_DELETED_USER_DOCUMENTS: "/v1/user-manager/user-documents/list-deleted",
            GET_DOCUMENT_PATH: "/v1/user-manager/user-documents/path/:documentId",

            //EMAIL
            SEND_HTML_MAIL_WITH_ATTACHMENTS: "/v1/user-manager/mail/send-html-mail-attachments",

            // SITE
            GET_SITES: "/v1/site-manager/sites/:companyId",
            ADD_UPDATE_SITE: "/v1/site-manager/site",
            DELETE_SITE: "/v1/site-manager/site/:id",
            GET_ACCESS_CONTROL_CENTRAL_UNITS: "/v1/site-manager/access-control/available-central-units/:siteId",
            GET_ACCESS_CONTROL_GROUPS: "/v1/site-manager/access-control/available-groups/:siteId",
            GENERATE_ACCESS_CONTROL_CENTRAL_UNITS: "/v1/site-manager/access-control/generate-central-units/:siteId",
            CREATE_ACCESS_CONTROL_GROUP: "/v1/site-manager/access-control/create-group/:siteId",
            SEND_ACCESS_CONTROL_POST_COMMAND: "/v1/site-manager/access-control/sendPostCommand/:siteId",
            //ACTIVATE_ACCESS_CONTROL_RING_USER: "/v1/site-manager/access-control/ring/:id",
            ACTIVATE_ACCESS_CONTROL_RING_USER: "/v1/access-control-manager/ring/:id",
            GET_USER_AVAILABLE_KEYS: "/v1/access-control-manager/user-keys/:id",

            // ACCESS CONTROL LOGS OLD
            /*READ_ACLOGS: "/v1/site-manager/access-control/logs/read",
            LIST_ACLOGS_BY_SITE: "/v1/site-manager/access-control/logs/by-site/:id",
            LIST_ACLOGS_BY_UNIT: "/v1/site-manager/access-control/logs/by-unit",
            LIST_ACLOGS_BY_DATE: "/v1/site-manager/access-control/logs/by-date/:start/:end",
            LIST_ACLOGS_BY_SITE_AND_DATE: "/v1/site-manager/access-control/logs/by-site-date-range/:id/:start/:end",
            LIST_ACLOGS_BY_UNIT_AND_DATE: "/v1/site-manager/access-control/logs/by-unit-date-range/:start/:end",*/

            // ACCESS CONTROL LOGS
            READ_ACLOGS: "/v1/access-control-manager/logs/read",
            LIST_ACLOGS_BY_SITE: "/v1/access-control-manager/logs/by-site/:id",
            LIST_ACLOGS_BY_UNIT: "/v1/access-control-manager/logs/by-unit",
            LIST_ACLOGS_BY_DATE: "/v1/access-control-manager/logs/by-date/:start/:end",
            LIST_ACLOGS_BY_SITE_AND_DATE: "/v1/access-control-manager/logs/by-site-date-range/:id/:start/:end",
            LIST_ACLOGS_BY_UNIT_AND_DATE: "/v1/access-control-manager/logs/by-unit-date-range/:start/:end",

            // COMPANY
            GET_COMPANY: "/v1/user-manager/company/:id",
            UPDATE_COMPANY: "/v1/user-manager/company",
            GET_COMPANY_FUNCTIONS: "/v1/user-manager/company/functions",
            ADD_COMPANY_JUSTIFICATION: "/v1/user-manager/company/:id/justification",
            COMPANY_JUSTIFICATION: "/v1/user-manager/company/:id/justification/:justificationId",
            ADD_COMPANY_SCOPE: "/v1/user-manager/company/:id/scope",
            COMPANY_SCOPE: "/v1/user-manager/company/:id/scope/:scopeName",
            ADD_COMPANY_AREA: "/v1/user-manager/company/:id/area",
            COMPANY_AREA: "/v1/user-manager/company/:id/area/:areaName",
            ADD_COMPANY_ROLE: "/v1/user-manager/company/:id/role/:role",
            UPDATE_COMPANY_ROLE: "/v1/user-manager/company/:id/role-update/:roleName/:role",
            DELETE_COMPANY_ROLE: "/v1/user-manager/company/:id/role-delete/:roleName",
            ADD_COMPANY_JOBTITLE: "/v1/user-manager/company/:id/jobTitle/:jobTitle",
            UPDATE_COMPANY_JOBTITLE: "/v1/user-manager/company/:id/jobTitle-update/:jobTitleName/:jobTitle",
            DELETE_COMPANY_JOBTITLE: "/v1/user-manager/company/:id/jobTitle-delete/:jobTitleName",
            ADD_COMPANY_DIRECTION: "/v1/user-manager/company/:id/direction/:direction",
            UPDATE_COMPANY_DIRECTION: "/v1/user-manager/company/:id/direction-update/:directionName/:direction",
            DELETE_COMPANY_DIRECTION: "/v1/user-manager/company/:id/direction-delete/:directionName",

            // CALENDAR
            GET_CALENDAR: "/v1/calendar/user/:year/:month",
            UPDATE_CALENDAR: "/v1/calendar/event/:calendarId/:date",

            // NEWS
            ALERT_UPLOAD: "/v1/alert/upload",
            ALERT_DOCLIST: "/v1/alert/:userId",
            ALERT_LISTALL: "/v1/alerts",
            ALERT_DOC: "/v1/alert/:id",
            ALERT_ACTION: "/v1/alert/action/:id",
            ALERT_DOWNLOAD: "/v1/alert/download/:id",


            // Ticket Generate
            TICKET_UPLOAD: "/v1/ticket/upload",
            TICKET_DOCLIST: "/v1/ticket/:userId",
            TICKET_LISTALL: "/v1/tickets",
            TICKET_DOC: "/v1/ticket/:id",
            TICKET_ACTION: "/v1/ticket/action/:id",
            TICKET_DOWNLOAD: "/v1/ticket/download/:id",

            // Recruiting Management Opening
            RECRUITING_OPENING_LISTING: "/v1/mqs-recruiting/job-listing",
            RECRUITING_OPENING_CREATE: "/v1/mqs-recruiting/job-create",
            RECRUITING_DATA_STORAGE_UPLOAD: "/v1/data-storage/upload",
            RECRUITING_DATA_STORAGE_UPLOAD_DEFAULT: "/v1/data-storage/upload-default",
            RECRUITING_DATA_STORAGE_IMAGE: "/v1/data-storage/image",
            RECRUITING_DATA_STORAGE_DETAILS: "/v1/data-storage/details",
            RECRUITING_DATA_STORAGE_DEFAULT_IMAGE: "/v1/data-storage/default-image",
            RECRUITING_DATA_STORAGE_DOWNLOAD: "/v1/data-storage/download/:id",
            RECRUITING_OPENING_DELETE: "/v1/mqs-recruiting/job-delete",
            RECRUITING_OPENING_QUIZ_LISTING: "/v1/mqs-quiz/quiz-list",
            RECRUITING_OPENING_QUIZ_JOB_LISTING: "/v1/mqs-quiz/quiz-job-list",
            RECRUITING_OPENING_CUSTOMFIELD_JOB_LISTING: "/v1/mqs-quiz/quiz-job-list-custom-field",
            RECRUITING_DASHBOARD_LISTING: "/v1/mqs-dashboard/list",

            RECRUITING_OPENING_HISTORY_LISTING: "/v1/mqs-recruiting/history-listing",

            RECRUITING_DASHBOARD_UNIVERSITY_LIST: '/v1/mqs-dashboard/university/list',
            RECRUITING_DASHBOARD_UNIVERSITY_SAVE: '/v1/mqs-dashboard/university/save',
            RECRUITING_DASHBOARD_UNIVERSITY_DELETE: '/v1/mqs-dashboard/university/delete',

            RECRUITING_DASHBOARD_DEGREE_LIST: '/v1/mqs-dashboard/degree/list',
            RECRUITING_DASHBOARD_DEGREE_SAVE: '/v1/mqs-dashboard/degree/save',
            RECRUITING_DASHBOARD_DEGREE_DELETE: '/v1/mqs-dashboard/degree/delete',

            RECRUITING_DASHBOARD_CUSTOM_FIELD_LIST: '/v1/mqs-recruiting/custom-filed/list',
            RECRUITING_DASHBOARD_CUSTOM_FIELD_SAVE: '/v1/mqs-recruiting/custom-filed/save',
            RECRUITING_DASHBOARD_CUSTOM_FIELD_DELETE: '/v1/mqs-recruiting/custom-filed/delete',

            RECRUITING_DASHBOARD_VIDEO_QUESTION_LIST: '/v1/mqs-recruiting/video-question/list',
            RECRUITING_DASHBOARD_VIDEO_QUESTION_SAVE: '/v1/mqs-recruiting/video-question/save',
            RECRUITING_DASHBOARD_VIDEO_QUESTION_DELETE: '/v1/mqs-recruiting/video-question/delete',

            // Recruiting Management Opening
            RECRUITING_CANDIDATE_LISTING: "/v1/mqs-recruiting/candidate-listing",
            RECRUITING_CANDIDATE_CREATE: "/v1/mqs-recruiting/candidate-create",
            RECRUITING_CANDIDATE_DELETE: "/v1/mqs-recruiting/candidate-delete",

            // Recruiting Management Application
            RECRUITING_APPLICATION_LISTING: "/v1/mqs-recruiting/application-listing",
            RECRUITING_APPLICATION_BUDGE_COUNT: "/v1/mqs-recruiting/application-budge-count",
            RECRUITING_APPLICATION_CREATE: "/v1/mqs-recruiting/application-create",
            RECRUITING_APPLICATION_DELETE: "/v1/mqs-recruiting/application-delete",
            RECRUITING_CANDIDATE_APPLICATION_LISTING: "/v1/mqs-recruiting/candidate-application-listing",
            RECRUITING_STATUS_READ_JOB_APPLICATION: "/v1/mqs-recruiting/read-job-application",
            RECRUITING_STATUS_READ_CANDIDATE: "/v1/mqs-recruiting/read-candidate",
            RECRUITING_STATUS_APPLICATION_LISTING: "/v1/mqs-recruiting/status-application-listing",
            RECRUITING_SAVE_HISTORY: "/v1/job-application/save-application-history",
            RECRUITING_GET_HISTORY: "/v1/job-application/list-application-history",
            RECRUITING_GET_SURVEY_METRIC: "/v1/job-application/list-application-fit-index",
            GET_QUESTION_BY_JOB_APPLICATION: "/v1/mqs-quiz/getQuestionByJobApplication",
            GET_ADDITIONAL_DETAILS_BY_JOB_APPLICATION: "/v1/mqs-quiz/getAdditionalDetailByJobApplication",


            // INFORMATION
            INFO_UPLOAD: "/v1/info/upload",
            INFO_LISTALL: "/v1/info",
            INFO_LISTPUBLIC: "/v1/info/documents/public",
            INFO_DOC: "/v1/info/:id",
            INFO_DOWNLOAD: "/v1/info/download/:filename",
            INFO_CATEGORY_LISTALL: "/v1/info-category",
            INFO_CATEGORY_DOC: "/v1/info-category/:id",
            CREATE_CATEGORY: "/v1/info-new-category",
            UPDATE_CATEGORY: "/v1/info-category",
            CREATE_OR_UPDATE_CATEGORY: "/v1/info-category-create-or-update",
            INFO_PUBLIC_DOWNLOAD: '/v1/info/public-download/:lang/:id',

            // USER ACTION
            USER_ACTION_OFFICE: "/v1/user-manager/action/office/:siteKey",
            TOUCHPOINT_ACTION_OFFICE: "/v1/user-manager/action/office/:siteKey/:userId",
            USER_ACTION_DESK: "/v1/user-manager/action/desk/:deskId",
            USER_ACTION_SMARTWORKING: "/v1/user-manager/action/smartworking",
            USER_ACTION_LUNCH: "/v1/user-manager/action/lunch",
            USER_ACTION_OVERTIME: "/v1/user-manager/action/overtime",
            GET_USER_ACTIVITIES: "/v1/user-manager/person/:id/activities/:dateFrom/:dateTo",
            USER_ACTION_LUNCH_SETTINGS: "/v1/user-manager/action/lunch/settings",

            // APPROVAL REQUESTS
            UPDATE_REQUEST: "/v1/approval/request",
            GET_ALL_REQUESTS: "/v1/approval/requests/all",
            GET_USER_REQUESTS: "/v1/approval/requests/all/user/:userId",
            GET_ACCOUNTABLE_REQUESTS: "/v1/approval/requests/all/accountable/:accountableId",
            GET_RESPONSABLE_REQUESTS: "/v1/approval/requests/all/responsable/:responsableId",
            GET_CONSULTED_REQUESTS: "/v1/approval/requests/all/consulted/:consultedId",
            GET_INFORMED_REQUESTS: "/v1/approval/requests/all/informed/:informedId",

            GET_ALL_REQUESTS_BYSTATE: "/v1/approval/requests/all/state/:state",
            GET_USER_REQUESTS_BYSTATE: "/v1/approval/requests/user/state/:userId/:state",
            GET_ACCOUNTABLE_REQUESTS_BYSTATE: "/v1/approval/requests/accountable/state/:accountableId/:state",
            GET_RESPONSABLE_REQUESTS_BYSTATE: "/v1/approval/requests/responsable/state/:responsableId/:state",
            GET_CONSULTED_REQUESTS_BYSTATE: "/v1/approval/requests/consulted/state/:consultedId/:state",
            GET_INFORMED_REQUESTS_BYSTATE: "/v1/approval/requests/informed/state/:informedId/:state",

            GET_ALL_REQUESTS_BYDATE: "/v1/approval/requests/all/date/:start/:end",
            GET_USER_REQUESTS_BYDATE: "/v1/approval/requests/user/date/:userId/:start/:end",
            GET_ACCOUNTABLE_REQUESTS_BYDATE: "/v1/approval/requests/accountable/date/:accountableId/:start/:end",
            GET_RESPONSABLE_REQUESTS_BYDATE: "/v1/approval/requests/responsable/date/:responsableId/:start/:end",
            GET_CONSULTED_REQUESTS_BYDATE: "/v1/approval/requests/consulted/date/:consultedId/:start/:end",
            GET_INFORMED_REQUESTS_BYDATE: "/v1/approval/requests/informed/date/:informedId/:start/:end",

            GET_ALL_REQUESTS_BYJUSTIFICATIVE: "/v1/approval/requests/all/justificative/:justificative",
            GET_USER_REQUESTS_BYJUSTIFICATIVE: "/v1/approval/requests/user/justificative/:userId/:justificative",
            GET_ACCOUNTABLE_REQUESTS_BYJUSTIFICATIVE: "/v1/approval/requests/accountable/justificative/:accountableId/:justificative",
            GET_RESPONSABLE_REQUESTS_BYJUSTIFICATIVE: "/v1/approval/requests/responsable/justificative/:responsableId/:justificative",
            GET_CONSULTED_REQUESTS_BYJUSTIFICATIVE: "/v1/approval/requests/consulted/justificative/:consultedId/:justificative",
            GET_INFORMED_REQUESTS_BYJUSTIFICATIVE: "/v1/approval/requests/informed/justificative/:informedId/:justificative",

            GET_ALL_REQUESTS_BYUSER: "/v1/approval/requests/all/user/:userId",
            GET_ACCOUNTABLE_REQUESTS_BYUSER: "/v1/approval/requests/accountable/user/:accountableId/:userId",
            GET_RESPONSABLE_REQUESTS_BYUSER: "/v1/approval/requests/responsable/user/:responsableId/:userId",
            GET_CONSULTED_REQUESTS_BYUSER: "/v1/approval/requests/consulted/user/:consultedId/:userId",
            GET_INFORMED_REQUESTS_BYUSER: "/v1/approval/requests/informed/user/:informedId/:userId",

            GET_USER_ACTIVITIES_CSV: "/v1/user-manager/person/csv/:scope/:userId/activities/:dateFrom/:dateTo",

            // REPORT
            GET_REPORT_USERS_PRESENCE: "/v1/report/users/presence/:year/:month",

            // CMS
            CMS_LIST: "/v1/mqs-dashboard/cms/list",
            CMS_SAVE_LIST: "/v1/mqs-dashboard/cms/save",
            RECRUITING_SAVE_DEFAULT_IMAGE: '/v1/mqs-dashboard/default-image/save',
            RECRUITING_GET_DEFAULT_IMAGE: '/v1/mqs-dashboard/default-image',

            // PRODUCT TRACKING
            ORDER_LIST: "/v1/product-tracking/orders",
            ORDER: "/v1/product-tracking/order",
            ORDER_BY_ID: "/v1/product-tracking/order/:id",
            ORDER_WITH_PRODUCT: "/v1/product-tracking/order/product/:productId/exists",
            UPDATE_ORDER_PRODUCT: "/v1/product-tracking/order/product/:productId",
            PRODUCT_ACTIVATE: "/v1/product-tracking/order/:orderId/product/:itemId/activate/:codeId",
            PRODUCT_UPDATE: "/v1/product-tracking/order/product/:codeId/status",
            ORDER_PRODUCTS: "/v1/product-tracking/order/:orderId/products",
            PRODUCT_BY_CODE: "/v1/product-tracking/order/products/:codeId",
            ALL_PRODUCTS: "/v1/product-tracking/products",
            DASHBOARD_INFO: "/v1/product-tracking/dashboard",
            PRODUCT_OPERATION_UPDATE: "/v1/product-tracking/order/product/:codeId/operation",

            // PARKING
            PARKING_STATUS: "/v1/parking/status/:action",
            PARKING_BOOK: "/v1/parking/book",
            PARKING_BOOK_REMOVE: "/v1/parking/book/:id",
            PARKING_BOOK_FOR_USER: "/v1/parking/book/:date/:id",
            PARKING_RESOURCES: "/v1/parking/resources",
            PARKING_GET_PERSONAL: "/v1/parking/personal",
            PARKING_UPDATE_POOL: "/v1/parking/pool/:id",
            PARKING_GET_CSV: "/v1/parking/csv",
            PARKING_PREBOOK: "/v1/parking/prebook",
            PARKING_BOOK_AVAILABLE: "/v1/parking/book/available",
            PARKING_STATISTICS: "/v1/parking/statistics",

            // DATA STORAGE
            DATA_STORAGE_UPLOAD: "/v1/data-storage/upload",
            DATA_STORAGE_DOWNLOAD: "/v1/data-storage/download/:id",
            DATA_STORAGE_GET_FILE_DETAILS: "/v1/data-storage/details",
            DATA_STORAGE_REMOVE: "/v1/data-storage/remove/:id",
            EVENT_CHECK_IN_OUT_ACTION: "/v2/event-manager/event/checkIn-out"
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

    getRetryCount() {
        try {
            return this.getRetryCount();
        } catch (ex) {
            return 5;
        }
    }

    // tslint:disable-next-line:no-shadowed-variable
    get<T>(endpoint: string, options?: {}): Observable<T> {
        return this._http.get<T>(this.resolveApiUrl(endpoint), options).pipe(retry(this.getRetryCount()), tap(
            (data) => { return data; },
            (error: HttpErrorResponse) => { return this.handleError(error); }
        ));
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        return this._http.post<T>(this.resolveApiUrl(endpoint), body).pipe(retry(this.getRetryCount()), tap(
            (data) => { return data; },
            (error: HttpErrorResponse) => { return this.handleError(error); }
        ));
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this._http.put<T>(this.resolveApiUrl(endpoint), body).pipe(retry(this.getRetryCount()), tap(
            (data) => { return data; },
            (error: HttpErrorResponse) => { return this.handleError(error); }
        ));
    }

    delete<T>(endpoint: string): Observable<T> {
        return this._http.delete<T>(this.resolveApiUrl(endpoint)).pipe(retry(this.getRetryCount()), tap(
            (data) => { return data; },
            (error: HttpErrorResponse) => { return this.handleError(error); }
        ));
    }

    request(req: HttpRequest<any>): any {
        this._http.request(req).pipe(retry(this.getRetryCount()), tap(
            (data) => { return data; },
            (error: HttpErrorResponse) => { return this.handleError(error); }
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
            (data) => { return data; },
            (error: HttpErrorResponse) => { return this.handleError(error); }
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
