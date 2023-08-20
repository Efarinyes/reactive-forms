import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  templateUrl: './dynamic-page.component.html',

})
export class DynamicPageComponent {

  public myForm: FormGroup = this.fb.group({
    name: ['', [ Validators.required, Validators.minLength(3)]],

    favoriteGames: this.fb.array([
     [ 'Metal Gear', Validators.required ],
      ['Death Stranding', Validators.required],
      ['Empires X', Validators.required]
    ])
  });
  public newFavorite: FormControl = new FormControl('', Validators.required)

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService
    ) {}

  get favoriteGamesControl() {
    return this.myForm.get('favoriteGames') as FormArray
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field)
  }

  isValidFieldInArry( formArray: FormArray, i: number ) {
    return formArray.controls[i].errors && formArray.controls[i].touched
  }

  getFieldError(field: string): string | null {

    if( !this.myForm.controls[field]) return null

    const errors = this.myForm.controls[field].errors || {}
    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Aquest camp es necessari'

        case 'minlength':
          return ` Necessari un mínim de ${ errors['minlength'].requiredLength } caràcters`
      }
    }
    return null
  }

  addToFavorite():void {
    if (this.newFavorite.invalid) return;
    const newPersonatge = this.newFavorite.value
    this.favoriteGamesControl.push(
      this.fb.control(newPersonatge, Validators.required )
    )
    this.newFavorite.reset()
  }

  onDeleteFavorite( i: number ): void {
    this.favoriteGamesControl.removeAt(i)

  }

  onSunbmit(): void {

    if(this.myForm.invalid) {
      this.myForm.markAllAsTouched()
      return;
    }

    console.log(this.myForm.value);
    (this.myForm.controls['favoriteGames'] as FormArray) = this.fb.array([])


    this.myForm.reset()
  }
}
