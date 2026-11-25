import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyState } from './empty-state';

@Component({
  imports: [EmptyState],
  template: `<app-empty-state>Aucune donnée de test</app-empty-state>`,
})
class TestHost {}

describe('EmptyState', () => {
  let fixture: ComponentFixture<EmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyState);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should style the host as a muted centered message', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.classList).toContain('block');
    expect(host.classList).toContain('text-center');
    expect(host.classList).toContain('text-base-content/40');
    expect(host.classList).toContain('italic');
    expect(host.classList).toContain('py-12');
  });

  it('should display the projected message', () => {
    const hostFixture = TestBed.createComponent(TestHost);
    hostFixture.detectChanges();

    const emptyState = hostFixture.nativeElement.querySelector('app-empty-state');
    expect(emptyState.textContent).toContain('Aucune donnée de test');
  });
});
