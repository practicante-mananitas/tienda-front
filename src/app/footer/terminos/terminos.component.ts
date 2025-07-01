import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-terminos',
  imports: [],
  templateUrl: './terminos.component.html',
  styleUrl: './terminos.component.scss'
})
export class TerminosComponent {

  constructor(
    private location: Location
  ){}

  volver() {
    this.location.back();
  }

}
