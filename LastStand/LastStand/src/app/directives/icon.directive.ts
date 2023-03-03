import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'svg[appIcon]'
})
export class IconDirective implements OnInit {

  @Input() appIcon!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    const useEl = this.renderer.createElement('use', 'http://www.w3.org/2000/svg');
    useEl.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `/assets/club-icons.svg#${this.appIcon}`);

    this.el.nativeElement.appendChild(useEl);
  }
}
