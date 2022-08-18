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

  messagesArray = [
    {
      id: 17,
      isAdmin: null,
      messageBody:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      isDeleted: false,
      createdAt: '2021-12-11T12:33:55.000Z',
      updatedAt: '2021-12-11T12:33:55.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 20,
      isAdmin: null,
      messageBody: 'Hi',
      isDeleted: false,
      createdAt: '2021-12-11T12:46:05.000Z',
      updatedAt: '2021-12-11T12:46:05.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 21,
      isAdmin: null,
      messageBody: "I'm Admin",
      isDeleted: false,
      createdAt: '2021-12-11T13:16:21.000Z',
      updatedAt: '2021-12-11T13:16:21.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 23,
      isAdmin: null,
      messageBody: 'Line 1\nLine 2',
      isDeleted: false,
      createdAt: '2021-12-11T13:22:59.000Z',
      updatedAt: '2021-12-11T13:22:59.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 30,
      isAdmin: null,
      messageBody: 'Hello Fahad',
      isDeleted: false,
      createdAt: '2021-12-11T13:31:30.000Z',
      updatedAt: '2021-12-11T13:31:30.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 31,
      isAdmin: null,
      messageBody: 'once more',
      isDeleted: false,
      createdAt: '2021-12-11T13:32:05.000Z',
      updatedAt: '2021-12-11T13:32:05.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 32,
      isAdmin: null,
      messageBody: 'socket',
      isDeleted: false,
      createdAt: '2021-12-11T13:33:04.000Z',
      updatedAt: '2021-12-11T13:33:04.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 37,
      isAdmin: null,
      messageBody: 'Hi Admin',
      isDeleted: false,
      createdAt: '2021-12-11T13:36:04.000Z',
      updatedAt: '2021-12-11T13:36:04.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 38,
      isAdmin: null,
      messageBody: 'Hello Oye',
      isDeleted: false,
      createdAt: '2021-12-11T13:36:52.000Z',
      updatedAt: '2021-12-11T13:36:52.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 17,
      isAdmin: true,
      messageBody:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      isDeleted: false,
      createdAt: '2021-12-11T12:33:55.000Z',
      updatedAt: '2021-12-11T12:33:55.000Z',
      conversationId: 1,
      userId: 1,
    },
    {
      id: 17,
      isAdmin: null,
      messageBody:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      isDeleted: false,
      createdAt: '2021-12-11T12:33:55.000Z',
      updatedAt: '2021-12-11T12:33:55.000Z',
      conversationId: 1,
      userId: 1,
    },
  ];

  constructor(
    private socketsService: SocketService,
    private messageService: ChatService,
    public authService: AuthService
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
        messageTime: new Date(),
        createdAt: '',
        updatedAt: '',
        isDeleted: false,
        conversationId: 0,
        id: 0,
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
