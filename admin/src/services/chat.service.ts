import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  url = environment.baseUrl;
  constructor(public http: HttpClient) {}

  get_All_Conversations() {
    return this.http.get(this.url + "message/get-all-conversations");
  }
  GetAllMessages(userId) {
    return this.http.get(this.url + "message/get-all-messages/" + userId);
  }

  SendMessage(data) {
    return this.http.post(this.url + "message/send-message", data);
  }
  deleteConversation(id,data) {
    return this.http.post(this.url + "message/delete-conversation-and-all-messages/"+ id,data);
  }
}
