// BASE VIEW: reusable rendering behavior shared by all child Views.
export default class View {
  _data;

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.innerHTML = markup;
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newElement, index) => {
      const currentElement = currentElements[index];
      if (!currentElement) return;
      if (newElement.isEqualNode(currentElement)) return;
      if (newElement.firstChild?.nodeValue?.trim() !== '') {
        currentElement.textContent = newElement.textContent;
      }
    });
  }

  _generateMarkup() {
    throw new Error('Child View must implement _generateMarkup().');
  }

  _showMessage(message, type = 'error') {
    const messageElement = this._parentElement.querySelector('[data-message]');
    if (!messageElement) return;
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
  }
}
