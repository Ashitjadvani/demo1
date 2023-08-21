

export const environment = {
    production: true,
    debug: false,

    //api_host: "https://irina.legance.it/api",
    api_host: "http://192.168.1.158:9000/api",
    home_page: "http://192.168.1.158:9000/job-details/",
    event_accept: "http://192.168.1.158:9000/event-manager/event/",

    /*api_host: "http://110.227.199.99:9000/api",
    home_page: "http://110.227.199.99:9000/job-details/",
    event_accept: "http://110.227.199.99:9000/event-manager/event/",*/

    api: {
        ui_type_id: "48075600-D350-4587-8652-A4B13E30B4D8",
        qr_instantbook_hours_offset: 1,
        qr_extendsbook_minutes_offset: 30,
        bookings_by_resource_hours_duration: 4
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
export const prodEnvironment = {
    productionEnvironment: environment.production,
    ENV: environment.api_host
};
