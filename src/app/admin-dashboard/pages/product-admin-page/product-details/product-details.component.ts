import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarouselComponent } from "../../../../products/components/product-carousel/product-carousel.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, CommonModule, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product         = input.required<Product>();
  productsService = inject(ProductsService);
  router          = inject(Router);
  wasSaved        = signal(false);

  imageFileList : FileList|undefined = undefined;
  tempImages                         = signal<string[]>([]);

  imagesToCarousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImages()];

    return currentProductImages;
  });

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    // this.productForm.reset(this.product() as any);

    this.setFormValue(this.product());

  }

  setFormValue(formLike:Partial<Product>){
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({tags: formLike.tags?.join(',')});
  }

  onSizeClicked(size:string){
    const currentSizes = this.productForm.value.sizes ?? [];

    if(currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size),1);
    }else{
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes});

  }

  async onSubmit() {

    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    console.log(this.productForm.value, {isValid});

    if( !isValid){
      return;
    }

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLocaleLowerCase().split(',').map(tag => tag.trim()) ?? []
    };

    console.log({ productLike });

    if (this.product().id === 'new') {
      //crear producto
      const product = await firstValueFrom(
        this.productsService.creteProduct( productLike, this.imageFileList)
      );

      console.log('Producto creado');
      this.router.navigate(['/admin/products', product.id]);

    }else{

      await firstValueFrom(
        this.productsService.updateProduct(this.product().id ?? '',productLike, this.imageFileList)
      );

      console.log('Producto actualizado');

    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);

  }

  //Images
  // onFilesChanged( event: Event){
  //   const fileList = ( event.target as HTMLInputElement).files;
  //   this.tempImages.set([]);

  //   // console.log('fileList:', fileList)

  //   const imageUrls = Array.from(fileList ?? []).map((file) =>
  //     URL.createObjectURL(file)
  //   );

  //   console.log({imageUrls});

  //   this.tempImages.set(imageUrls);

  // }

  onFilesChanged( event: Event){
    const fileList = ( event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    );

    console.log({imageUrls});

    this.tempImages.set(imageUrls);

  }




}
