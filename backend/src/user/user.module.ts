import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  // PrismaService vient du PrismaModule global : une seule connexion à la base pour toute l'appli
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
