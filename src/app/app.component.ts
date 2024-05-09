import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { v4 as uuidv4 } from 'uuid';

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
    this.addProduct({
      id: uuidv4(),
      name: 'Bamboo Watch',
      age: 12,
      email: 'sdjfh@gmail.com'
    });
    this.addProduct({
      id: uuidv4(),
      name: 'Black Watch',
      age: 19,
      email: 'hsdjfh@gmail.com'
    });
    this.addProduct({
      id: uuidv4(),
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
      id: uuidv4(),
      name: '',
      age: null,
      email: '',
      isNew: 1
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
    delete this.clonedProducts[product.id];
  }

  onRowEditCancel(product: any, index: number) {
    if(index !== -1 && product.isNew) {
      this.products.removeAt(index)
    } else {
      this.products.at(index).patchValue(this.clonedProducts[product.id]);
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
      this.products.clear();
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
              age: parseInt(columns[1].slice(1, -1), 10) || columns[1].slice(1, -1),
              email: columns[2].slice(1, -1).trim()
            });
          }
        }
      }
    };
    reader.readAsText(file);
  }

}
