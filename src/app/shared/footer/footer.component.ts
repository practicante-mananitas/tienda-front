import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor ( private router: Router){}

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
