import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input<number>(0);
  currentePage = input<number>(1);

  activePage = linkedSignal(this.currentePage);

  getPagesList = computed(()=>{
    return Array.from({length: this.pages()}, (_, i) => i + 1);
  });


}
