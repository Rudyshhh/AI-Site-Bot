"use server";

import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCIFrOjC0Md2AoJprEFyGfYxk6YeMR0268");

const contentMap = new Map();

export async function getUrls() {
  return Array.from(contentMap.keys());
}

export async function addUrl(url) {
  if (!contentMap.has(url)) {
    await fetchAndProcessContent(url);
  }
}

export async function clearUrls() {
  contentMap.clear();
}

async function fetchAndProcessContent(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $("script, style, noscript, iframe, nav, footer, header, .header, .footer, .nav").remove();

    const mainContent = $("main, article, .content, #content, .main-content, #main-content").text() || $("body").text();

    const limitedContent = mainContent.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim().split(" ").slice(0, 1950).join(" ");


    contentMap.set(url, limitedContent);
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
    throw new Error(`Failed to fetch content from ${url}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function askQuestion(question) {
  try {
    if (contentMap.size === 0) {
      return "Please add some URLs first before asking questions.";
    }

    const allContent = Array.from(contentMap.entries())
      .map(([url, content]) => `Source: ${url}\n${content}\n---\n`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-preview-02-05" });
    const prompt = `You are an AI assistant that answers questions based solely on the provided content. If the answer cannot be found in the given content, say 'I cannot answer that question based on the provided content.' Based on the following content, please answer this question: "${question}"\n\nContent:\n${allContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating answer:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "Sorry, there was an error generating the answer. Please try again.";
  }
}
