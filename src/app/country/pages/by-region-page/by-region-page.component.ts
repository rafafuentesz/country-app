import { Component, inject, signal } from '@angular/core';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';   // 👈 aquí
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { Region } from '../../interfaces/region.interface';

@Component({
  selector: 'app-by-region-page',
  standalone: true,
  imports: [
    CountryListComponent,
    NgClass,   // 👈 necesario para usar [ngClass]
    TitleCasePipe
  ],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  CountryService = inject(CountryService);

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

  onSearchByRegion(region: string) {
    if (this.isLoading()) return;

    this.activeRegion.set(region);
    this.isLoading.set(true);
    this.isError.set(null);

    this.CountryService.searchByRegion(region).subscribe({
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
