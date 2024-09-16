import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment.prod';


@Injectable({
  providedIn: 'root' // Asegúrate de que el servicio está disponible globalmente
})
export class DeezerService {
  private apiUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search';
  private apiKey = environment.apiKey; 

  constructor(private http: HttpClient) {}

  searchSongs(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
    });

    const url = `${this.apiUrl}?q=${query}`;

    return this.http.get(url, { headers });
  }
}
