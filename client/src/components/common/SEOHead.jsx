import { Helmet } from 'react-helmet-async';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

/**
 * SEO Head component using react-helmet-async
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page meta description
 * @param {string} props.canonical - Canonical URL path (e.g., '/cities/delhi')
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - OG type (default: 'website')
 * @param {Object} props.jsonLd - JSON-LD structured data object
 */
const SEOHead = ({
  title,
  description = APP_DESCRIPTION,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} — Discover the Real Taste of Every City`;
  const siteUrl = window.location.origin;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : window.location.href;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
