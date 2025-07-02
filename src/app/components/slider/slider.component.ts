import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, OnDestroy {
  images = [
    'assets/banners/prueba5.png',
    'assets/banners/prueba6.png',
    'assets/banners/prueba7.png'
  ];

  currentIndex = 1; // empezamos en el primer slide real
  intervalId: any;

  startX = 0;
  currentX = 0;
  isDragging = false;
  trackTransform = '';
  transitionStyle = 'transform 0.3s ease';

  ngOnInit(): void {
    this.updateTransform();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.intervalId = setInterval(() => {
      this.goTo(this.currentIndex + 1);
    }, 6000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  goTo(index: number) {
    this.currentIndex = index;
    this.transitionStyle = 'transform 0.3s ease';
    this.updateTransform();
  }

  updateTransform(offset = 0) {
    const percent = -(this.currentIndex * 100) + offset;
    this.trackTransform = `translateX(${percent}%)`;
  }

  onTransitionEnd() {
    if (this.currentIndex === 0) {
      this.transitionStyle = 'none';
      this.currentIndex = this.images.length;
      this.updateTransform();
    } else if (this.currentIndex === this.images.length + 1) {
      this.transitionStyle = 'none';
      this.currentIndex = 1;
      this.updateTransform();
    }
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
    this.stopAutoSlide();
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    this.currentX = event.touches[0].clientX;
    const deltaX = this.currentX - this.startX;
    const offsetPercent = (deltaX / window.innerWidth) * 100;
    this.transitionStyle = 'none';
    this.updateTransform(offsetPercent);
  }

  onTouchEnd() {
    if (!this.isDragging) return;
    const deltaX = this.currentX - this.startX;
    const threshold = 50;

    if (deltaX > threshold) {
      this.goTo(this.currentIndex - 1);
    } else if (deltaX < -threshold) {
      this.goTo(this.currentIndex + 1);
    } else {
      this.goTo(this.currentIndex);
    }

    this.isDragging = false;
    this.startAutoSlide();
  }

  onDragStart(event: MouseEvent) {
    event.preventDefault();
    this.startX = event.clientX;
    this.isDragging = true;
    this.stopAutoSlide();
  }

  onDragMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.currentX = event.clientX;
    const deltaX = this.currentX - this.startX;
    const offsetPercent = (deltaX / window.innerWidth) * 100;
    this.transitionStyle = 'none';
    this.updateTransform(offsetPercent);
  }

  onDragEnd() {
    if (!this.isDragging) return;
    const deltaX = this.currentX - this.startX;
    const threshold = 50;

    if (deltaX > threshold) {
      this.goTo(this.currentIndex - 1);
    } else if (deltaX < -threshold) {
      this.goTo(this.currentIndex + 1);
    } else {
      this.goTo(this.currentIndex);
    }

    this.isDragging = false;
    this.startAutoSlide();
  }
}
