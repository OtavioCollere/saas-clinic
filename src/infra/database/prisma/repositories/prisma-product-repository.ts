import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '@/domain/application/repositories/product-repository';
import { Product } from '@/domain/enterprise/entities/product';
import { PrismaService } from '../../prisma.service';
import { ProductMapper } from '../mappers/product-mapper';

@Injectable()
export class PrismaProductRepository extends ProductRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {
    super();
  }

  async create(product: Product): Promise<Product> {
    const data = ProductMapper.toPrisma(product);
    const raw = await this.prisma.product.create({ data });
    return ProductMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({ where: { id } });
    if (!raw) return null;
    return ProductMapper.toDomain(raw);
  }

  async findByFranchiseId(franchiseId: string): Promise<Product[]> {
    const raw = await this.prisma.product.findMany({
      where: { franchiseId },
      orderBy: { createdAt: 'desc' },
    });
    return raw.map(ProductMapper.toDomain);
  }

  async findByClinicId(clinicId: string): Promise<Product[]> {
    const franchises = await this.prisma.franchise.findMany({
      where: { clinicId },
      select: { id: true },
    });

    const franchiseIds = franchises.map((f) => f.id);
    if (franchiseIds.length === 0) return [];

    const raw = await this.prisma.product.findMany({
      where: { franchiseId: { in: franchiseIds } },
      orderBy: { createdAt: 'desc' },
    });

    return raw.map(ProductMapper.toDomain);
  }

  async update(product: Product): Promise<Product> {
    const data = ProductMapper.toPrismaUpdate(product);
    const raw = await this.prisma.product.update({
      where: { id: product.id.toString() },
      data,
    });
    return ProductMapper.toDomain(raw);
  }

  async delete(productId: string): Promise<void> {
    await this.prisma.product.delete({ where: { id: productId } });
  }
}
