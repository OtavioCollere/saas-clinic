import { Inject } from '@nestjs/common';
import { isLeft, unwrapEither } from '@/shared/either/either';
import { ProductNotFoundError } from '@/shared/errors/product-not-found-error';
import { EditProductUseCase } from '@/domain/application/use-cases/product/edit-product';
import { Body, Controller, NotFoundException, Param, Patch } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { ProductPresenter } from '../../presenters/product-presenter';

const editProductBodySchema = z.object({
  name: z.string().optional(),
  price: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  notes: z.string().optional(),
});

type EditProductBodySchema = z.infer<typeof editProductBodySchema>;

@ApiTags('Products')
@Controller('/products')
export class EditProductController {
  constructor(
    @Inject(EditProductUseCase)
    private readonly editProductUseCase: EditProductUseCase,
  ) {}

  @Patch('/:productId')
  @ApiOperation({ summary: 'Edit product' })
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async handle(
    @Param('productId') productId: string,
    @Body(new ZodValidationPipe(editProductBodySchema)) body: EditProductBodySchema,
  ) {
    const result = await this.editProductUseCase.execute({ productId, ...body });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof ProductNotFoundError) throw new NotFoundException(error.message);
      throw new NotFoundException(error.message);
    }

    return ProductPresenter.toHTTP(unwrapEither(result).product);
  }
}
