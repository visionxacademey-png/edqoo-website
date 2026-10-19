async function testApi() {
  try {
    const res = await fetch('http://localhost:5001/api/categories');
    if (!res.ok) {
      console.error(`HTTP error: ${res.status} ${res.statusText}`);
      return;
    }
    const categories: any[] = await res.json();
    console.log(`Fetched ${categories.length} categories from GET /api/categories`);
    
    const parents = categories.filter((c) => !c.parentId && !c.parentSlug);
    console.log(`\nTop-level Categories (${parents.length}):`);
    parents.forEach((c) => console.log(` - [${c.id}] ${c.name} (${c.slug})`));

    const spokenTutorialParents = parents.filter((c) => c.name.toLowerCase().trim() === 'spoken tutorial');
    console.log(`\nTop-level categories named 'Spoken Tutorial': ${spokenTutorialParents.length}`);

    const subcategories = categories.filter((c) => c.parentSlug === 'spoken-tutorial' || c.parentId === 'cat-spoken-tutorial');
    console.log(`\nSubcategories under Spoken Tutorial (${subcategories.length}):`);
    subcategories.forEach((c) => console.log(` - [${c.id}] ${c.name} (${c.slug})`));
  } catch (err: any) {
    console.error('Fetch error:', err.message);
  }
}

testApi();
