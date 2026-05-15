import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WhatsAppService } from './services/whatsapp.service';
import { WhatsAppSessionRepository } from './repositories/whatsapp-session.repository';
import { WhatsAppSession } from './entities/whatsapp-session.entity';

@Global()
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([WhatsAppSession])],
  providers: [WhatsAppService, WhatsAppSessionRepository],
  exports: [WhatsAppService, WhatsAppSessionRepository],
})
export class CommonModule {}
