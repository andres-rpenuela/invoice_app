import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { productCategories } from '../../../shared/data/product-categories.data';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { LoadImageFormComponent } from '../../components/load-image-form.component/load-image-form.component';
import { signal } from '@angular/core';


@Component({
  selector: 'app-product-form.page.component',
  imports: [ReactiveFormsModule, CapitalizePipe, LoadImageFormComponent],
  templateUrl: './product-form.page.component.html',
  styleUrl: './product-form.page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormPageComponent implements OnInit{
  productForm?: FormGroup;
  formError = signal(false);
  _dataGenericFormGroup?: FormGroup;
  _dataDiscountsTaxFormGroup?: FormGroup;
  _imageFormGroup?: FormGroup;

  ngOnInit(): void {
    this._dataGenericFormGroup = this.fb.group({
        name: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        description: [''],
        stock: [0, [Validators.required, Validators.min(0)]],
        category: [[], Validators.required],
    });

    this._dataDiscountsTaxFormGroup = this.fb.group({
        discounts: [0],
        taxes: [0]
    })

    this._imageFormGroup = this.fb.group({
      image:['']
    })

    this.productForm = this.fb.group({
      dataGenericGroup: this._dataGenericFormGroup,
      dataDiscountsTaxGroup: this._dataDiscountsTaxFormGroup,
      imageGroup: this._imageFormGroup
    });
  }

  constructor(private fb: FormBuilder) {

  }

  onSubmit() {
    if (this.productForm?.valid) {
      // Aquí puedes manejar el producto, por ejemplo enviarlo a un servicio
      console.log('Producto:', this.productForm.value);
    }
  }



  getCategories(){
    return productCategories;
  }

  get imageGroup(): FormGroup {
return this.productForm?.get('imageGroup') as FormGroup;
}
}
