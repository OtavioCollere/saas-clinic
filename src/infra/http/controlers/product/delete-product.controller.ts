import { Inject } from '@nestjs/common';
import { isLeft, unwrapEither } from '@/shared/either/either';
import { ProductNotFoundError } from '@/shared/errors/product-not-found-error';
import { DeleteProductUseCase } from '@/domain/application/use-cases/product/delete-product';
import { Controller, Delete, HttpCode, NotFoundException, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('/products')
export class DeleteProductController {
  constructor(
    @Inject(DeleteProductUseCase)
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Delete('/:productId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async handle(@Param('productId') productId: string) {
    const result = await this.deleteProductUseCase.execute({ productId });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof ProductNotFoundError) throw new NotFoundException(error.message);
      throw new NotFoundException(error.message);
    }
  }
}
