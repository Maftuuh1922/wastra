import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export interface ArticleData {
  title: string | null;
  content: string | null;
  textContent: string | null;
  length: number | null;
  excerpt: string | null;
  byline: string | null;
  dir: string | null;
  siteName: string | null;
  lang: string | null;
}

export async function scrapeArticle(url: string): Promise<ArticleData | null> {
  try {
    // 1. Fetch the raw HTML of the page
    // Using a generic User-Agent to avoid basic bot-blocking
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 } // Cache for 1 hour to prevent spamming
    });

    if (!response.ok) {
      console.error(`Failed to fetch article. Status: ${response.status}`);
      return null;
    }

    const htmlString = await response.text();

    // 2. Parse HTML with JSDOM
    // Note: We disable script execution for security and performance
    const dom = new JSDOM(htmlString, { url });

    // Pre-processing for readability: 
    // Sometimes news sites have "baca juga" or related articles inside the text that mess up reading.
    // We can try to remove them if we know their common classes, but readability is usually smart enough.

    // 3. Extract content using Readability
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    return article as ArticleData;
  } catch (error) {
    console.error('Error scraping article:', error);
    return null;
  }
}
