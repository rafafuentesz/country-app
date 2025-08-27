import { Component, inject, signal } from '@angular/core';
import { NgClass, TitleCasePipe, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { Region } from '../../interfaces/region.interface';

@Component({
  selector: 'app-by-region-page',
  standalone: true,
  imports: [
    CountryListComponent,
    NgClass,
    TitleCasePipe
  ],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  private countryService = inject(CountryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);
  activeRegion = signal<string | null>(null);

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  constructor() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      const region = params.get('region');
      if (region) {
        this.activeRegion.set(region);
        this.fetchByRegion(region);
      } else {
        this.activeRegion.set(null);
        this.countries.set([]);
      }
    });
  }

  // 👉 cuando el usuario clickea un botón
  onSearchByRegion(region: string) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { region },
      queryParamsHandling: 'merge',
    });
  }

  private fetchByRegion(region: string) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByRegion(region).subscribe({
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
