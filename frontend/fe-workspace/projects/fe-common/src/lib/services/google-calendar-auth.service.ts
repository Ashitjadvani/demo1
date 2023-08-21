import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var gapi:any;
@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarAuthService {
    public auth2: any;
    public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // CLIENT_ID = '675549511936-7b79coi35r69jgnlb7k30eimpg6rdod4.apps.googleusercontent.com';
    CLIENT_ID = '625887814774-hiccphug9ia1torij90j31mtlgakcrdv.apps.googleusercontent.com';
    // API_KEY = 'AIzaSyDEdpxcjNNMDmr7mIavQya5VEE26xFlNOM';
    API_KEY = 'AIzaSyCSu1qBrm6dDt7k48GQwOSAXP0wApd5LDU';

    // Discovery doc URL for APIs used by the quickstart
    DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    SCOPES = 'https://www.googleapis.com/auth/calendar';
    response: any;
    responseInsert: any;

    constructor(private zone: NgZone, private http: HttpClient) { }
    loadAuth2(): void {
        gapi.load('client', () => {
            gapi.client.init({
                client_id: this.CLIENT_ID,
                fetch_basic_profile: true,
                apiKey: this.API_KEY,
                discoveryDocs: [this.DISCOVERY_DOC],
            }).then((auth) => {
                    this.zone.run(() => {
                        this.auth2 = auth;
                        this.isLoaded$.next(true);
                    });
                },
            );
        });
    }


   async viewList(){

        try {
            const request = {
                'calendarId': 'ashit.multiqos@gmail.com',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime',
            };
            this.response = await gapi.client.calendar.events.list(request);
            console.log("response===.",this.response)
        } catch (err) {
            console.log("err.message",err.message)
            // document.getElementById('content').innerText = err.message;
            return;
        }

        const events = this.response.result?.items;
        if (!events || events.length == 0) {
            console.log("no data found")
            // document.getElementById('content').innerText = 'No events found.';
            return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n');
        // document.getElementById('content').innerText = output;
        console.log("output",output)
    }
    async createEvent(){

        try {
            const event = {
                'summary': 'Working',
                'location': '800 Howard St., San Francisco, CA 94103',
                'description': 'A chance to hear more about Google\'s developer products.',
                'start': {
                    'dateTime': '2022-12-16T09:00:00-07:00',
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': '2022-12-17T17:00:00-07:00',
                    'timeZone': 'America/Los_Angeles'
                },
                'recurrence': [
                    'RRULE:FREQ=DAILY;COUNT=2'
                ],
                'attendees': [
                    {
                        "email": "yogini.multiqos@gmail.com",
                        "responseStatus": "accepted"
                    },
                    {
                        "email": "jadvani.ashit@gmail.com",
                        "responseStatus": "accepted"
                    },
                ],
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10}
                    ]
                }
            };
            this.responseInsert = await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
            const events = this.responseInsert.result.items;
            if (!events || events) {
                // document.getElementById('content').innerText = 'Event added successfully';
                console.log('Event added successfully')
                return;
            }
        } catch (err) {
            console.log(err.message)
            return;
        }

        try {

            const request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
            console.log(request)
            // request.execute(function(event) {
            //     appendPre('Event created: ' + event.htmlLink);
            //     console.log(event)
            // });
        } catch (err) {
            console.log(err.message)
            return;
        }
    }
}
