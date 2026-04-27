import { Test, TestingModule } from '@nestjs/testing';
import { MyDeskService } from './my-desk.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MyDeskService', () => {
  let service: MyDeskService;
  let prisma: PrismaService;

  const mockPrisma = {
    blog: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyDeskService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<MyDeskService>(MyDeskService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMyBlogs', () => {
    it('should call prisma.blog.findMany with correct params', async () => {
      const userId = 'user-1';
      const params = { take: 10, isDeleted: false };
      mockPrisma.blog.findMany.mockResolvedValue([]);

      await service.getMyBlogs(userId, params);

      expect(prisma.blog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            isDeleted: false,
          }),
        }),
      );
    });
  });

  describe('getMyBlogById', () => {
    it('should throw NotFoundException if blog not found', async () => {
      mockPrisma.blog.findFirst.mockResolvedValue(null);
      await expect(service.getMyBlogById('user-1', 'blog-1')).rejects.toThrow();
    });
  });
});
