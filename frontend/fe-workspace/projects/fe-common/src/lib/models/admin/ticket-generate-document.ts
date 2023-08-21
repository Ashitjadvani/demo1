export enum NEWS_ACTION_TYPE {
  READ = 'Read',
  CONFIRM = 'Confirm'
};

export class TicketGenerateDocument {
    id: string;
    name: string;
    email: string;
    urgency: string;
    subject: string;
    message: string;

    static Empty(): TicketGenerateDocument {
        let document: TicketGenerateDocument = new TicketGenerateDocument();
        document.name = '';
        document.email = '';
        document.urgency = '1';
        document.subject = '';
        document.message = '';
        return document;
    }
}
