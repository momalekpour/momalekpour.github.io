import { TYPING_CONFIG } from "./typingConfig";

// Character-by-character typing animation with autocomplete previews, occasional
// "typos", and click-to-cycle between multiple texts. Ported from the original
// vanilla-JS TypingEffect class; the dynamic parent-height measurement was dropped
// (CSS `min-height` handles layout), and a destroy() method was added for React cleanup.
export class TypingEffect {
  private element: HTMLElement;
  private texts: string[];
  private currentTextIndex = 0;
  private currentIndex = 0;
  private isTyping = false;
  private shouldStop = false;
  private destroyed = false;
  private activeTimeout: number | null = null;
  private resolveDelay: (() => void) | null = null;

  private contentSpan: HTMLSpanElement;
  private previewSpan: HTMLSpanElement;
  private cursorSpan: HTMLSpanElement;

  private clickTarget: HTMLElement | null = null;
  private clickHandler: (() => void) | null = null;

  constructor(element: HTMLElement, texts: string[] | string) {
    this.element = element;
    this.texts = Array.isArray(texts) ? texts : [texts];

    this.contentSpan = document.createElement("span");
    this.previewSpan = document.createElement("span");
    this.cursorSpan = document.createElement("span");

    this.previewSpan.className = "preview";
    this.cursorSpan.className = "typing-cursor";
    this.cursorSpan.textContent = "|";

    this.element.appendChild(this.contentSpan);
    this.element.appendChild(this.previewSpan);
    this.element.appendChild(this.cursorSpan);

    this.contentSpan.textContent = "";
    this.previewSpan.textContent = "";
  }

  private findNextWord(text: string, startIndex: number): { word: string; end: number } | null {
    const wordRegex = /[\w']+[.,!?]?|\n|\s+|[.,!?]/g;
    wordRegex.lastIndex = startIndex;
    const match = wordRegex.exec(text);
    return match ? { word: match[0], end: match.index + match[0].length } : null;
  }

  private async simulateTyping(char: string): Promise<void> {
    if (this.shouldStop) return;

    if (Math.random() < TYPING_CONFIG.mistakeChance) {
      const mistakes = TYPING_CONFIG.commonMistakes[char.toLowerCase()] || [];
      if (mistakes.length > 0) {
        const mistake = mistakes[Math.floor(Math.random() * mistakes.length)];
        this.contentSpan.textContent += mistake;
        await this.delay(TYPING_CONFIG.backspaceDelay);

        if (this.shouldStop) return;

        this.contentSpan.textContent = (this.contentSpan.textContent ?? "").slice(0, -mistake.length);
      }
    }

    if (this.shouldStop) return;

    this.contentSpan.textContent += char;
    await this.delay(this.getCharacterDelay(char));
  }

  private getCharacterDelay(char: string): number {
    let delay = TYPING_CONFIG.baseSpeed;
    if (/[.,!?]/.test(char)) delay += TYPING_CONFIG.punctuationDelay;
    if (char === "\n") delay += TYPING_CONFIG.punctuationDelay;
    return delay * (1 - TYPING_CONFIG.speedVariation + Math.random() * TYPING_CONFIG.speedVariation * 2);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.resolveDelay = resolve;
      this.activeTimeout = window.setTimeout(() => {
        this.resolveDelay = null;
        resolve();
      }, ms);
    });
  }

  async type(): Promise<void> {
    if (this.destroyed) return;
    this.isTyping = true;
    const text = this.texts[this.currentTextIndex];

    if (this.shouldStop || this.currentIndex >= text.length) {
      this.isTyping = false;
      return;
    }

    // Try word autocomplete
    if (Math.random() < TYPING_CONFIG.autoCompleteChance) {
      const nextWord = this.findNextWord(text, this.currentIndex);
      if (nextWord && nextWord.word.length > 1) {
        this.previewSpan.textContent = nextWord.word;
        await this.delay(TYPING_CONFIG.autoCompleteDelay);

        if (this.shouldStop) {
          this.isTyping = false;
          return;
        }

        this.contentSpan.textContent += nextWord.word;
        this.previewSpan.textContent = "";
        this.currentIndex = nextWord.end;
        this.type();
        return;
      }
    }

    // Normal typing
    await this.simulateTyping(text[this.currentIndex]);

    if (this.shouldStop) {
      this.isTyping = false;
      return;
    }

    this.currentIndex++;
    this.type();
  }

  async changeText(): Promise<void> {
    // Stop current typing animation
    this.shouldStop = true;

    // Wait for current typing to stop if it's running
    while (this.isTyping) {
      await this.delay(10);
    }

    if (this.destroyed) return;

    // Reset state and clear content
    this.shouldStop = false;
    this.contentSpan.textContent = "";
    this.previewSpan.textContent = "";
    this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
    this.currentIndex = 0;

    await this.type();
  }

  enableClickToChange(clickableElement: HTMLElement): void {
    if (this.texts.length > 1) {
      clickableElement.style.cursor = "pointer";
      this.clickTarget = clickableElement;
      this.clickHandler = () => {
        this.changeText();
      };
      clickableElement.addEventListener("click", this.clickHandler);
    }
  }

  // Stop all activity and detach listeners (called on React unmount).
  destroy(): void {
    this.destroyed = true;
    this.shouldStop = true;
    if (this.activeTimeout !== null) {
      clearTimeout(this.activeTimeout);
      this.activeTimeout = null;
    }
    if (this.resolveDelay) {
      this.resolveDelay();
      this.resolveDelay = null;
    }
    if (this.clickTarget && this.clickHandler) {
      this.clickTarget.removeEventListener("click", this.clickHandler);
    }
  }
}
