import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-capital-page',
  standalone: true,
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  private countryService = inject(CountryService);
  private activatedRoute = inject(ActivatedRoute);

  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);
  query = signal<string>(''); // 👈 signal para guardar la query

  constructor() {
    // Nos suscribimos a los cambios de query params
    this.activatedRoute.queryParamMap.subscribe(params => {
      const q = params.get('query') ?? '';
      this.query.set(q);

      if (q) {
        this.onSearchByCapital(q);
      }
    });
  }

  onSearchByCapital(query: string) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByCapital(query).subscribe({
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
