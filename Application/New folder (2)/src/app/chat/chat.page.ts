import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';
import { ChatService } from 'src/services/chat.service';
import { SocketService } from 'src/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('content', { static: true }) content: IonContent;

  message = '';
  socket = this.socketsService.socket;

  messagesArray = [];

  constructor(
    private socketsService: SocketService,
    private messageService: ChatService,
    public authService :AuthService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.chatFunction();
    this.getAllMessage();
    
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
      let chatSection = document.getElementById('chat');
      chatSection.scrollTop = chatSection.scrollHeight;
    }, 300);
  }
  getAllMessage() {
    let localData = JSON.parse(localStorage.getItem('userData'));
    this.messageService.GetAllMessages(localData.id).subscribe((resp: any) => {
      this.messagesArray = resp;
      this.scrollToBottom();
    });
  }
  isGuestUser() {
    return this.authService.isGuestUser();
  }

  chatFunction() {
    let localData = JSON.parse(localStorage.getItem('userData'));
    this.socket
      .off('listenchat' + localData.id)
      .on('listenchat' + localData.id, (data) => {
        if (data.isAdmin) {
          this.messagesArray.push(data);
          this.scrollToBottom();
        }
      });
  }

  sendMessage() {
    let localData = JSON.parse(localStorage.getItem('userData'));
    if (this.message) {
      let data = {
        userId: localData.id,
        isAdmin: false,
        messageBody: this.message,
        messageTime : new Date()
      };
      this.messagesArray.push(data);
      this.scrollToBottom();
      this.message = '';

      this.messageService.SendMessage(data).subscribe((resp: any) => {
        this.socket.emit('refresh', data);
      });
    }
  }
}
