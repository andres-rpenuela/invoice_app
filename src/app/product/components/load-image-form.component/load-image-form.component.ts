import {SlicePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, input, Output, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-load-image-form',
  standalone: true,
  imports: [ReactiveFormsModule, SlicePipe],
  templateUrl: './load-image-form.component.html',
  styleUrl: './load-image-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadImageFormComponent {
  @Input() onDebug!: boolean;
  @Output() base64Image = new EventEmitter<string>();


  imagePreview = signal<string | null>(null);
  isLoadingImage = signal(false);

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files[0]) {
      this.isLoadingImage.set(true);
      console.log('Archivo seleccionado:', input.files[0]);

      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        setTimeout(() => {
          const content = e.target.result;
          console.log('Contenido del archivo (base64):', content);
          this.imagePreview.set(content);
          this.base64Image.emit(content);
          this.isLoadingImage.set(false);
        }, 400);
      };

      reader.onerror = () => {
        this.isLoadingImage.set(false);
      };


      // Asignamos el file al reader antes de iniciar la lectura para evitar problemas de asincronía
      reader.readAsDataURL(file);
    } else {
      this.isLoadingImage.set(false);
    }
  }

}
