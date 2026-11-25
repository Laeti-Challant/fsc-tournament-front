import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `<span class="loading loading-spinner loading-lg text-primary"></span>`,
  host: {
    class: 'flex justify-center items-center py-12',
    role: 'status',
    'aria-label': 'Chargement en cours',
  },
})
export class Loader {}
