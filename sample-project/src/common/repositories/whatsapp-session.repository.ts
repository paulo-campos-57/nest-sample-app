import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WhatsAppSession } from '../entities/whatsapp-session.entity';

@Injectable()
export class WhatsAppSessionRepository {
  constructor(
    @InjectRepository(WhatsAppSession)
    private readonly repository: Repository<WhatsAppSession>,
  ) {}

  async findBySessionName(
    sessionName: string,
  ): Promise<WhatsAppSession | null> {
    return this.repository.findOne({
      where: { sessionName },
    });
  }

  async saveSession(sessionName: string, authState: any): Promise<void> {
    let session = await this.findBySessionName(sessionName);

    if (!session) {
      session = this.repository.create({
        sessionName,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        authState,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      session.authState = authState;
    }

    await this.repository.save(session);
  }

  async clearSessions(): Promise<void> {
    await this.repository.clear();
  }
}
