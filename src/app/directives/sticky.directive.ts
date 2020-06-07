import { Directive, Renderer, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector:"[appSticky]"
})

export class AppSticky  {
	
	constructor(
		private element: ElementRef,
		private renderer: Renderer
	) {
	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
	};
}

