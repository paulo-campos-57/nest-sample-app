import { Global, Module } from '@nestjs/common';
import { WhatsAppService } from './services/whatsapp.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class CommonModule {}
