import { Component, HostBinding, OnInit, ViewChild } from "@angular/core";
import {
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
import { isUndefined } from "util";
import { environment } from "../../../environments/environment";
import { ChatService } from "../../../services/chat.service";
import { SocketService } from "../../../services/socket.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: [
    "../../../vendor/libs/ngx-perfect-scrollbar/ngx-perfect-scrollbar.scss",
    "../../../vendor/styles/pages/chat.scss",
    "./support.component.scss",
  ],
})
export class SupportComponent implements OnInit {
  url = environment.baseUrl;
  sideboxOpen = false;
  socket = this.socketService.socket;

  @HostBinding("class") private hostClasses =
    "d-flex flex-grow-1 align-items-stretch";
  @ViewChild("psBottom") psBottom: PerfectScrollbarDirective;
  constructor(
    private appService: AppService,
    private chatService: ChatService,
    private socketService: SocketService
  ) {
    this.appService.pageTitle = "Supports";
  }
  contactsData = [];
  chatData = [];
  message = "";

  selectedUser = {
    id: 0,
    fullName: "",
    profileImage: "",
  };
  chatUser;
  ngOnInit() {
    this.chatService.get_All_Conversations().subscribe((resp: any) => {
      this.contactsData = resp;

      resp.forEach((element) => {
        element.isSelected = false;
      });
    });
  }

  showUserChat(i) {
    this.selectedUser = this.contactsData[i].messages[0].user;
    this.chatUser = this.contactsData[i];
    this.selectedUser.id = this.contactsData[i].messages[0].userId;
    this.chatFunction();
    this.getUserChat();
    this.contactsData.forEach((element, index) => {
      if (element.id == this.contactsData[i].id) {
        this.contactsData[index].isSelected = true;
      } else {
        this.contactsData[index].isSelected = false;
      }
    });
  }
  chatFunction() {
    this.socket
      .off("listenchat" + this.selectedUser.id)
      .on("listenchat" + this.selectedUser.id, (data) => {
        if (!data.isAdmin) {
          this.chatData.push(data);
        }
      });
  }

  getUserChat() {
    this.chatData = [];
    this.chatService
      .GetAllMessages(this.selectedUser.id)
      .subscribe((resp: any) => {
        this.chatData = resp;
        setTimeout(() => {
          this.psBottom.scrollToBottom(0, 500);
        }, 100);
      });
  }

  sendMessage() {
    if (this.message) {
      let data = {
        userId: this.selectedUser.id,
        isAdmin: true,
        messageBody: this.message,
        messageTime: new Date(),
      };
      this.chatData.push(data);
      this.message = "";
      setTimeout(() => {
        this.psBottom.scrollToBottom(0, 500);
      }, 100);
      this.contactsData.forEach((element, index) => {
        if (element.userId == this.selectedUser.id) {
          if (index != 0) {
            this.contactsData.splice(index, 1);
            this.contactsData.unshift(element);
          }
        }
      });
      this.chatService.SendMessage(data).subscribe((resp: any) => {
        this.socket.emit("refresh", data);
      });
    }
  }
  deleteConservations() {
    let index = this.contactsData.findIndex(
      (val) => val.id === this.chatUser.id
    );
    this.chatService
      .deleteConversation(this.chatUser.id, this.chatUser)
      .subscribe((resp: any) => {
        this.contactsData.splice(index, 1);
        this.chatData = [];
      });
  }
}
