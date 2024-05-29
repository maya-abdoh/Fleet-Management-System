import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messageSubject: Subject<string> = new Subject<string>();
  private isConnected: boolean = false;
  private messageQueue: string[] = [];

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket('ws://localhost:8181');

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.isConnected = true;
      this.flushMessageQueue();
    };

    this.socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  sendMessage(message: string): void {
    const jsonMessage = JSON.stringify({ message: message });
    if (this.isConnected) {
      this.socket.send(jsonMessage);
    } else {
      console.error('WebSocket connection is not established. Queuing message.');
      this.messageQueue.push(jsonMessage);
    }
  }
  
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.socket.send(message);
      }
    }
  }

  closeConnection(): void {
    this.socket.close();
  }

  onMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  waitForConnection(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isConnected) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.isConnected) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }
}
