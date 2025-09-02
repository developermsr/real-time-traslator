
export enum MessageType {
  TRANSCRIPTION,
  ANSWER,
}

export interface Message {
  id: string;
  type: MessageType;
  text: string;
}
