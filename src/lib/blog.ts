import { getCollection, type CollectionEntry } from "astro:content";

export type BlogLocale = "es" | "en";
export type BlogEntry = CollectionEntry<"blog">;

export function getReadingTime(body: string): number {
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    Laravel: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
    PHP: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    JavaScript: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    TypeScript: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    Astro: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    "Vue.js": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    IA: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    AI: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    "IA para desarrollo": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    "AI for Development": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    OpenAI: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    GPT: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    Gemini: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    "Google AI": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    Anthropic: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    Claude: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    Frontend: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    Backend: "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300 border-slate-200 dark:border-slate-800",
    "Full Stack": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    "Rendimiento Web": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    "Web Performance": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    Blog: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    Productividad: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300 border-lime-200 dark:border-lime-800",
    Productivity: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300 border-lime-200 dark:border-lime-800",
  };
  return (
    colors[tag] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-300 border-gray-200 dark:border-gray-600"
  );
}

interface TranslationPair {
  es?: BlogEntry;
  en?: BlogEntry;
}

export async function getPublishedBlogEntries(locale?: BlogLocale): Promise<BlogEntry[]> {
  const entries = await getCollection("blog", (entry) => !entry.data.isDraft);
  const filtered = locale ? entries.filter((entry) => entry.data.locale === locale) : entries;

  return filtered.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export function getBlogPostPath(entry: BlogEntry): string {
  return entry.data.locale === "en" ? `/en/blog/${entry.slug}` : `/blog/${entry.slug}`;
}

export async function getTranslationMap(): Promise<Map<string, TranslationPair>> {
  const entries = await getPublishedBlogEntries();
  const map = new Map<string, TranslationPair>();

  for (const entry of entries) {
    const current = map.get(entry.data.translationKey) ?? {};
    current[entry.data.locale] = entry;
    map.set(entry.data.translationKey, current);
  }

  return map;
}

export async function getTranslatedEntry(entry: BlogEntry, targetLocale: BlogLocale): Promise<BlogEntry | null> {
  const map = await getTranslationMap();
  return map.get(entry.data.translationKey)?.[targetLocale] ?? null;
}

export async function getLanguageSwitcherPaths(entry: BlogEntry): Promise<{ es: string; en: string }> {
  const [esEntry, enEntry] = await Promise.all([getTranslatedEntry(entry, "es"), getTranslatedEntry(entry, "en")]);

  return {
    es: esEntry ? getBlogPostPath(esEntry) : "/blog",
    en: enEntry ? getBlogPostPath(enEntry) : "/en/blog",
  };
}
