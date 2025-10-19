// Use global typing configuration from config.js
const TYPING_CONFIG = WEBSITE_CONFIG.typing;

class TypingEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.currentTextIndex = 0;
        this.currentIndex = 0;
        this.isTyping = false;
        this.shouldStop = false;

        // Create text spans
        this.contentSpan = document.createElement('span');
        this.previewSpan = document.createElement('span');
        this.cursorSpan = document.createElement('span');

        this.previewSpan.className = 'preview';
        this.cursorSpan.className = 'typing-cursor';
        this.cursorSpan.textContent = '|';

        this.element.appendChild(this.contentSpan);
        this.element.appendChild(this.previewSpan);
        this.element.appendChild(this.cursorSpan);

        // Create size calculator element
        this.sizeCalculator = document.createElement('div');
        this.sizeCalculator.className = 'size-calculator';
        this.element.parentNode.appendChild(this.sizeCalculator);

        // Pre-calculate sizes for all texts
        this.calculateSizes();

        // Initialize with empty content
        this.contentSpan.textContent = '';
        this.previewSpan.textContent = '';

        // Add visibility control styles
        this.sizeCalculator.style.visibility = 'hidden';
        this.sizeCalculator.style.position = 'absolute';
        this.sizeCalculator.style.top = '-9999px';
    }

    calculateSizes() {
        const sizes = this.texts.map(text => {
            this.sizeCalculator.textContent = text;
            const height = this.sizeCalculator.offsetHeight;
            return height;
        });

        // Set container height to maximum required height
        const maxHeight = Math.max(...sizes);
        this.element.parentNode.style.height = `${maxHeight}px`;
    }

    findNextWord(text, startIndex) {
        const wordRegex = /[\w']+[.,!?]?|\n|\s+|[.,!?]/g;
        wordRegex.lastIndex = startIndex;
        const match = wordRegex.exec(text);
        return match ? { word: match[0], end: match.index + match[0].length } : null;
    }

    async simulateTyping(char) {
        if (this.shouldStop) return;
        
        if (Math.random() < TYPING_CONFIG.mistakeChance) {
            const mistakes = TYPING_CONFIG.commonMistakes[char.toLowerCase()] || [];
            if (mistakes.length > 0) {
                const mistake = mistakes[Math.floor(Math.random() * mistakes.length)];
                this.contentSpan.textContent += mistake;
                await this.delay(TYPING_CONFIG.backspaceDelay);
                
                if (this.shouldStop) return;
                
                this.contentSpan.textContent = this.contentSpan.textContent.slice(0, -mistake.length);
            }
        }

        if (this.shouldStop) return;

        this.contentSpan.textContent += char;
        await this.delay(this.getCharacterDelay(char));
    }

    getCharacterDelay(char) {
        let delay = TYPING_CONFIG.baseSpeed;
        if (/[.,!?]/.test(char)) delay += TYPING_CONFIG.punctuationDelay;
        if (char === '\n') delay += TYPING_CONFIG.punctuationDelay;
        return delay * (1 - TYPING_CONFIG.speedVariation + Math.random() * TYPING_CONFIG.speedVariation * 2);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async type() {
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
                this.previewSpan.textContent = '';
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

    async changeText() {
        // Stop current typing animation
        this.shouldStop = true;
        
        // Wait for current typing to stop if it's running
        while (this.isTyping) {
            await this.delay(10);
        }
        
        // Reset state and clear content
        this.shouldStop = false;
        this.contentSpan.textContent = '';
        this.previewSpan.textContent = '';
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        this.currentIndex = 0;

        // Pre-calculate size for new text
        this.sizeCalculator.textContent = this.texts[this.currentTextIndex];
        const height = this.sizeCalculator.offsetHeight;
        this.element.parentNode.style.height = `${height}px`;

        await this.type();
    }

    enableClickToChange(clickableElement) {
        if (this.texts.length > 1) {
            clickableElement.style.cursor = 'pointer';
            clickableElement.addEventListener('click', () => {
                this.changeText();
            });
        }
    }
}

// Clean up when typing effect is destroyed
window.addEventListener('beforeunload', () => {
    const sizeCalculators = document.querySelectorAll('.size-calculator');
    sizeCalculators.forEach(calc => calc.remove());
});
