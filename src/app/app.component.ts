import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  form!: FormGroup;
  selectedProducts: any;
  products!: FormArray;
  @ViewChild(Table, { read: Table }) pTable!: Table;
  cols: any[] = [];
  searchValue: string | undefined;
  clonedProducts: { [s: string]: any; } = {};
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'age', header: 'Age' },
      { field: 'email', header: 'Email' }
    ];

    this.form = this.fb.group({
      products: this.fb.array([])
    });
    this.products = this.form.get('products') as FormArray;

    // Add initial form array items
    this.addProduct({
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      age: 12,
      email: 'sdjfh@gmail.com'
    });
    this.addProduct({
      id: '1001',
      code: 'nvklal433',
      name: 'Black Watch',
      age: 19,
      email: 'hsdjfh@gmail.com'
    });
    this.addProduct({
      id: '1002',
      code: 'zz21cz3c1',
      name: 'Blue Band',
      age: 14,
      email: 'esdjfh@gmail.com'
    });
  }

  addProduct(productData: any): void {
    this.products.push(this.fb.group(productData));
  }

  addRow(): void {
    const newProduct = {
      id: '7567',
      code: '',
      name: '',
      age: null,
      email: ''
    }
    this.addProduct(newProduct);
    this.pTable.editingRowKeys[(newProduct[this.pTable.dataKey as keyof typeof newProduct]!)] = true;
    //this.pTable.editingRowKeys[newProduct[this.pTable.dataKey!]] = true;
    this.onRowEditInit(newProduct);
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(product: any) {
    if (product.age > 0) {
      delete this.clonedProducts[product.id];
      //   this.messageService.add({severity:'success', summary: 'Success', detail:'Product is updated'});
    } else {
      //   this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Price'});
    }
  }

  onRowEditCancel(product: any, index: number) {
    this.products.at(index).patchValue(this.clonedProducts[product.id]);
    delete this.clonedProducts[product.id];
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
}

}
