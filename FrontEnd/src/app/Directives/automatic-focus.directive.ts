import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appAutomaticFocus]'
})
export class AutomaticFocusDirective implements AfterViewInit{
  private el = inject(ElementRef)

  ngAfterViewInit(): void {
      this.el.nativeElement.focus();
  }

}
