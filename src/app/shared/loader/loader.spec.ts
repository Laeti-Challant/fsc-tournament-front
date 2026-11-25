import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loader } from './loader';

describe('Loader', () => {
  let fixture: ComponentFixture<Loader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loader],
    }).compileComponents();

    fixture = TestBed.createComponent(Loader);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display a large primary spinner', () => {
    const spinner = fixture.nativeElement.querySelector('.loading');
    expect(spinner.classList).toContain('loading-spinner');
    expect(spinner.classList).toContain('loading-lg');
    expect(spinner.classList).toContain('text-primary');
  });

  it('should center the spinner on the host element', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.classList).toContain('flex');
    expect(host.classList).toContain('justify-center');
    expect(host.classList).toContain('items-center');
    expect(host.classList).toContain('py-12');
  });

  it('should announce the loading to screen readers', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.getAttribute('role')).toBe('status');
    expect(host.getAttribute('aria-label')).toBe('Chargement en cours');
  });
});
