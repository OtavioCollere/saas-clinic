import { Inject } from '@nestjs/common';
import { isLeft, unwrapEither } from '@/shared/either/either';
import { FranchiseNotFoundError } from '@/shared/errors/franchise-not-found-error';
import { CreateProductUseCase } from '@/domain/application/use-cases/product/create-product';
import { FranchiseRepository } from '@/domain/application/repositories/franchise-repository';
import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { ProductPresenter } from '../../presenters/product-presenter';

const createProductBodySchema = z.object({
  franchiseId: z.string().optional(),
  name: z.string(),
  price: z.number().positive(),
  costPrice: z.number().positive().optional(),
  notes: z.string().optional(),
  createForAllFranchises: z.boolean().optional().default(false),
  clinicId: z.string().optional(),
}).refine(
  (data) => data.createForAllFranchises ? !!data.clinicId : !!data.franchiseId,
  { message: 'Either franchiseId or clinicId with createForAllFranchises=true must be provided', path: ['franchiseId'] },
);

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>;

@ApiTags('Products')
@Controller('/products')
export class CreateProductController {
  constructor(
    @Inject(CreateProductUseCase)
    private readonly createProductUseCase: CreateProductUseCase,
    @Inject(FranchiseRepository)
    private readonly franchiseRepository: FranchiseRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiOkResponse({ description: 'Product created successfully' })
  @ApiNotFoundResponse({ description: 'Franchise not found' })
  async handle(@Body(new ZodValidationPipe(createProductBodySchema)) body: CreateProductBodySchema) {
    const { franchiseId, name, price, costPrice, notes, createForAllFranchises, clinicId } = body;

    if (createForAllFranchises && clinicId) {
      const franchises = await this.franchiseRepository.findByClinicId(clinicId);
      if (franchises.length === 0) throw new NotFoundException('No franchises found for this clinic');

      const created = [];
      for (const franchise of franchises) {
        const result = await this.createProductUseCase.execute({ franchiseId: franchise.id.toString(), name, price, costPrice, notes });
        if (isLeft(result)) throw new NotFoundException(unwrapEither(result).message);
        created.push(ProductPresenter.toHTTP(unwrapEither(result).product));
      }

      return { message: `Product created for ${created.length} franchises`, products: created };
    }

    if (!franchiseId) throw new NotFoundException('franchiseId is required');

    const result = await this.createProductUseCase.execute({ franchiseId, name, price, costPrice, notes });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof FranchiseNotFoundError) throw new NotFoundException(error.message);
      throw new NotFoundException(error.message);
    }

    return ProductPresenter.toHTTP(unwrapEither(result).product);
  }
}
