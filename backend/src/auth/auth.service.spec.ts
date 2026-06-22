import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

const mockUserService = {
  updateRefreshToken: jest.fn(),
  findOne: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('retourne un hash bcrypt different du mot de passe original', async () => {
      const password = 'MyPassword1!';
      const hashed = await service.hash(password);
      expect(hashed).not.toBe(password);
      expect(hashed).toMatch(/^\$2[ab]\$\d+\$/);
    });

    it('deux appels avec le meme mot de passe donnent des hashes differents (salt)', async () => {
      const h1 = await service.hash('Password1!');
      const h2 = await service.hash('Password1!');
      expect(h1).not.toBe(h2);
    });
  });

  describe('compare', () => {
    it('retourne true quand le mot de passe correspond au hash', async () => {
      const password = 'MyPassword1!';
      const hashed = await service.hash(password);
      const result = await service.compare(password, hashed);
      expect(result).toBe(true);
    });

    it('retourne false quand le mot de passe ne correspond pas', async () => {
      const hashed = await service.hash('CorrectPassword1!');
      const result = await service.compare('WrongPassword1!', hashed);
      expect(result).toBe(false);
    });
  });

  describe('createTokens', () => {
    it('genere un accessToken et un refreshToken, et stocke le refresh hache', async () => {
      process.env.ACCESSSECRET = 'access-secret';
      process.env.REFRESHSECRET = 'refresh-secret';
      process.env.ACCESSEXPIRE = '5m';
      process.env.REFRESHEXPIRE = '7d';
      process.env.JWTALGORITHM = 'HS512';

      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token-value')
        .mockResolvedValueOnce('refresh-token-value');

      mockUserService.updateRefreshToken.mockResolvedValue(undefined);

      const tokens = await service.createTokens('user-uuid-123');

      expect(tokens.accessToken).toBe('access-token-value');
      expect(tokens.refreshToken).toBe('refresh-token-value');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        'user-uuid-123',
        expect.any(String),
      );
      const storedToken = mockUserService.updateRefreshToken.mock.calls[0][1] as string;
      expect(storedToken).not.toBe('refresh-token-value');
      expect(storedToken).toMatch(/^\$2[ab]\$\d+\$/);
    });
  });

  describe('verifyRefreshToken', () => {
    it('leve une erreur si le refreshToken est null (revoque)', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-id', iat: 0, exp: 9999999999 });
      mockUserService.findOne.mockResolvedValue({ id: 'user-id', refreshToken: null });

      await expect(service.verifyRefreshToken('some-token')).rejects.toThrow('Token révoqué');
    });

    it('leve une erreur si le token ne correspond pas au hash stocke', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-id', iat: 0, exp: 9999999999 });
      const hashedOtherToken = await service.hash('other-token');
      mockUserService.findOne.mockResolvedValue({
        id: 'user-id',
        refreshToken: hashedOtherToken,
      });

      await expect(service.verifyRefreshToken('my-token')).rejects.toThrow('Token invalide');
    });

    it('retourne le payload si le token est valide', async () => {
      const payload = { sub: 'user-id', iat: 0, exp: 9999999999 };
      const rawToken = 'raw-refresh-token';
      const hashedToken = await service.hash(rawToken);

      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserService.findOne.mockResolvedValue({
        id: 'user-id',
        refreshToken: hashedToken,
      });

      const result = await service.verifyRefreshToken(rawToken);
      expect(result).toEqual(payload);
    });
  });

  describe('setCookie / clearCookie', () => {
    it('setCookie appelle res.cookie avec httpOnly=true', () => {
      const mockRes = { cookie: jest.fn() } as any;
      service.setCookie('refreshToken', 'token-value', mockRes);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'token-value',
        expect.objectContaining({ httpOnly: true, sameSite: 'strict' }),
      );
    });

    it('clearCookie appelle res.clearCookie', () => {
      const mockRes = { clearCookie: jest.fn() } as any;
      service.clearCookie('refreshToken', mockRes);
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });
});
