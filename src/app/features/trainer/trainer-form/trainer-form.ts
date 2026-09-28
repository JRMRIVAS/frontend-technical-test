import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainerService } from '../../../core/services/trainer.service';
import { IdentificationType } from '../../../core/models/trainer.model';
import {
  CARNET_MAX_DIGITS,
  CARNET_MIN_DIGITS,
  CARNET_PATTERN,
  DUI_PATTERN,
  getDocumentType,
  nameValidator,
  notFutureDateValidator,
  sanitizeName
} from '../../../shared/utils/trainer-validation.util';
import { HOBBY_SUGGESTIONS } from '../../../core/constants/hobbies.constants';
import { DocumentMask } from '../../../shared/directives/document-mask';


const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB, the photo ends up in localStorage
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png'];

@Component({
  selector: 'app-trainer-form',
  imports: [ReactiveFormsModule, DocumentMask],
  templateUrl: './trainer-form.html',
  styleUrl: './trainer-form.scss'
})
export class TrainerForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly trainerService = inject(TrainerService);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50), nameValidator]],
    hobby: [''],
    birthDate: ['', [Validators.required, notFutureDateValidator]],
    documentNumber: ['', [Validators.required]]
  });

  // The photo lives outside the form group, it's not a normal text input
  readonly photo = signal('');
  readonly photoName = signal('');
  readonly photoError = signal('');

  // Latest date the picker allows (today), in yyyy-mm-dd
  readonly today = new Date().toISOString().split('T')[0];

  // Forms are not signals, so toSignal turns their streams into signals
  // and we can use them inside computed()
  private readonly birthDate = toSignal(this.form.controls.birthDate.valueChanges, {
    initialValue: this.form.controls.birthDate.value
  });
  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status
  });
  private readonly hobby = toSignal(this.form.controls.hobby.valueChanges, {
    initialValue: this.form.controls.hobby.value
  });

  readonly hobbyMenuOpen = signal(false);

  // True once a hobby is picked, then it's shown as a chip
  readonly hobbyConfirmed = signal(false);

  // Suggestions that match what the user has typed so far
  readonly hobbySuggestions = computed(() => {
    const text = this.hobby().trim().toLowerCase();
    return HOBBY_SUGGESTIONS.filter((option) => option.toLowerCase().includes(text));
  });

  // null until the user picks a birth date
  readonly documentType = computed<IdentificationType | null>(() => {
    const birthDate = this.birthDate();
    return birthDate ? getDocumentType(birthDate) : null;
  });

  // Label of the last field. The carnet has no asterisk because it's optional
  readonly documentLabel = computed(() => {
    switch (this.documentType()) {
      case 'DUI':
        return 'DUI*';
      case 'CARNET_MINORIDAD':
        return 'Carnet de minoridad';
      default:
        return 'Documento*';
    }
  });

  // Message shown when the document doesn't match its format
  readonly documentFormatError = computed(() =>
    this.documentType() === 'CARNET_MINORIDAD'
      ? `El carnet debe tener entre ${CARNET_MIN_DIGITS} y ${CARNET_MAX_DIGITS} dígitos.`
      : 'El DUI debe tener 9 dígitos.'
  );

  // The "Continuar" button. We ask for the photo too
  readonly canContinue = computed(() => this.formStatus() === 'VALID' && this.photo() !== '');

  // Remembers the last document type, so we only clear the field when it really changes
  private lastDocumentType: IdentificationType | null = null;

  constructor() {
    // Whenever the birthday changes, the document rules may change too
    this.form.controls.birthDate.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.syncDocumentValidators());

    // If the trainer already exists (came back from the next step), fill the form again
    const existing = this.trainerService.trainer();
    if (existing) {
      this.form.patchValue({
        name: existing.name,
        hobby: existing.hobby ?? '',
        birthDate: existing.birthDate,
        documentNumber: existing.documentNumber ?? ''
      });
      this.photo.set(existing.photo);
      this.hobbyConfirmed.set(!!existing.hobby);
      // We don't store the file name, so after a reload we show a generic one
      this.photoName.set('Foto de perfil');
    }
  }

  // Runs on every keystroke or paste, only touches the value if something had to be removed
  onNameInput(): void {
    const control = this.form.controls.name;
    const clean = sanitizeName(control.value);
    if (clean !== control.value) control.setValue(clean);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      this.photoError.set('Only JPG or PNG images are allowed.');
      input.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      this.photoError.set('The image is too big, the limit is 2 MB.');
      input.value = '';
      return;
    }

    // We save the image as a base64 string so it can live in localStorage
    const reader = new FileReader();
    reader.onload = () => {
      this.photo.set(reader.result as string);
      this.photoName.set(file.name);
      this.photoError.set('');
    };
    reader.readAsDataURL(file);

    // Clearing the input lets the user pick the same file again after removing it
    input.value = '';
  }

  removePhoto(): void {
    this.photo.set('');
    this.photoName.set('');
    this.photoError.set('');
  }

  selectHobby(option: string): void {
    this.form.controls.hobby.setValue(option);
    this.hobbyConfirmed.set(true);
    this.hobbyMenuOpen.set(false);
  }

  // Enter keeps whatever the user typed, even if it's not in the list
  confirmTypedHobby(event: Event): void {
    event.preventDefault(); // otherwise Enter submits the form
    const text = this.form.controls.hobby.value.trim();
    if (text) this.selectHobby(text);
  }

  removeHobby(): void {
    this.form.controls.hobby.setValue('');
    this.hobbyConfirmed.set(false);
  }

  onSubmit(): void {
    if (!this.canContinue()) return;

    const { name, hobby, birthDate, documentNumber } = this.form.getRawValue();

    this.trainerService.setProfile({
      photo: this.photo(),
      name: name.trim(),
      hobby: hobby.trim() || undefined,
      birthDate,
      documentType: getDocumentType(birthDate),
      // An empty carnet is saved as undefined, not as an empty string
      documentNumber: documentNumber.trim() || undefined
    });

    this.router.navigate(['/pokemon']);
  }

  // Changes the validators of the document field based on the birth date
  private syncDocumentValidators(): void {
    const control = this.form.controls.documentNumber;
    const birthDate = this.form.controls.birthDate.value;
    const type = birthDate ? getDocumentType(birthDate) : null;

    if (type === 'DUI') {
      control.setValidators([Validators.required, Validators.pattern(DUI_PATTERN)]);
    } else if (type === 'CARNET_MINORIDAD') {
      // Optional, but if something is typed it has to be in the digit range
      control.setValidators([Validators.pattern(CARNET_PATTERN)]);
    } else {
      control.setValidators([Validators.required]);
    }

    // A DUI typed before is not a valid carnet (and the other way around)
    if (this.lastDocumentType !== null && type !== this.lastDocumentType) {
      control.setValue('');
    }
    this.lastDocumentType = type;

    control.updateValueAndValidity();
  }
}