import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {IonContent} from '@ionic/angular';

@Component({
  selector: 'app-paralax-card',
  templateUrl: './paralax-card.component.html',
  styleUrls: ['./paralax-card.component.scss'],
})
export class ParalaxCardComponent implements OnInit {

  @Input() container: IonContent;

  constructor(
      private rendered: Renderer2,
      private el: ElementRef<HTMLElement>,
  ) {}

  ngOnInit() {

    const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

    console.log(this.container);

    if (!this.container){
      return;
    }

    this.container.ionScroll.subscribe(event => {
      console.log(event, this.el);




      this.container.getScrollElement().then(scrollElement => {

        const containerBounds = scrollElement.getBoundingClientRect();
        const cardBounds = this.el.nativeElement.getBoundingClientRect();
        const cardHeight = cardBounds.bottom - cardBounds.top;


        const cardOffset = cardBounds.bottom + cardHeight;
        const scrollAreaHeight = scrollElement.clientHeight + cardHeight;


        const imageOffset = -1 * map(cardOffset / scrollAreaHeight, 0, 1, -25, 25);


        this.el.nativeElement.style.setProperty('--paralex-offset-y', `${imageOffset}px`);
      });

    });

  }

}
