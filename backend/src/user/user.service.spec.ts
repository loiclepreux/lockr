import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  profile: {
    update: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('cree un utilisateur et retourne les donnees sans password ni refreshToken', async () => {
      const input = {
        email: 'test@example.com',
        password: 'hashed',
        firstName: 'Jean',
        lastName: 'Dupont',
      };
      const created = { id: 'uuid-1', email: input.email, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.user.create.mockResolvedValue(created);

      const result = await service.create(input);
      expect(result).toEqual(created);
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: input.email,
            profile: { create: { firstName: 'Jean', lastName: 'Dupont' } },
          }),
        }),
      );
    });
  });

  describe('countByEmail', () => {
    it('retourne le nombre d utilisateurs avec cet email', async () => {
      mockPrisma.user.count.mockResolvedValue(1);
      const result = await service.countByEmail('existing@example.com');
      expect(result).toBe(1);
      expect(mockPrisma.user.count).toHaveBeenCalledWith({
        where: { email: 'existing@example.com' },
      });
    });

    it("retourne 0 si l'email n'existe pas", async () => {
      mockPrisma.user.count.mockResolvedValue(0);
      const result = await service.countByEmail('new@example.com');
      expect(result).toBe(0);
    });
  });

  describe('findOne', () => {
    it('retourne l utilisateur sans le mot de passe', async () => {
      const user = { id: 'uuid-1', email: 'test@example.com', refreshToken: 'hashed' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        omit: { password: true },
      });
    });

    it("retourne null si l'utilisateur n'existe pas", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findOne('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('retourne l utilisateur complet (avec password) pour la verification', async () => {
      const user = { id: 'uuid-1', email: 'test@example.com', password: 'bcrypt-hash' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });
  });

  describe('updateRefreshToken', () => {
    it('met a jour le refreshToken de l utilisateur', async () => {
      mockPrisma.user.update.mockResolvedValue({});
      await service.updateRefreshToken('uuid-1', 'hashed-token');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: { refreshToken: 'hashed-token' },
      });
    });

    it('accepte null pour revoquer le token (logout)', async () => {
      mockPrisma.user.update.mockResolvedValue({});
      await service.updateRefreshToken('uuid-1', null);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: { refreshToken: null },
      });
    });
  });

  describe('changePassword', () => {
    it('leve une erreur 404 si l utilisateur est introuvable', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('uuid-1', {
          currentPassword: 'old',
          newPassword: 'NewPassword1!',
        }),
      ).rejects.toThrow(new HttpException('Utilisateur introuvable', HttpStatus.NOT_FOUND));
    });

    it('leve une erreur 400 si le mot de passe actuel est incorrect', async () => {
      const hashedOld = await bcrypt.hash('correct-old-password', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'uuid-1', password: hashedOld });

      await expect(
        service.changePassword('uuid-1', {
          currentPassword: 'wrong-password',
          newPassword: 'NewPassword1!',
        }),
      ).rejects.toThrow(new HttpException('Mot de passe actuel incorrect', HttpStatus.BAD_REQUEST));
    });

    it('met a jour le mot de passe si les donnees sont valides', async () => {
      const oldPassword = 'OldPassword1!';
      const hashedOld = await bcrypt.hash(oldPassword, 10);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'uuid-1', password: hashedOld });
      mockPrisma.user.update.mockResolvedValue({});

      await service.changePassword('uuid-1', {
        currentPassword: oldPassword,
        newPassword: 'NewPassword1!',
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: { password: expect.any(String) },
      });

      const newHashedPassword = mockPrisma.user.update.mock.calls[0][0].data.password as string;
      expect(newHashedPassword).not.toBe('NewPassword1!');
      expect(newHashedPassword).toMatch(/^\$2[ab]\$\d+\$/);
    });
  });
});
