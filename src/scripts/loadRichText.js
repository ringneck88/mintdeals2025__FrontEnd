// Client-side script to load RichText content
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('richTextContainer');
  const slug = container?.getAttribute('data-category-slug');

  console.log('🔍 Client-side: Starting to load RichText for slug:', slug);

  if (!container || !slug) {
    console.error('❌ Missing container or slug');
    return;
  }

  try {
    const url = `https://mintdealsbackend-production.up.railway.app/api/categories?filters[slug][$eq]=${slug}&populate=*`;
    console.log('🌐 Fetching from:', url);

    const response = await fetch(url);
    console.log('📡 Response status:', response.status);

    const data = await response.json();
    console.log('📦 Response data:', data);

    const richText = data?.data?.[0]?.RichText;
    console.log('📝 RichText type:', typeof richText);
    console.log('📝 RichText length:', richText?.length);
    console.log('📝 RichText preview:', richText?.substring(0, 100));

    if (richText && typeof richText === 'string') {
      container.innerHTML = richText;
      console.log('✅ Successfully rendered RichText');
    } else {
      container.innerHTML = '<p>Error: Content not available</p>';
      console.error('❌ RichText is not a string or is empty');
    }
  } catch (error) {
    console.error('❌ Failed to load rich text:', error);
    container.innerHTML = '<p>Error loading content. Check console for details.</p>';
  }
});
