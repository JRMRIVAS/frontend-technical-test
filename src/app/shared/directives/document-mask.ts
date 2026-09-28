import { Directive, ElementRef, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { IdentificationType } from '../../core/models/trainer.model';
import { formatCarnet, formatDui } from '../utils/trainer-validation.util';

// Formats the document input while the user types: DUI gets its dash, the carnet only digits
@Directive({
  selector: '[appDocumentMask]',
  host: {
    '(input)': 'onInput()'
  }
})
export class DocumentMask {
  // Which document we're masking. null (no birth date yet) is treated as DUI
  readonly appDocumentMask = input<IdentificationType | null>(null);

  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly ngControl = inject(NgControl);

  onInput(): void {
    // Reading from the element, so it doesn't matter if the form updates before or after us
    const raw = this.el.nativeElement.value;
    const masked =
      this.appDocumentMask() === 'CARNET_MINORIDAD' ? formatCarnet(raw) : formatDui(raw);

    if (masked !== raw) this.ngControl.control?.setValue(masked);
  }
}