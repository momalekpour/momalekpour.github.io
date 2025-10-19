// functions to load and parse yml
async function loadContent() {
  try {
    const response = await fetch(WEBSITE_CONFIG.contentFile);
    const yamlText = await response.text();
    const content = jsyaml.load(yamlText);

    // populate profile section
    const profileHeader = document.querySelector(".profile-header");
    if (profileHeader && content.profile) {
      profileHeader.innerHTML = `
        <h1>${content.profile.name || ""}</h1>
        <p>${content.profile.title || ""}</p>
      `;
    }

    // populate about me section
    const aboutMe = document.querySelector(".about-me");
    if (aboutMe && content.aboutMe && content.aboutMe.texts) {
      aboutMe.innerHTML = `
        <h2>About Me</h2>
        <div id="typed-text"></div>
      `;

      // initialize typing effect
      const typedTextElement = document.getElementById("typed-text");
      if (typedTextElement) {
        const typingEffect = new TypingEffect(
          typedTextElement,
          content.aboutMe.texts
        );
        typingEffect.type();

        // enable click to change text functionality
        typingEffect.enableClickToChange(aboutMe);

        // store the typing effect instance for potential future use
        window.typingEffect = typingEffect;
      }

      // initialize about me interactive effects
      initializeAboutMeEffects(aboutMe);
    }

    // populate contact section
    const contactSection = document.querySelector(".contact-section");
    if (contactSection && content.contact && content.contact.social) {
      contactSection.innerHTML = `
        <h2>Get in Touch</h2>
        <div class="social-links">
          ${content.contact.social
            .map(
              (link) => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>
          `
            )
            .join("")}
        </div>
      `;
    }

    // populate projects/publications section
    const projectsSection = document.querySelector(".projects");
    if (projectsSection && content.publications) {
      projectsSection.innerHTML = `
        <h2>Publications & Projects</h2>
        <div class="project-grid">
          ${content.publications
            .map(
              (pub) => `
            <div class="project-item">
              <h3>${pub.title}</h3>
              <p>${pub.description}</p>
              ${
                pub.links
                  ? `
                <div class="project-links">
                  ${pub.links
                    .map(
                      (link) => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>
                  `
                    )
                    .join("")}
                </div>
              `
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading content:", error);
    // add fallback content in case of error
    document.querySelector(".profile-header").innerHTML = `
      <h1>Mo Malekpour</h1>
      <p>AI Software Engineer/Researcher</p>
    `;
  }
}

// initialize About Me interactive effects
function initializeAboutMeEffects(aboutMeSection) {
  const h2 = aboutMeSection.querySelector('h2');
  
  if (!h2) return;

  const glitchChars = ['@', '#', '$', '%', '&', '*', '!', '?', '<', '>', '{', '}', '[', ']', '█', '▓', '▒', '░'];
  let glitchInterval;

  // Character glitch effect
  function triggerGlitch() {
    const originalText = 'About Me';
    let glitchedText = originalText;
    
    // Randomly glitch 1-2 characters
    const numGlitches = Math.random() < 0.5 ? 2 : 7;
    
    for (let i = 0; i < numGlitches; i++) {
      const randomIndex = Math.floor(Math.random() * originalText.length);
      const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      glitchedText = glitchedText.substring(0, randomIndex) + randomChar + glitchedText.substring(randomIndex + 1);
    }
    
    h2.textContent = glitchedText;
    h2.classList.add('glitching');
    
    // Restore original text after glitch animation
    setTimeout(() => {
      h2.textContent = originalText;
      h2.classList.remove('glitching');
    }, 100);
  }

  // Start effects
  function startEffects() {
    // Trigger glitch effect randomly every 2-4 seconds
    function scheduleNextGlitch() {
      const delay = 1000 + Math.random() * 2000; // 2-4 seconds
      glitchInterval = setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, delay);
    }
    
    scheduleNextGlitch();
  }

  // Stop effects
  function stopEffects() {
    if (glitchInterval) clearTimeout(glitchInterval);
    h2.textContent = 'About Me';
    h2.classList.remove('glitching');
  }

  // Start the effects
  startEffects();

  // Store cleanup function for potential future use
  aboutMeSection.stopInteractiveEffects = stopEffects;
}

// load content when the document is ready
document.addEventListener("DOMContentLoaded", loadContent);
