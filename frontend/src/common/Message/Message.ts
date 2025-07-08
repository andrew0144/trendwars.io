class Message {
  msgType: string;
  msgData: any;

  constructor(msgType: string, msgData: any) {
    this.msgType = msgType;
    this.msgData = msgData;
  }

  toJSON() {
    const obj = {
      msgType: this.msgType,
      msgData: this.msgData,
    };
    return JSON.stringify(obj);
  }

  static fromJSON(json: string) {
    const obj = JSON.parse(json);
    return new Message(obj.msgType, obj.msgData);
  }
}

export default Message;
