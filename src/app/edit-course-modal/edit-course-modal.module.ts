import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCourseModalComponent } from './edit-course-modal.component';

@NgModule({
  declarations: [ EditCourseModalComponent ],
  exports: [ EditCourseModalComponent ],
  imports: [ CommonModule ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CustomModule {}
