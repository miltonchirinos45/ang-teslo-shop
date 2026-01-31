import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  activateRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);

  productIdSlug = this.activateRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    // params: this.requests,
    params: ()=>({idSlug: this.productIdSlug}),
    stream: ({params}) => {
      return this.productService.getProductBySlug(params.idSlug);
    }
  });

}
