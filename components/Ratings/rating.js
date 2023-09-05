// DON'T remove the below import
// import './styles.css';

class StarRating extends HTMLElement {
  constructor() {
    super();

    // Create a shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
    // Define the default number of stars
    this._maxStars = 5;
    this._rating = 0;
    this._label = 'Please select the rating!';
    this._precision = 1;
    this._disabled = false;
    this._caption = null;
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['rating', 'label', 'precision', 'disabled', 'caption', 'onChange'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'rating') {
      this.rating = parseInt(newValue, 10) || 0;
    } else if (name === 'label') {
      this.label = newValue;
    } else if (name === 'caption') {
      this.ratingCaption = newValue
        ? new Function('rating', `return ${newValue}`)
        : null;
    }
  }

  get rating() {
    return this._rating;
  }

  set label(value) {
    this._label = value;
  }

  set rating(value) {
    if (value >= 0 && value <= this._maxStars) {
      this._rating = value;
      this.setAttribute('rating', value);
    }
  }

  set ratingCaption(getRatingCaption) {
    this._caption = getRatingCaption(this._rating);
  }

  render() {
    const stars = [];

    for (let i = 1; i <= this._maxStars; i++) {
      const star = document.createElement('span');
      star.classList.add('star', i <= this._rating ? 'filled' : 'empty');
      stars.push(star);
    }

    this.shadowRoot.innerHTML = `
      <style>
        @import "./components/Ratings/rating.css";
      </style>
      <div class='rating-container'><p>${this._label}<p/>${stars
      .map((star) => star.outerHTML)
      .join('')}
      <p>${this._caption}</p></div>
    `;
  }
}

customElements.define('star-rating', StarRating);
