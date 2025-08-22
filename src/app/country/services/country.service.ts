import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { map, Observable, catchError, throwError, delay } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      catchError((error) => {
        console.error('Error fetching', error);
        return throwError(
          () => new Error(`No se encontró un país con esa capital: ${query}`)
        );
      })
    );
  }

  //buscar por país con: const url = `${API_URL}/name/${query}`
  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      delay(500),
      catchError((error) => {
        console.error('Error fetching', error);
        return throwError(
          () => new Error(`No se encontró un país con ese nombre: ${query}`)
        );
      })
    );
  }

  searchCountryByAlphaCode(code: string) {
    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`).pipe(
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      map (countries => countries.at(0)),
      catchError((error) => {
        console.error('Error fetching', error);
        return throwError(
          () => new Error(`No se encontró un país con ese código: ${code}`)
        );
      })
    );
  }
}
