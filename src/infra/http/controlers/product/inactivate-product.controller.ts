import { Inject } from '@nestjs/common';
import { isLeft, unwrapEither } from '@/shared/either/either';
import { ProductNotFoundError } from '@/shared/errors/product-not-found-error';
import { InactivateProductUseCase } from '@/domain/application/use-cases/product/inactivate-product';
import { Controller, HttpCode, NotFoundException, Param, Patch } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('/products')
export class InactivateProductController {
  constructor(
    @Inject(InactivateProductUseCase)
    private readonly inactivateProductUseCase: InactivateProductUseCase,
  ) {}

  @Patch('/:productId/inactivate')
  @HttpCode(204)
  @ApiOperation({ summary: 'Inactivate product' })
  @ApiOkResponse({ description: 'Product inactivated successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async handle(@Param('productId') productId: string) {
    const result = await this.inactivateProductUseCase.execute({ productId });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof ProductNotFoundError) throw new NotFoundException(error.message);
      throw new NotFoundException(error.message);
    }
  }
}
