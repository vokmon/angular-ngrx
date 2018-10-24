import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../product';
import { ProductService } from '../../product.service';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../../state';
import * as productActions from '../../state/product.action';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
    templateUrl: './product-shell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
  errorMessage$: Observable<string>;
  displayCode$: Observable<boolean>;
  products$: Observable<Product[]>;
  selectedProduct$: Observable<Product>;

  constructor(private store: Store<fromProduct.State>,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.store.dispatch(new productActions.Load());

    // Do NOT subscribe here because it uses an async pipe
    // This gets the initial values until the load is complete.
    this.products$ = this.store.pipe(select(fromProduct.getProducts));

    // Do NOT subscribe here because it uses an async pipe
    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));

    this.selectedProduct$ = this.store.pipe(select(fromProduct.getCurrentProduct));

    this.displayCode$ = this.store.pipe(select(fromProduct.getShowProductCode));
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

  delete(product: Product): void {
    this.store.dispatch(new productActions.DeleteProduct(product.id));
  }

  clearCurrent(): void {
    this.store.dispatch(new productActions.ClearCurrentProduct());
  }

  addProduct(product: Product): void {
    this.store.dispatch(new productActions.AddProduct(product));
  }

  updateProduct(product: Product): void {
    this.store.dispatch(new productActions.UpdateProduct(product));
  }
}
