import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-aviso-privacidad',
  imports: [],
  templateUrl: './aviso-privacidad.component.html',
  styleUrl: './aviso-privacidad.component.scss'
})
export class AvisoPrivacidadComponent {

  constructor( 
    private location: Location
  ){}

  volver() {
    this.location.back();
  }


}
