import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {IonContent} from '@ionic/angular';

@Component({
  selector: 'app-parallax-card',
  templateUrl: './parallax-card.component.html',
  styleUrls: ['./parallax-card.component.scss'],
})
export class ParallaxCardComponent implements OnInit {

  @Input() offsetY = 25;
  @Input() imageUrl;

  @Input() container: IonContent;

  private isInView = false;

  constructor(
      private rendered: Renderer2,
      private el: ElementRef<HTMLElement>,
  ) {}

  ngOnInit() {

    this.el.nativeElement.style.setProperty('--background-offset', `-${this.offsetY}px`);


    if (!this.container){
      return;
    }
    this.container.getScrollElement().then(scrollElement => {
      // timeout needed for getRect to have non 0 value
      setTimeout(() => {
        this.startObserver(scrollElement, this.el.nativeElement);
      });

      this.container.ionScroll.subscribe(event => {

        if (this.isInView) {
          this.recalculateOffset(scrollElement, this.el.nativeElement);
        }

      });
    });
  }

  get backgroundUrl() {
    return `url(${this.imageUrl})`;
  }

  private startObserver(root: HTMLElement, card: HTMLElement) {
    const options = {
      root,
      rootMargin: '0px',
      threshold: [0, 1.0]
    };

    const observer = new IntersectionObserver((entities) => {
      const item = entities[0];

      this.isInView = item.isIntersecting;
      if (this.isInView) {
        this.recalculateOffset(root, this.el.nativeElement);
      }

    }, options);

    observer.observe(card);
  }

  private map(value, x1, y1, x2, y2) {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
  }

  private recalculateOffset(scrollElement: HTMLElement, cardElement: HTMLElement) {
    const containerBounds = scrollElement.getBoundingClientRect();
    const cardBounds = cardElement.getBoundingClientRect();
    const cardHeight = cardBounds.bottom - cardBounds.top;

    const cardOffset = cardBounds.bottom - containerBounds.top;
    const scrollAreaHeight = scrollElement.offsetHeight + cardHeight;

    const imageOffset = -1 * this.map(cardOffset / scrollAreaHeight, 0, 1, this.offsetY * -1, this.offsetY);

    cardElement.style.setProperty('--parallax-offset-y', `${imageOffset}px`);
  }
}
