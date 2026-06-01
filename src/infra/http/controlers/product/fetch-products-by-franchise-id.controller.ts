import { Inject } from '@nestjs/common';
import { unwrapEither } from '@/shared/either/either';
import { FetchProductsByFranchiseIdUseCase } from '@/domain/application/use-cases/product/fetch-products-by-franchise-id';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductPresenter } from '../../presenters/product-presenter';

@ApiTags('Products')
@Controller('/franchises')
export class FetchProductsByFranchiseIdController {
  constructor(
    @Inject(FetchProductsByFranchiseIdUseCase)
    private readonly fetchProductsByFranchiseIdUseCase: FetchProductsByFranchiseIdUseCase,
  ) {}

  @Get('/:franchiseId/products')
  @ApiOperation({ summary: 'Fetch products by franchise ID' })
  @ApiOkResponse({ description: 'Products retrieved successfully' })
  async handle(@Param('franchiseId') franchiseId: string) {
    const result = await this.fetchProductsByFranchiseIdUseCase.execute({ franchiseId });
    const { products } = unwrapEither(result);
    return products.map(ProductPresenter.toHTTP);
  }
}
