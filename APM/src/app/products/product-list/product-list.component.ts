import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product';
import { ProductService } from '../product.service';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state/product.reducer';
import * as productActions from '../state/product.action';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;

  componentActive = true;

  pageTitle = 'Products';
  errorMessage: string;

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;

  constructor(private store: Store<fromProduct.State>,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.store.dispatch(new productActions.Load());

    // Do NOT subscribe here because it uses an async pipe
    // This gets the initial values until the load is complete.
    this.products$ = this.store.pipe(select(fromProduct.getProducts));

    // Do NOT subscribe here because it uses an async pipe
    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));

    // Subscribe here because it does not use an async pipe
    this.store.pipe(select(fromProduct.getCurrentProduct),
      takeWhile(() => this.componentActive))
      .subscribe(
      currentProduct => {
          this.selectedProduct = currentProduct;
      }
    );

    // Subscribe here because it does not use an async pipe
    this.store.pipe(select(fromProduct.getShowProductCode),
      takeWhile(() => this.componentActive))
      .subscribe(
      showProductCode => {
          this.displayCode = showProductCode;
      }
    );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
  }

}
