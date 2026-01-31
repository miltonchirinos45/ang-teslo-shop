import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { ProductsService } from '../../../products/services/products.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  // activatedRoute = inject(ActivatedRoute);

  // currentPage = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map(params => (params.get('page') ? + params.get('page')!:1)),
  //     map((page)=> (isNaN(page) ? 1 : page))
  //   ),
  //   {
  //     initialValue: 1
  //   }
  // );

  // requests = signal({ gender: 'men' });

  productsResource = rxResource({
    // params: this.requests,
    params: ()=>({page:this.paginationService.currentPage()-1}),
    stream: ({params}) => {
      return this.productsService.getProducts({
        // limit: 5,
        // gender: 'women'
        offset: params.page * 9,
      });
    }
  });




}

