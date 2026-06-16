export default class TouchControls {
  constructor() {
    this.state = { left: false, right: false, jump: false };
    this.isTouchDevice = 'ontouchstart' in window;

    if (this.isTouchDevice) {
      this.createButtons();
    }
  }

  createButtons() {
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '1000',
    });
    document.body.appendChild(this.container);

    this.leftButton = this.createButton('◀', { left: '20px', bottom: '20px' });
    this.rightButton = this.createButton('▶', { left: '100px', bottom: '20px' });
    this.jumpButton = this.createButton('⤒', {
      right: '20px',
      bottom: '20px',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      fontSize: '28px',
    });

    this.bindButton(this.leftButton, 'left');
    this.bindButton(this.rightButton, 'right');
    this.bindButton(this.jumpButton, 'jump');
  }

  createButton(label, style) {
    const button = document.createElement('div');
    button.textContent = label;
    Object.assign(button.style, {
      position: 'absolute',
      width: '60px',
      height: '60px',
      minWidth: '60px',
      minHeight: '60px',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.3)',
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'auto',
      userSelect: 'none',
      touchAction: 'none',
      ...style,
    });
    this.container.appendChild(button);
    return button;
  }

  bindButton(button, key) {
    const setState = (value) => (event) => {
      event.preventDefault();
      this.state[key] = value;
    };
    button.addEventListener('touchstart', setState(true), { passive: false });
    button.addEventListener('touchend', setState(false), { passive: false });
    button.addEventListener('touchcancel', setState(false), { passive: false });
  }

  getInput() {
    return this.state;
  }

  destroy() {
    if (this.container) this.container.remove();
  }
}
