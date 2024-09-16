import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { DeezerService } from './services/deezer.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'deezercopy';

  searchTerm: string = '';
  songs: any[] = [];
  display:boolean = false;
  displayPlayer:boolean = false;

  porcentaje = signal('0.01');

  nameSong = signal('');
  albumSong = signal('');
  imgSong = signal('');


  audio!: HTMLAudioElement;
  isPlaying = false;
  currentTime: string = '0:00';
  duration: string = '0:00';
  volume: number = 0.5; // Volumen inicial al 50%

  constructor(private deezerService: DeezerService){}

   // Método para buscar canciones usando el servicio de Deezer
   searchSongs(): void {
    if (this.searchTerm.trim() === '') {
      return; // Si el término está vacío, no hace la búsqueda
    }

    this.deezerService.searchSongs(this.searchTerm).subscribe((response) => {
      this.songs = response.data; // 'data' contiene el array de resultados
      this.display=true;
    });
  }

  ngOnInit() {

  }

  // Función para dar formato al tiempo (min:sec)
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  // Función para manejar la reproducción y pausa
  togglePlay() {
    if (!this.isPlaying) {
      this.audio.play()
      this.isPlaying=true;
    } 
  }

    // Función para manejar la reproducción y pausa
    togglePause() {
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      }
      
    }


  setAudio(audio:string,nameSong:string, albumSong:string,imgSong:string ){

    this.togglePause();
    this.audio = new Audio(audio);
    this.nameSong.set(nameSong);
    this.albumSong.set(albumSong);
    this.imgSong.set(imgSong);

    this.displayPlayer = true;
    console.log(this.audio)
        // Cargar la duración cuando el audio esté listo
        this.audio.addEventListener('loadedmetadata', () => {
          this.duration = this.formatTime(this.audio.duration);
        });
    
        // Actualizar el tiempo actual del audio mientras se reproduce
        this.audio.addEventListener('timeupdate', () => {
          this.currentTime = this.formatTime(this.audio.currentTime);

           // Calcula el porcentaje de progreso
          const percentage = (this.audio.currentTime / this.audio.duration) * 100;

          // Actualiza el ancho de la barra de progreso
          this.porcentaje.set (`${percentage}`);
        });

        this.togglePlay();
        
  }

  // Control del volumen
  changeVolume(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newVolume = parseFloat(inputElement.value);
    this.audio.volume = newVolume; // Actualiza el volumen del audio
    this.volume = newVolume; // Actualiza el valor en el componente
  }

}
