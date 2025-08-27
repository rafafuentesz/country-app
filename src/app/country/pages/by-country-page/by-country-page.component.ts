import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-country-page',
  standalone: true,
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  private countryService = inject(CountryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);
  query = signal<string>(''); // 👈 guardamos la búsqueda actual

  constructor() {
    // Escucha cambios de query params
    this.activatedRoute.queryParamMap.subscribe(params => {
      const q = params.get('query') ?? '';
      this.query.set(q);

      if (q) {
        this.fetchByCountry(q);
      } else {
        this.countries.set([]);
      }
    });
  }

  // 👉 llamado desde SearchInputComponent
  onSearchByCountry(query: string) {
    // Cambiamos la URL, lo demás lo maneja la suscripción de arriba
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { query },
      queryParamsHandling: 'merge',
    });
  }

  private fetchByCountry(query: string) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByCountry(query).subscribe({
      next: (countries) => {
        this.isLoading.set(false);
        this.countries.set(countries);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.countries.set([]);
        this.isError.set(err);
      },
    });
  }
}
