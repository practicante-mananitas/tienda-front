import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-email-verify',
  imports: [CommonModule],
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss']
})
export class EmailVerifyComponent implements OnInit {
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const hash = this.route.snapshot.paramMap.get('hash');
    const expires = this.route.snapshot.queryParamMap.get('expires');
    const signature = this.route.snapshot.queryParamMap.get('signature');

    if (!id || !hash || !expires || !signature) {
      this.error = 'Parámetros inválidos.';
      this.loading = false;
      return;
    }

    const url = `${environment.apiUrl}/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

    this.http.get(url).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/email-verified']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al verificar el correo.';
      }
    });
  }
}
