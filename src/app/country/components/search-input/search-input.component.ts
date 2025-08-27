import {
  Component,
  effect,
  EventEmitter,
  input,
  linkedSignal,
  output,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  placeholder = input('Buscar');
  value = output<string>();
  debounceTime = input<number>(1000);
  initialValue = input<string>('');
  inputValue = linkedSignal<string>(() =>this.initialValue() ?? '');

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeout = setTimeout(() => {
      this.value.emit(value);
    }, this.debounceTime());

    onCleanup(() => clearTimeout(timeout));
  });
}
