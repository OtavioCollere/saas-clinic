import { Inject } from '@nestjs/common';
import { unwrapEither } from '@/shared/either/either';
import { FetchProductsByClinicIdUseCase } from '@/domain/application/use-cases/product/fetch-products-by-clinic-id';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductPresenter } from '../../presenters/product-presenter';

@ApiTags('Products')
@Controller('/clinics')
export class FetchProductsByClinicIdController {
  constructor(
    @Inject(FetchProductsByClinicIdUseCase)
    private readonly fetchProductsByClinicIdUseCase: FetchProductsByClinicIdUseCase,
  ) {}

  @Get('/:clinicId/products')
  @ApiOperation({ summary: 'Fetch products by clinic ID' })
  @ApiOkResponse({ description: 'Products retrieved successfully' })
  async handle(@Param('clinicId') clinicId: string) {
    const result = await this.fetchProductsByClinicIdUseCase.execute({ clinicId });
    const { products } = unwrapEither(result);
    return products.map(ProductPresenter.toHTTP);
  }
}
