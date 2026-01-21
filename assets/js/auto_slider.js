const panels = document.querySelectorAll(".panel");

panels.forEach((panel) => {
  panel.addEventListener("click", () => {
    removeActiveClasses();
    panel.classList.add("active");
  });
});

const removeActiveClasses = () => {
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });
};

    // Dark-mode Switcher Functionality
    document.getElementById('toggleContrast').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // Save user's preference to local storage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for user's preference on page load
const isDarkMode = localStorage.getItem('darkMode');
if (isDarkMode === 'true') {
    document.body.classList.add('dark-mode');
}


// HEXAGON SLIDER


class Slider {
  public startIndex: number = 0;
  public index: number = 0;
  public SLIDE_COUNT: number = 8;
  private setNextTimer;

  public timeout = 10000;

  constructor(
    private slides: NodeListOf<Element>,
    private activeClass: string,
    private activeClassPrefix: string
  ) {}

  /**
   * startSlider
   */
  public startSlider() {
    this.onFiveSlides();
    this.setNextTimer = this.SetNext();

    for (let i = 0; i < this.slides.length; i++) {
      const slide: HTMLElement = this.slides[i] as HTMLElement;

      slide.addEventListener("click", (e) => {
        this.stop();
        this.offSlides();
        this.startIndex = i;
        this.onFiveSlides();
        this.setNextTimer = this.SetNext();
      });
    }
  }

  public next() {
    this.stop();
    this.nxt();
    this.setNextTimer = this.SetNext();
  }
  public prev() {
    this.stop();
    this.prv();
    this.setNextTimer = this.SetNext();
  }

  private SetNext() {
    return setInterval(() => {
      this.nxt();
    }, this.timeout);
  }

  private stop() {
    clearInterval(this.setNextTimer);
  }

  private nxt() {
    this.incrementStartIndex();
    this.offSlides();
    this.onFiveSlides();
  }

  private prv() {
    this.decrementStartIndex();
    this.offSlides();
    this.onFiveSlides();
  }

  private onFiveSlides() {
    this.index = this.startIndex;
    for (let i = 0; i < this.SLIDE_COUNT; i++) {
      let slide = this.slides[this.index];

      slide.classList.add(this.activeClass);
      slide.classList.add(`${this.activeClassPrefix}${i + 1}`);
      this.incrementIndex();
    }
  }

  private offSlides() {
    for (let i = 0; i < this.slides.length; i++) {
      let slide = this.slides[i];
      slide.classList.remove(this.activeClass);
      for (let i = 0; i < this.SLIDE_COUNT; i++) {
        slide.classList.remove(`${this.activeClassPrefix}${i + 1}`);
      }
    }
  }

  private incrementIndex() {
    this.index + 1 < this.slides.length ? this.index++ : (this.index = 0);
  }

  private decrementIndex() {
    this.index - 1 > 0 ? this.index-- : (this.index = this.slides.length - 1);
  }

  private incrementStartIndex() {
    this.startIndex + 1 < this.slides.length
      ? this.startIndex++
      : (this.startIndex = 0);
  }

  private decrementStartIndex() {
    this.startIndex - 1 > 0
      ? this.startIndex--
      : (this.startIndex = this.slides.length - 1);
  }
}


let sliders = document.querySelectorAll(".slide_block");
if (sliders != null) {
  for (let i = 0; i < sliders.length; i++) {
    const element = sliders[i];
    let slides = element.querySelectorAll(".slide");
    if (slides != null) {
      let slider = new Slider(slides, "active", "slide-");
      slider.startSlider();
    }
  }
}
