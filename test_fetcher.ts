import { getLocalizedServiceContent } from './src/lib/related-content-fetcher';

async function main() {
  console.log("Fetching for sawater...");
  const data = await getLocalizedServiceContent('sawater', 'ar');
  console.log(`Projects: ${data.projects.length}, Articles: ${data.articles.length}`);
}

main();
