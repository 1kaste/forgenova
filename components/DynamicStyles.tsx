import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { PRESET_THEMES } from '../constants';

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}


const DynamicStyles: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { content, themeMode } = context;
  const { themes, activeTheme } = content;

  const currentTheme = themes.find(t => t.name === activeTheme) || themes[0];
  const defaultTheme = PRESET_THEMES.find(t => t.name === 'Default') || PRESET_THEMES[0];

  const palette = {
      ...defaultTheme[themeMode],
      ...currentTheme[themeMode]
  };

  const cssVariables = Object.entries(palette)
    .map(([key, value]) => {
      const hsl = hexToHsl(value);
      if (!hsl) return '';
      // e.g. --primary: 259 94% 51%;
      return `--${key}: ${hsl.h.toFixed(1)} ${hsl.s.toFixed(1)}% ${hsl.l.toFixed(1)}%;`;
    })
    .join('\n');
  
  const styleString = `
    :root {
        ${cssVariables}
    }
  `;

  return <style>{styleString}</style>;
};

export default DynamicStyles;
