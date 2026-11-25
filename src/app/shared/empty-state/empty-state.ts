import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `<ng-content />`,
  host: {
    class: 'block text-center text-base-content/40 italic py-12',
  },
})
export class EmptyState {}
