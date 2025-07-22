'use server';
/**
 * @fileOverview An AI agent for converting plain text to styled HTML.
 *
 * - convertToHtml - A function that handles the text-to-HTML conversion.
 * - ConvertToHtmlInput - The input type for the convertToHtml function.
 * - ConvertToHtmlOutput - The return type for the convertToHtml function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertToHtmlInputSchema = z.object({
  articleText: z.string().describe('The plain text article to convert.'),
});
export type ConvertToHtmlInput = z.infer<typeof ConvertToHtmlInputSchema>;

const ConvertToHtmlOutputSchema = z.object({
  htmlContent: z.string().describe('The converted HTML content with inline CSS.'),
});
export type ConvertToHtmlOutput = z.infer<typeof ConvertToHtmlOutputSchema>;

export async function convertToHtml(input: ConvertToHtmlInput): Promise<ConvertToHtmlOutput> {
  return convertToHtmlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertToHtmlPrompt',
  input: {schema: ConvertToHtmlInputSchema},
  output: {schema: ConvertToHtmlOutputSchema},
  prompt: `You are an expert HTML/CSS converter that transforms plain text articles into beautifully formatted HTML with embedded CSS styling.

**Your Task:**
Convert the provided plain text article into a complete HTML structure with inline CSS styling that creates an engaging, professional blog post layout.

**Requirements:**

1. **HTML Structure:**
   - Wrap everything in a main container div with class "blog-content"
   - Use proper semantic HTML tags (h1, h2, h3, p, ul, ol, blockquote, etc.)
   - Automatically detect and format headings, paragraphs, lists, and quotes
   - Add appropriate classes for styling hooks

2. **Content Enhancement:**
   - Identify the main title and format as h1
   - Convert section headings to h2, h3 as appropriate
   - Format bullet points as unordered lists (ul/li)
   - Format numbered items as ordered lists (ol/li)
   - Convert quotes or important statements to blockquotes
   - Highlight key phrases with <strong> or <em> tags
   - Create call-to-action boxes for important information

3. **CSS Styling (Inline Styles):**
   - Modern, clean typography with web-safe fonts
   - Responsive design that works on mobile and desktop
   - Professional color scheme with good contrast
   - Proper spacing and margins for readability
   - Hover effects and subtle animations where appropriate
   - Style headings with gradients or attractive colors
   - Add background colors for important sections
   - Include box shadows and rounded corners for modern look

4. **Special Elements to Add:**
   - If the content mentions tips, create styled tip boxes
   - If there are steps or processes, number them visually
   - Add visual separators between major sections
   - Style any links mentioned in the text
   - Create highlighted quote boxes for important statements
   - Add subtle borders and spacing for better visual hierarchy

5. **Formatting Guidelines:**
   - Ensure mobile-responsive design
   - Use relative units (em, rem, %) where appropriate
   - Include smooth transitions for interactive elements
   - Maintain consistent spacing throughout
   - Use a maximum width for better readability
   - Add proper line heights for easy reading

6. **Output Format:**
   - Return only the HTML with embedded CSS (no separate CSS files)
   - No <!DOCTYPE>, <html>, <head>, or <body> tags needed
   - Start directly with the styled content container
   - Ensure all CSS is inline or in <style> tags within the content
   - Make it ready to insert directly into a blog post content area

**Style Preferences:**
- Use modern color palettes (blues, purples, greens)
- Include subtle gradients and shadows
- Make headings stand out with larger sizes and colors
- Add padding and margins for breathing room
- Use hover effects on interactive elements
- Ensure dark mode compatibility where possible
- Keep the design clean and professional

Convert the following article text into formatted HTML with CSS:

{{{articleText}}}
`,
});

const convertToHtmlFlow = ai.defineFlow(
  {
    name: 'convertToHtmlFlow',
    inputSchema: ConvertToHtmlInputSchema,
    outputSchema: ConvertToHtmlOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return any output.");
    }
    return { htmlContent: output.htmlContent };
  }
);
