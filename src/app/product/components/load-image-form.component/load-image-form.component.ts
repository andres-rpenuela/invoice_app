import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-load-image-form',
  standalone: true,
  imports: [ReactiveFormsModule, SlicePipe],
  templateUrl: './load-image-form.component.html',
  styleUrl: './load-image-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadImageFormComponent {
  //group = input.required<FormGroup>();
  @Input() group!: FormGroup;
  @Input() onDebug!: Boolean;

  imagePreview = signal<string | null>(null);
  isLoadingImage = signal(false);

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.isLoadingImage.set(true);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setTimeout(() => {
           const base64Image = e.target.result;

          this.imagePreview.set(base64Image);

          // Usamos ?. para evitar el error si el control es null
          // y hacemos cast a FormControl para asegurar el acceso a .setValue()
          //(this.group().get('image') as FormControl)?.setValue(base64Image);
          this.group.get('image')?.setValue(base64Image)
          this.isLoadingImage.set(false);
        }, 400);
      };
      reader.onerror = () => {
        this.isLoadingImage.set(false);
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      this.isLoadingImage.set(false);
    }
  }

}
