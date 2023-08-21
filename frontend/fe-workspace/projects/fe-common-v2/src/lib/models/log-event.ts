export enum LOG_LEVEL {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR'
};

export class LogEvent {
    message: string;
    level: LOG_LEVEL;
}

export class LogItem extends LogEvent {
    timestamp: Date;
    user: string;
}