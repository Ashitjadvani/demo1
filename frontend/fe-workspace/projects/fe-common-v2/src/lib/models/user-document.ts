export class Document {
    id: string;
    name: string;
    companyId: string;
    deleted: boolean;

    static Empty(): Document {
        let document = new Document();
        document.name = "";
        document.companyId = "";
        document.deleted = false;
        return document;
    }
}

export class UserDocument {
    id: string;
    documentId: string;
    userId: string;
    fileName: string;
    fileId: string;
    timestamp: Date;
    expirationDate: Date;
    staffDocumentName:string
    deleted: boolean;

    static Empty(): UserDocument {
        let document = new UserDocument();
        document.documentId = "";
        document.userId = "";
        document.fileName = "";
        document.fileId = "";
        document.staffDocumentName="";
        document.deleted = false;
        document.timestamp = new Date();
        return document;
    }
}
