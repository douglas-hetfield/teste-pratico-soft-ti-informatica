import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-generic-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './generic-input.component.html',
  styleUrl: './generic-input.component.css'
})
export class GenericInputComponent {
  @ViewChild('inputRef') inputRef!: ElementRef;

  @Input() form!: FormGroup;
  @Input() fieldName!: string;
  @Input() type?: string = "text";
  @Input() typeData?: "caracteres" | "números" = "caracteres";
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() mask?: string | undefined = undefined;
  @Input() erroMessagePattern?: string = "Valor inválido";

  @Output() onBlur = new EventEmitter<void>();

  focusInput() {
    this.inputRef.nativeElement.focus();
  }
}
