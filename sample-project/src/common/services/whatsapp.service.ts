/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';

import makeWASocket, {
  DisconnectReason,
  WASocket,
  initAuthCreds,
} from '@whiskeysockets/baileys';

import * as QRCode from 'qrcode-terminal';
import { WhatsAppSessionRepository } from '../repositories/whatsapp-session.repository';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  constructor(private readonly sessionRepository: WhatsAppSessionRepository) {}

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

  private async getAuthState() {
    const sessionName = 'default';

    const savedSession =
      await this.sessionRepository.findBySessionName(sessionName);

    const authState = savedSession?.authState ?? {
      creds: initAuthCreds(),
      keys: {},
    };

    const state = {
      creds: authState.creds,

      keys: {
        async get(type: string, ids: string[]) {
          const category = authState.keys?.[type] || {};
          const result: Record<string, any> = {};

          for (const id of ids) {
            if (category[id]) {
              result[id] = category[id];
            }
          }

          return result;
        },

        async set(data: Record<string, any>) {
          authState.keys = authState.keys || {};

          for (const category in data) {
            authState.keys[category] = {
              ...(authState.keys[category] || {}),
              ...data[category],
            };
          }
        },
      },
    };

    const saveCreds = async () => {
      await this.sessionRepository.saveSession(sessionName, {
        creds: state.creds,
        keys: authState.keys,
      });
    };

    return { state, saveCreds };
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

    const { state, saveCreds } = await this.getAuthState();

    this.socket = makeWASocket({
      auth: state,

      printQRInTerminal: false,

      browser: ['Ubuntu', 'Chrome', '22.04.4'],

      syncFullHistory: false,
    });

    const socket = this.socket;

    socket.ev.on('creds.update', () => {
      void saveCreds();
    });

    socket.ev.on('connection.update', (update) => {
      const { connection, qr, lastDisconnect } = update;

      if (qr) {
        console.clear();
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

          setTimeout(() => {
            void this.initializeSocket();
          }, 3000);
        } else {
          console.log(
            'Session expired. Delete the saved session in the database and scan the QR code again.',
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

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.socket.sendMessage(jid, { text: message });
        console.log('Message sent successfully.');
        return;
      } catch (error) {
        console.log(`Attempt ${attempt} failed.`);

        if (attempt === 3) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
  private async waitUntilConnected(timeout = 30000): Promise<void> {
    const start = Date.now();

    while (!this.isConnected) {
      if (Date.now() - start > timeout) {
        throw new Error('Timeout waiting for WhatsApp connection');
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  isReady(): boolean {
    return this.socket !== null && this.isConnected;
  }
}
