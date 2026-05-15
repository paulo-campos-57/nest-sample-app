import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('whatsapp_sessions')
export class WhatsAppSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sessionName!: string;

  @Column({ type: 'simple-json', nullable: true })
  authState!: any;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
