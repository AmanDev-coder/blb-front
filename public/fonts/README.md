# Font Files

This directory contains the font files for Poppins and Work Sans.

## Font Optimization Instructions

For better performance, you can subset your fonts to include only the characters you need. Here's how:

### Using `pyftsubset` (from fonttools)

1. Install fonttools:
   ```
   pip install fonttools
   ```

2. Create a subset with only Latin characters:
   ```
   pyftsubset YourFont.ttf --unicodes="U+0000-00FF" --output-file="YourFont-subset.woff2" --flavor=woff2
   ```

3. For a more comprehensive subset including additional Latin characters, currency symbols, and common punctuation:
   ```
   pyftsubset YourFont.ttf --unicodes="U+0000-00FF,U+0100-017F,U+2000-206F,U+2070-209F,U+20A0-20CF" --output-file="YourFont-subset.woff2" --flavor=woff2
   ```

## Current Font Files

- Poppins (Regular, Light, Medium, SemiBold, Bold)
- Work Sans (Regular, Light, Medium, SemiBold, Bold)

These font files are loaded using CSS `@font-face` declarations in `src/Styles/local-fonts.css`.

## Performance Considerations

- Use WOFF2 format for best compression
- Preload critical font files in the HTML
- Consider using subset fonts for languages you support
- Consider keeping one font format plus fallbacks 