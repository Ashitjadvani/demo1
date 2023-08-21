// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
    debug: true,
    testing: true,

    //api_host: "http://localhost:10000/api",
    // api_host: "http://localhost:8000/api",
    // api_host: "http://122.169.113.151:9000/api",
    // api_host: "http://192.168.29.42:8000/api",
    // api_host: "http://192.168.1.41:8000/api",
    api_host: "http://192.168.1.158:9000/api",
    // api_host: "http://localhost:8000/api",
    // api_host: "https://irina.legance.it/api/",
    // home_page: "http://122.169.113.151/legance/job-details/",
    home_page: "http://192.168.1.158/legance/job-details/",
    event_accept: "http://192.168.1.158/event-manager/event/",
    CLIENT_ID : '675549511936-7b79coi35r69jgnlb7k30eimpg6rdod4.apps.googleusercontent.com',
    API_KEY : 'AIzaSyDEdpxcjNNMDmr7mIavQya5VEE26xFlNOM',
    // Discovery doc URL for APIs used by the quickstart
    DISCOVERY_DOC : 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    SCOPES : 'https://www.googleapis.com/auth/calendar',

    api: {
        ui_type_id: "48075600-D350-4587-8652-A4B13E30B4D8",
        qr_instantbook_hours_offset: 1,
        qr_extendsbook_minutes_offset: 30,
        bookings_by_resource_hours_duration: 4 //TODO: ridurre a 0.5 (massimo 1)
    },

    connection: {
        retry_count: 0
    },

    format: {
        date: "yyyy-MM-ddTHH:mm",
        date_exclusive: "yyyy-MM-dd",
        date_display: "dd/MM/yyyy",
        time_display: "HH:mm",
    },

    notify: {
        display_time: 5000
    },

    zone: {
        locale: "en-US",
        time_zone_info_id: "Central European Standard Time"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
