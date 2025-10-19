// Configuration file for website settings
const WEBSITE_CONFIG = {
    // Content file path
    contentFile: './config/content.yaml',
    
    // Typing animation configuration
    typing: {
        baseSpeed: 45,
        speedVariation: 0.7,
        autoCompleteChance: 0.08,
        autoCompleteDelay: 150,
        mistakeChance: 0.03,
        backspaceDelay: 200,
        punctuationDelay: 300,
        commonMistakes: {
            'a': ['aq', 'qa'],
            'e': ['ew', 're'],
            'i': ['io', 'ui'],
            'n': ['nm', 'bn'],
            's': ['sa', 'sd'],
            't': ['ty', 'tr'],
            'h': ['hj', 'gh']
        }
    },
    
    // Development server settings
    dev: {
        port: 8000,
        host: 'localhost'
    }
};

// Export configuration (for module usage) and make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WEBSITE_CONFIG;
} else if (typeof window !== 'undefined') {
    window.WEBSITE_CONFIG = WEBSITE_CONFIG;
}