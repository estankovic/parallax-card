import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {IonContent} from '@ionic/angular';

@Component({
  selector: 'app-paralax-card',
  templateUrl: './paralax-card.component.html',
  styleUrls: ['./paralax-card.component.scss'],
})
export class ParalaxCardComponent implements OnInit {

  @Input() offsetY = 25;
  @Input() imageUrl;

  @Input() container: IonContent;

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
        this.recalculateOffset(scrollElement, this.el.nativeElement);
      });

      this.container.ionScroll.subscribe(event => {
        this.recalculateOffset(scrollElement, this.el.nativeElement);
      });
    });
  }

  get backgroundUrl() {
    return `url(${this.imageUrl})`;
  }

  private map(value, x1, y1, x2, y2) {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
  }

  private recalculateOffset(scrollElement: HTMLElement, cardElement: HTMLElement) {
    const containerBounds = scrollElement.getBoundingClientRect();
    const cardBounds = cardElement.getBoundingClientRect();
    const cardHeight = cardBounds.bottom - cardBounds.top;

    const cardOffset = cardBounds.bottom + cardHeight;
    const scrollAreaHeight = scrollElement.clientHeight + cardHeight;

    const imageOffset = -1 * this.map(cardOffset / scrollAreaHeight, 0, 1, this.offsetY * -1, this.offsetY);

    cardElement.style.setProperty('--paralex-offset-y', `${imageOffset}px`);
  }
}
