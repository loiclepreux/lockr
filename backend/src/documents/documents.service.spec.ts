import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DocumentsService } from './documents.service';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { DocStatus } from 'prisma/generated/prisma/client';

const mockPrisma = {
  doc: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  sharedDoc: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockActivityLog = { create: jest.fn() };
const mockEventEmitter = { emit: jest.fn() };

const OWNER_ID = 'owner-uuid';
const DOC_ID = 'doc-uuid';

const makeDoc = (overrides = {}) => ({
  id: DOC_ID,
  name: 'test.pdf',
  ownerId: OWNER_ID,
  deletedAt: null,
  status: 'ACTIVE',
  priority: 'LOW',
  extension: 'pdf',
  size: BigInt(1024),
  filePath: '/uploads/documents/test.pdf',
  addedDate: new Date(),
  docTypeId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ActivityLogService, useValue: mockActivityLog },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retourne les documents pagines avec meta', async () => {
      const docs = [makeDoc()];
      mockPrisma.$transaction.mockResolvedValue([docs, 1]);

      const result = await service.findAll(OWNER_ID, 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 20, totalPages: 1 });
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('calcule correctement le totalPages', async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 45]);
      const result = await service.findAll(OWNER_ID, 1, 20);
      expect(result.meta.totalPages).toBe(3);
    });
  });

  describe('findOne', () => {
    it('retourne le document si l utilisateur en est proprietaire', async () => {
      mockPrisma.doc.findFirst.mockResolvedValue(makeDoc());
      const result = await service.findOne(DOC_ID, OWNER_ID);
      expect(result.id).toBe(DOC_ID);
    });

    it('leve NotFoundException si le document n existe pas', async () => {
      mockPrisma.doc.findFirst.mockResolvedValue(null);
      await expect(service.findOne('unknown-id', OWNER_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove (soft delete)', () => {
    it('soft-delete le document et journalise l action', async () => {
      const doc = makeDoc();
      mockPrisma.doc.findFirst.mockResolvedValue(doc);
      mockPrisma.doc.update.mockResolvedValue({ ...doc, deletedAt: new Date(), status: 'DELETED' });
      mockActivityLog.create.mockResolvedValue({});

      await service.remove(DOC_ID, OWNER_ID);

      expect(mockPrisma.doc.update).toHaveBeenCalledWith({
        where: { id: DOC_ID },
        data: { deletedAt: expect.any(Date), status: 'DELETED' },
      });
      expect(mockActivityLog.create).toHaveBeenCalledTimes(1);
    });

    it('leve ForbiddenException si l utilisateur n est pas proprietaire', async () => {
      mockPrisma.doc.findFirst.mockResolvedValue(makeDoc({ ownerId: 'other-user' }));
      await expect(service.remove(DOC_ID, OWNER_ID)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('shareDocument', () => {
    it('cree un partage et emet un evenement de notification', async () => {
      const receiver = { id: 'receiver-uuid', email: 'receiver@example.com' };
      mockPrisma.doc.findFirst.mockResolvedValue(makeDoc());
      mockPrisma.user.findUnique.mockResolvedValue(receiver);
      mockPrisma.sharedDoc.findUnique.mockResolvedValue(null);
      mockPrisma.sharedDoc.create.mockResolvedValue({ docId: DOC_ID, receiverId: receiver.id });
      mockActivityLog.create.mockResolvedValue({});

      await service.shareDocument(
        DOC_ID,
        { receiverId: receiver.id },
        OWNER_ID,
      );

      expect(mockPrisma.sharedDoc.create).toHaveBeenCalledTimes(1);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'notif.trigger',
        expect.objectContaining({ userId: receiver.id }),
      );
    });

    it('leve BadRequestException si le document est deja partage avec cet utilisateur', async () => {
      mockPrisma.doc.findFirst.mockResolvedValue(makeDoc());
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'receiver-uuid' });
      mockPrisma.sharedDoc.findUnique.mockResolvedValue({ docId: DOC_ID, receiverId: 'receiver-uuid' });

      await expect(
        service.shareDocument(DOC_ID, { receiverId: 'receiver-uuid' }, OWNER_ID),
      ).rejects.toThrow(BadRequestException);
    });

    it('leve NotFoundException si le destinataire n existe pas', async () => {
      mockPrisma.doc.findFirst.mockResolvedValue(makeDoc());
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.shareDocument(DOC_ID, { receiverId: 'ghost-uuid' }, OWNER_ID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('restaure le document en statut ACTIVE', async () => {
      const deletedDoc = makeDoc({ deletedAt: new Date(), status: 'DELETED' });
      mockPrisma.doc.findFirst.mockResolvedValue(deletedDoc);
      mockPrisma.doc.update.mockResolvedValue({ ...deletedDoc, deletedAt: null, status: 'ACTIVE' });
      mockActivityLog.create.mockResolvedValue({});

      await service.restore(DOC_ID, OWNER_ID);

      expect(mockPrisma.doc.update).toHaveBeenCalledWith({
        where: { id: DOC_ID },
        data: { deletedAt: null, status: DocStatus.ACTIVE },
      });
    });

    it('leve NotFoundException si le document n est pas dans la corbeille', async () => {
      mockPrisma.doc.findFirst.mockResolvedValue(null);
      await expect(service.restore('unknown-id', OWNER_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('permanentDelete', () => {
    it('supprime physiquement le document et journalise', async () => {
      const deletedDoc = makeDoc({ deletedAt: new Date() });
      mockPrisma.doc.findFirst.mockResolvedValue(deletedDoc);
      mockActivityLog.create.mockResolvedValue({});
      mockPrisma.doc.delete.mockResolvedValue(deletedDoc);

      await service.permanentDelete(DOC_ID, OWNER_ID);

      expect(mockPrisma.doc.delete).toHaveBeenCalledWith({ where: { id: DOC_ID } });
      expect(mockActivityLog.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateStatus', () => {
    it('met a jour le statut si l utilisateur est proprietaire', async () => {
      const doc = makeDoc();
      mockPrisma.doc.findFirst.mockResolvedValue(doc);
      mockPrisma.doc.update.mockResolvedValue({ ...doc, status: 'ARCHIVED' });
      mockActivityLog.create.mockResolvedValue({});

      await service.updateStatus(DOC_ID, DocStatus.ARCHIVED, OWNER_ID);

      expect(mockPrisma.doc.update).toHaveBeenCalledWith({
        where: { id: DOC_ID },
        data: { status: DocStatus.ARCHIVED },
      });
    });

    it('leve ForbiddenException si l utilisateur n est pas proprietaire', async () => {
      mockPrisma.doc.findFirst.mockResolvedValue(makeDoc({ ownerId: 'other-user' }));
      await expect(
        service.updateStatus(DOC_ID, DocStatus.ARCHIVED, OWNER_ID),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
