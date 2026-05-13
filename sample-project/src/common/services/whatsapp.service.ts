import { Injectable, OnModuleInit } from '@nestjs/common';

import makeWASocket, {
  DisconnectReason,
  WASocket,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';

import * as QRCode from 'qrcode-terminal';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private socket: WASocket | null = null;
  private isConnected = false;
  private initialized = false;

  async onModuleInit(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    await this.initializeSocket();
  }

  private async initializeSocket(): Promise<void> {
    if (this.socket) {
      try {
        void this.socket.end(undefined);
      } catch (error) {
        console.error('Failed to close previous socket:', error);
      }

      this.socket = null;
      this.isConnected = false;
    }

    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    this.socket = makeWASocket({
      auth: state,
    });

    const socket = this.socket;

    socket.ev.on('creds.update', () => {
      void saveCreds();
    });

    socket.ev.on('connection.update', (update) => {
      const { connection, qr, lastDisconnect } = update;

      if (qr) {
        console.log('Scan the QR code below:');
        QRCode.generate(qr, { small: true });
      }

      if (connection === 'open') {
        this.isConnected = true;
        console.log('WhatsApp connected successfully.');
      }

      if (connection === 'close') {
        this.isConnected = false;

        const statusCode = (
          lastDisconnect?.error as {
            output?: { statusCode?: number };
          }
        )?.output?.statusCode;

        console.log(`WhatsApp connection closed. Status code: ${statusCode}`);

        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          console.log('Reconnecting to WhatsApp...');
          void this.initializeSocket();
        } else {
          console.log(
            'Session expired. Delete auth_info and scan the QR code again.',
          );
        }
      }
    });
  }

  async sendMessage(phone: string, message: string): Promise<void> {
    await this.waitUntilConnected();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (!this.socket) {
      throw new Error('WhatsApp socket not initialized');
    }

    const socket = this.socket;

    const sanitizedPhone = phone.replace(/\D/g, '');

    console.log('Sending message to:', {
      phone: sanitizedPhone,
    });

    const onWhatsAppResult = await socket.onWhatsApp(sanitizedPhone);

    console.log(
      'onWhatsApp result:',
      JSON.stringify(onWhatsAppResult, null, 2),
    );

    if (!onWhatsAppResult) {
      throw new Error('ERROR: onWhatsAppResult');
    }

    if (!onWhatsAppResult.length) {
      throw new Error(`Phone ${sanitizedPhone} is not registered on WhatsApp`);
    }

    const jid = onWhatsAppResult[0].jid;

    console.log('Resolved JID:', jid);

    const result = await socket.sendMessage(jid, {
      text: message,
    });

    console.log('Message sent successfully:', JSON.stringify(result, null, 2));
  }
  private async waitUntilConnected(timeoutMs = 15000): Promise<void> {
    const start = Date.now();

    while (!this.isConnected) {
      const elapsed = Date.now() - start;

      if (elapsed > timeoutMs) {
        throw new Error('Timeout waiting for WhatsApp connection');
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }
  isReady(): boolean {
    return this.socket !== null && this.isConnected;
  }
}
