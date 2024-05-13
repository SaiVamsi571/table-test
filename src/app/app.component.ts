import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string,
  name: string,
  age: number,
  email: string,
  isNew?: boolean,
  error?: {
    name: string,
    age: string,
    email: string
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  // form!: FormGroup;
  selectedProducts: any;
  products: Product[] = [];
  @ViewChild(Table, { read: Table }) pTable!: Table;
  cols: any[] = [];
  searchValue: string | undefined;
  clonedProducts: { [s: string]: any; } = {};
  constructor(
    //  private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'age', header: 'Age' },
      { field: 'email', header: 'Email' }
    ];

    const data = [{
      id: uuidv4(),
      name: 'Bamboo Watch',
      age: 12,
      email: 'sdjfh@gmail.com'
    }, {
      id: uuidv4(),
      name: 'Black Watch',
      age: 19,
      email: 'hsdjfh@gmail.com'
    }, {
      id: uuidv4(),
      name: 'Blue Band',
      age: 14,
      email: 'esdjfh@gmail.com'
    }];
    this.products = data;
  }

  addProduct(productData: Product): void {
    this.products.push(productData);
  }

  addRow(): void {
    const newProduct = {
      id: uuidv4(),
      name: '',
      age: 0,
      email: '',
      isNew: true
    }
    this.addProduct(newProduct);
    this.pTable.editingRowKeys[newProduct.id] = true;
    this.onRowEditInit(newProduct);
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id] = JSON.parse(JSON.stringify(product));
  }

  onRowEditSave(product: any, index: number) {
    if (index !== -1 && product.isNew) {
      product.isNew = false;
    }
    if (!(product.error.name || product.error.age || product.error.email)) {
      delete this.clonedProducts[product.id];
    }
  }

  onRowEditCancel(product: any, index: number) {
    if (index !== -1 && product.isNew) {
      this.products = this.products.filter(i => i.id !== product.id);
    } else {
      this.products[index] = this.clonedProducts[product.id];
      delete this.clonedProducts[product.id];
    }
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  onUpload(event: any) {
    const file: File = event.files[0];
    if (file) {
      this.products = [];
      this.parseCsv(file);
    }
  }

  parseCsv(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = reader.result;
      if (typeof content === 'string') {
        const rows = content.split('\n').map(row => row.trim());
        if (rows.length > 0) {
          for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            this.addProduct({
              id: uuidv4(),
              name: columns[0].slice(1, -1).trim(),
              age: parseInt(columns[1].slice(1, -1), 10) || Number(columns[1].slice(1, -1)),
              email: columns[2].slice(1, -1).trim()
            });
          }
        }
      }
    };
    reader.readAsText(file);
  }

  validateInput(val: Product, type: string) {
    val.error = val.error || { name: '', age: '', email: '' };
    switch (type) {
      case 'name':
        let regex1 = /^[a-zA-Z ]*$/;
        if (val.name.trim() === '' || !regex1.test(String(val.name))) {
          val.error.name = 'Invalid Name';
          return true;
        } else {
          val.error['name'] = '';
          return false;
        }
      case 'age':
        if (val.age >= 60 || val.age <= 1) {
          val.error.age = 'Invalid Age';
          return true;
        } else {
          val.error.age = '';
          return false;
        }
      case 'email':
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(String(val.email).toLowerCase())) {
          val.error.email = 'Invalid email';
          return true;
        } else {
          val.error.email = '';
          return false;
        }
      default:
        return false;
    }

  }

}
