import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card } from './card';

@Component({
  imports: [Card],
  template: `<app-card><p class="projected">Contenu de test</p></app-card>`,
})
class TestHost {}

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the fsc shadow by default', () => {
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card');
    expect(card.classList).toContain('shadow-fsc');
  });

  it('should use the plain shadow when variant is plain', () => {
    fixture.componentRef.setInput('variant', 'plain');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card');
    expect(card.classList).toContain('shadow');
    expect(card.classList).not.toContain('shadow-fsc');
  });

  it('should display the projected content', () => {
    const hostFixture = TestBed.createComponent(TestHost);
    hostFixture.detectChanges();

    const content = hostFixture.nativeElement.querySelector('.card-body .projected');
    expect(content.textContent).toContain('Contenu de test');
  });
});
