import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import 'swiper/swiper-bundle.css';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  images = [
    'assets/banners/prueba5.webp',
    'assets/banners/prueba6.webp',
    'assets/banners/prueba7.webp'
  ];

  swiper!: Swiper;

  config: SwiperOptions = {
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false
    },
    speed: 300,
    slidesPerView: 1,
    spaceBetween: 0,
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev'
    // }
  };

  ngAfterViewInit(): void {
    this.swiper = new Swiper('.swiper-container', this.config);
  }

  ngOnDestroy(): void {
    this.swiper.destroy();
  }
}
