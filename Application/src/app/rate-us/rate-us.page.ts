import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RestaurantService } from 'src/services/restaurant.service';
import { ToolService } from 'src/services/tool.service';

@Component({
  selector: 'app-rate-us',
  templateUrl: './rate-us.page.html',
  styleUrls: ['./rate-us.page.scss'],
})
export class RateUsPage {
  @ViewChild('slides') slides: IonSlides;

  constructor(
    public NavController: NavController,
    public active: ActivatedRoute,
    public tool: ToolService,
    public feedback: RestaurantService,
    public translateService: TranslateService
  ) {
    translateService.get('dataSuccess').subscribe((resp: any) => {
      this.dataSuccess = resp;
    });
    translateService.get('dataError').subscribe((resp: any) => {
      this.dataError = resp;
    });
  }
  dataSuccess: any;
  dataError: any;
  ratingData = {
    rating: 4,
    restaurantId: 0,
    reservationId: 0,
    feedback: '',
  };
  ionViewWillEnter() {
    this.ratingData.reservationId = this.active.snapshot.params.reservationId;
    this.ratingData.restaurantId = this.active.snapshot.params.restaurantId;
  }

  slideOpts = {
    slidesPerView: 3,
    initialSlide: 3,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    on: {
      beforeInit() {
        const swiper = this;

        swiper.classNames.push(
          `${swiper.params.containerModifierClass}coverflow`
        );
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const {
          width: swiperWidth,
          height: swiperHeight,
          slides,
          $wrapperEl,
          slidesSizesGrid,
          $,
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal
          ? -transform$$1 + swiperWidth / 2
          : -transform$$1 + swiperHeight / 2;
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier =
            ((center - slideOffset - slideSize / 2) / slideSize) *
            params.modifier;

          let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
          // var rotateZ = 0
          let translateZ = -translate * Math.abs(offsetMultiplier);

          let translateY = isHorizontal ? 0 : params.stretch * offsetMultiplier;
          let translateX = isHorizontal ? params.stretch * offsetMultiplier : 0;

          // Fix for ultra small values
          if (Math.abs(translateX) < 0.001) translateX = 0;
          if (Math.abs(translateY) < 0.001) translateY = 0;
          if (Math.abs(translateZ) < 0.001) translateZ = 0;
          if (Math.abs(rotateY) < 0.001) rotateY = 0;
          if (Math.abs(rotateX) < 0.001) rotateX = 0;

          const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

          $slideEl.transform(slideTransform);
          $slideEl[0].style.zIndex =
            -Math.abs(Math.round(offsetMultiplier)) + 1;
        }

        // Set correct perspective for IE10
        if (
          swiper.support.pointerEvents ||
          swiper.support.prefixedPointerEvents
        ) {
          const ws = $wrapperEl[0].style;
          ws.perspectiveOrigin = `${center}px 50%`;
        }
      },
    },
  };

  back() {
    this.NavController.back();
  }

  submit() {
    this.slides.getActiveIndex().then((index) => {
      let rating = index + 1;
      this.ratingData.rating = rating;
    });

    this.feedback.sendFeedBack(this.ratingData).subscribe((resp: any) => {

      this.tool.presentToast(
        this.dataSuccess.SendYourFeedbackSuccessFully,
        'success',
        'top'
      );
      this.NavController.back();
    });
  }
}
