import { Global, Module } from '@nestjs/common';
import { WhatsAppService } from './services/whatsapp.service';

@Global()
@Module({
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class CommonModule {}
