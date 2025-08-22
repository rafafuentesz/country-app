import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { CountryInformationComponent } from './country-information/country-information.component';

@Component({
  selector: 'app-country-page',
  standalone: true,
  imports: [NotFoundComponent, CountryInformationComponent],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private countryService = inject(CountryService);

  isLoading = signal(false);
  isError = signal<string | null>(null);
  country = signal<Country | null | undefined>(null);

  ngOnInit() {
    const code = this.route.snapshot.params['code'];
    if (code) {
      this.onSearchCountryByAlphaCode(code);
    }
  }

  onSearchCountryByAlphaCode(code: string) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchCountryByAlphaCode(code).subscribe({
      next: (country) => {
        this.isLoading.set(false);
        this.country.set(country);
        console.log({ country });
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.country.set(null);
        this.isError.set(err.message);
      },
    });
  }
}
