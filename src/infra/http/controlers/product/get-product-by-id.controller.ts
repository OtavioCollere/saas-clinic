import { Inject } from '@nestjs/common';
import { isLeft, unwrapEither } from '@/shared/either/either';
import { ProductNotFoundError } from '@/shared/errors/product-not-found-error';
import { GetProductByIdUseCase } from '@/domain/application/use-cases/product/get-product-by-id';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductPresenter } from '../../presenters/product-presenter';

@ApiTags('Products')
@Controller('/products')
export class GetProductByIdController {
  constructor(
    @Inject(GetProductByIdUseCase)
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @Get('/:productId')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiOkResponse({ description: 'Product retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async handle(@Param('productId') productId: string) {
    const result = await this.getProductByIdUseCase.execute({ productId });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof ProductNotFoundError) throw new NotFoundException(error.message);
      throw new NotFoundException(error.message);
    }

    return ProductPresenter.toHTTP(unwrapEither(result).product);
  }
}
