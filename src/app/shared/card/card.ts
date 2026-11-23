import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styles: ``,
  host: { class: 'block' },
})
export class Card {
  variant = input<'fsc' | 'plain'>('fsc');
  hover = input<'primary' | 'success' | null>(null);
}
