import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImageLoaderComponent } from '../component/image-loader/image-loader.component';

@NgModule({
  declarations: [ImageLoaderComponent],
  exports: [ImageLoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageComponentModule {}
