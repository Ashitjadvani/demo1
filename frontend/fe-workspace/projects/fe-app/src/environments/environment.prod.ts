export const environment = {
    production: true,
    debug: false,

    api_host: "https://irina.legance.it/api",
     // api_host: 'http://122.169.113.151:9000/api',

    api : {
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
