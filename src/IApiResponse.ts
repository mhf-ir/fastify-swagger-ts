export enum MessageType {
  Emergency = 'emerg',
  Alert = 'alert',
  Critical = 'crit',
  Error = 'err',
  Warning = 'warning',
  Notice = 'notice',
  Informational = 'info',
  Debug = 'debug',
}

export interface IMessage {
  type: MessageType;
  field?: string;
  message?: string;
}

export interface IApiResponse {
  statusCode: number;
  messages?: IMessage[];
  body?: any;
}
