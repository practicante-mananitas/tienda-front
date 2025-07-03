import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import 'swiper/swiper-bundle.css';

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-slider.component.html',
  styleUrls: ['./category-slider.component.scss']
})
export class CategorySliderComponent implements AfterViewInit, OnDestroy {
  @Input() images: string[] = [];

  swiper!: Swiper;

  config: SwiperOptions = {
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    speed: 300,
    slidesPerView: 1,
    grabCursor: true,
    // quitar navegación si no quieres flechas
    // pagination: { el: '.swiper-pagination', clickable: true },
    // navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  };

  ngAfterViewInit(): void {
    this.swiper = new Swiper('.swiper-container-category', this.config);
  }

  ngOnDestroy(): void {
    this.swiper.destroy();
  }
}
