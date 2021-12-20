import './main.scss';
class Slider {
    constructor() {
        this.slider = document.querySelector('.slider');
        this.container = document.querySelector('.container');
        this.nextButton = document.createElement('button');
        this.prevButton = document.createElement('button');
        this.slides = document.querySelectorAll('.slide');
        this.buttonContainer = document.createElement('div');
        this.dotsContainer = document.createElement('ul');
        this.desktopMedia = window.matchMedia('(min-width: 769px)');
        this.tabletAndMobileMedia = window.matchMedia('(max-width: 768px)');
        this.sliderTimeout = null;
        this.pause = true;
        this.slidesToShow = 3;
        this.counter = 1;
    }

    navigationInit() {
        const slides = document.querySelectorAll('.slide');

        this.buttonContainer.classList.add('slider-buttons');
        this.slider.insertAdjacentElement('afterend', this.buttonContainer);

        this.dotsContainer.classList.add('dots');
        this.buttonContainer.insertAdjacentElement('afterend', this.dotsContainer);

        this.buttonContainer.insertAdjacentElement('afterbegin', this.prevButton);
        this.prevButton.classList.add('prevButton');

        this.buttonContainer.insertAdjacentElement('beforeend', this.nextButton);
        this.nextButton.classList.add('nextButton');  

        for (let i = 0; i < slides.length - 2; i++) {
            let dot = document.createElement('li');
            dot.classList.add('dot');
            this.dotsContainer.insertAdjacentElement('afterbegin', dot);
        };

        this.navigationHover(this.prevButton);
        this.navigationHover(this.nextButton);
    };

    navigationHover(element) {
        element.addEventListener('mouseenter', () => {
            element.classList.add('buttonHover')
        });

        element.addEventListener('mouseleave', () => {
            element.classList.remove('buttonHover');
        });
    };
    
    navigationDotsActive() {
        const [,,, activeSlideIndex] = this.getNextAndPrevSlide();
        const dots = document.querySelectorAll('.dot');

        dots.forEach(dot => {
            dot.classList.remove('active');
        });
    
        if (activeSlideIndex > this.slides.length - 3) {
            dots[this.slides.length - 3].classList.add('active');
        } else {
            dots[activeSlideIndex].classList.add('active');
        }
    };

