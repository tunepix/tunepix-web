import * as cheerio from "cheerio";

const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

export async function scrapeTitle(q: string) {
  const resp = await fetch(`https://api.genius.com/search?q=${q}`, {
    headers: {
      Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
    },
  });

  const { meta, response } = await resp.json();

  if (meta.status === 200 && response) {
    const [hit] = response.hits;
    const { full_title, url } = hit.result;

    return full_title;
  } else {
    return "";
  }
}

export async function scrapeLyrics(q: string) {
  const resp = await fetch(`https://api.genius.com/search?q=${q}`, {
    headers: {
      Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
    },
  });

  const { meta, response } = await resp.json();

  if (meta.status === 200 && response) {
    const [hit] = response.hits;
    const { full_title, url } = hit.result;

    const songResp = await fetch(url);
    const songHtml = await songResp.text();

    const $ = cheerio.load(songHtml);
    const lyrics = $("[data-lyrics-container=true]").html();

    if (!lyrics) return "";

    let chorusString = "[Chorus]";
    let verseString = "[Verse";

    if (lyrics.indexOf(chorusString) === -1) {
      chorusString = "[Припев]";
      verseString = "[Куплет";
    }

    if (chorusString.indexOf(chorusString) > -1) {
      const chorusBeginIndex = lyrics.indexOf(chorusString);
      const chorusEndIndex = chorusBeginIndex + chorusString.length;

      const chorus = lyrics?.slice(
        chorusEndIndex,
        lyrics.indexOf(verseString, chorusEndIndex)
      );

      const chorusText = cheerio.load(chorus.replace(/<br>/g, " ")).text();
      const chorusText2 = cheerio.load(chorus).text();

      console.log({
        chorusText,
        chorusText2,
      });

      return chorusText;
    } else {
      return lyrics;
    }
  }
}
