const fs = require('fs');
const templates = JSON.parse(fs.readFileSync('webild-studio/assets/templates-catalog.json', 'utf8'));

const library = templates.map(t => {
  const colorMatch = t.raw ? t.raw.match(/colorTheme:\{([^}]+)\}/) : null;
  const styleMatch = t.raw ? t.raw.match(/styleProvider:\{([^}]+)\}/) : null;
  const recipeMatch = t.raw ? t.raw.match(/tooltipDescription:\"([^\"]+)\"/) : null;

  let colorObj = {};
  if (colorMatch) {
    try {
      const parts = colorMatch[1].split(',');
      parts.forEach(p => {
        const [k, v] = p.split(':');
        if (k && v) colorObj[k.replace(/['"\s]/g, '')] = v.replace(/['"\s]/g, '');
      });
    } catch(e) {}
  }

  return {
    id: t.id,
    title: t.title,
    category: t.category,
    tags: t.tags || [],
    description: t.description,
    recipe: recipeMatch ? recipeMatch[1] : t.description,
    defaultPrompt: t.defaultPrompt,
    colorTheme: colorObj,
    videoSrc: t.videoSrc,
    previewUrl: t.previewUrl,
    // Craft a Supercharged Prompt that user can customize
    masterPrompt: `Create an award-winning, high-converting ${t.title} website (${t.category}).
Layout & Structure: ${recipeMatch ? recipeMatch[1] : t.description}.
Color System: Background ${colorObj['--background'] || '#050811'}, Card ${colorObj['--card'] || '#0d1426'}, Accent ${colorObj['--accent'] || '#00f0ff'}, Foreground ${colorObj['--foreground'] || '#ffffff'}, Primary CTA ${colorObj['--primary-cta'] || '#2563eb'}.
3D & Motion: Auto-playing 3D model in Hero with mouse orbit, scroll-scrubbed camera timeline with pinned GSAP ScrollTrigger, Lenis smooth scrolling, interactive hotspots, and 3D card tilt.`
  };
});

fs.writeFileSync('webild_prompt_library.json', JSON.stringify(library, null, 2), 'utf8');
console.log('Saved webild_prompt_library.json with', library.length, 'templates.');