    getActiveDot() {
        const dots = document.querySelectorAll('.dot');

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                this.getActiveSlide(i);
                this.counter = i + 1;
            })
        })
    }

    getNextAndPrevSlide() {
        let next, prev;
        const activeSlide = document.querySelector('.active');
        const activeSlideIndex = Array.from(this.slides).indexOf(activeSlide);

        if (activeSlideIndex === this.slides.length - 1) {
            next = this.slides[0];
        } else {
            next = this.slides[activeSlideIndex + 1];
        };

        if (activeSlideIndex === 0) {
            prev = this.slides[this.slides.length - 1];
        } else {
            prev = this.slides[activeSlideIndex - 1]
        };

        if (this.desktopMedia.matches) {
            if (activeSlideIndex === this.slides.length - 3) {
                next = this.slides[0];
            }
        }

        return [prev, next, activeSlide, activeSlideIndex];
    };

    switchNextSlide() {
        let [, next, currentSlide, activeSlideIndex] = this.getNextAndPrevSlide();
        let slideWidth = currentSlide.getBoundingClientRect().width;

        currentSlide.classList.remove('active');
        next.classList.add('active');

        if (activeSlideIndex >= 0 && activeSlideIndex < this.slides.length - 3) {
            this.slider.style.transform = `translateX(-${slideWidth * this.counter}px)`;
            this.counter++; 
        };

        if (activeSlideIndex > this.slides.length - 2) {
            this.slider.style.transform = `translateX(-${slideWidth * activeSlideIndex}px)`;
        };

        if (activeSlideIndex === this.slides.length - 3 || activeSlideIndex === this.slides.length - 1) {
            this.slider.style.transform = `translateX(0)`;
            this.counter = 1;
        };

        if (this.tabletAndMobileMedia.matches) {
            if (activeSlideIndex >= 0 && activeSlideIndex !== this.slides.length - 1) {
                this.slider.style.transform = `translateX(-${slideWidth * (activeSlideIndex + 1)}px)`;
                this.counter++; 
            };
        }

        this.navigationDotsActive();
    };

    switchPrevSlide() {
        const [prev, , currentSlide, activeSlideIndex] = this.getNextAndPrevSlide();
        let slideWidth = currentSlide.getBoundingClientRect().width;

        currentSlide.classList.remove('active');
        prev.classList.add('active');

        if (activeSlideIndex === 0) {
            this.slider.style.transform = `translateX(-${(slideWidth * (this.slides.length - 3))}px)`;
            this.counter = 0;      
        };
        
        if (activeSlideIndex !== 0 && activeSlideIndex !== this.slides.length - 1){
            this.slider.style.transform = `translateX(-${slideWidth * (activeSlideIndex - 1)}px)`;
            this.counter = activeSlideIndex;
        };

        if (this.tabletAndMobileMedia.matches) {
            if (activeSlideIndex === 0) {
                this.slider.style.transform = `translateX(-${slideWidth * (this.slides.length - 1)}px)`;
                this.counter++; 
            };

            if (activeSlideIndex === this.slides.length - 1) {
                this.slider.style.transform = `translateX(-${slideWidth * (activeSlideIndex - 1)}px)`;
            };
        };
        
        this.navigationDotsActive();
    };

    getActiveSlide(el) {
        const slides = document.querySelectorAll('.slide');

        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');   
            this.slider.style.transform = `translateX(-${slides[i].getBoundingClientRect().width * el}px)`;
            
            if (this.desktopMedia.matches) {
                if (el >= this.slides.length - 2) {
                    this.slider.style.transform = `translateX(-${slides[i].getBoundingClientRect().width * (this.slides.length - 3)}px)`;
                }
            }
        };

        slides[el].classList.add('active')

        this.navigationDotsActive();
    };

    startSlider() {
        this.sliderTimeout = setTimeout(() => {
                this.switchNextSlide();
                this.startSlider();                
        }, 3000);
    };

    pauseSlider() {
        let dots = document.querySelectorAll('.dot');

        for (let i = 0; i < this.slides.length; i++) {

            let clone = this.slides[i].cloneNode(true);

            this.slides[i].addEventListener('click', () => {
                clearTimeout(this.sliderTimeout);
                clone.classList = '';
                this.slides.forEach(el => {
                    el.classList.remove('active')
                });
                clone.classList.add('zoom');
                document.body.insertAdjacentElement('afterbegin', clone);
                document.body.classList.add('overlay');
            });

            clone.addEventListener('click', () => {
                document.body.classList.remove('overlay');
                clone.parentNode.removeChild(clone);
                this.slides[i].classList.add('active');
                this.getActiveSlide(i);
                this.startSlider();
            });

            this.nextButton.addEventListener('click', () => {
                clearTimeout(this.sliderTimeout);
                this.pause = false;

                if (!this.pause) {
                    this.startSlider();
                }
            });

            this.prevButton.addEventListener('click', () => {
                clearTimeout(this.sliderTimeout);
                this.pause = false;

                if (!this.pause) {
                    this.startSlider();
                }
            });
        };

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearTimeout(this.sliderTimeout);
                this.pause = false;

                if (!this.pause) {
                    this.startSlider();
                }
            });
        })
    };

    addAdaptiveToSlider() {
        window.addEventListener('resize', () => {
            for (let i = 0; i < this.slides.length; i++) {
                if (this.desktopMedia.matches) {
                        this.slides[i].style.minWidth = '33.332%';
                    } else if (this.tabletAndMobileMedia.matches) {
                        this.slides[i].style.minWidth = '100%';
                };
            };
        });
    };

    drawSlider() {
        this.navigationInit();
        this.navigationDotsActive();
        this.getActiveDot();
        this.nextButton.addEventListener('click', () => {
            this.switchNextSlide();
        });

        this.prevButton.addEventListener('click', () => {
            this.switchPrevSlide();
        });
        this.startSlider();
        this.pauseSlider();
        this.addAdaptiveToSlider();
    };
};

let slider = new Slider();

slider.drawSlider();