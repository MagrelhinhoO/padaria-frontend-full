import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class AppRootComponent implements AfterViewInit {
  private host = inject(ElementRef<HTMLElement>);
  ngAfterViewInit(): void {
    // Remove splash children if still present (Angular mount replaced content but fallback inside <app-root> might remain during hydration time)
    // Ensure only router content stays.
    // (Defensivo: caso nada a remover, ignora.)
    const el = this.host.nativeElement as HTMLElement;
    // router-outlet view is projected separately; no extra handling needed.
  }
}
