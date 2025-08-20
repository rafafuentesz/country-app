import { Component, EventEmitter, input, output, Output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
placeholder = input('Buscar')
value = output<string>();


// //emitir evento a traves de un input
// onSearch(value:string){
//     this.value.emit(value);
//   }
}
