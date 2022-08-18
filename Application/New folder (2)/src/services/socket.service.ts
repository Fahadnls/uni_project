import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket;

  constructor() {
    this.socket = io(environment.baseurl);
  }

}
