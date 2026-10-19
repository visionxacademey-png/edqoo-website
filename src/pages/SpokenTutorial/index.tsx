import React from 'react';
import { useParams } from 'react-router-dom';
import { SpokenTutorialLanding } from './SpokenTutorialLanding';
import { SubCategoryDetail } from './SubCategoryDetail';
import { getSubCategoryBySlug } from './data';

export const SpokenTutorial: React.FC = () => {
  const { slug, categorySlug } = useParams<{ slug?: string; categorySlug?: string }>();

  const targetSlug = slug || categorySlug || '';

  // If slug is provided and is a recognized subcategory, render the detail page
  if (targetSlug && targetSlug !== 'all' && targetSlug !== 'spoken-tutorial' && targetSlug !== 'english-mirror') {
    const subcat = getSubCategoryBySlug(targetSlug);
    if (subcat) {
      return <SubCategoryDetail slugProp={targetSlug} />;
    }
  }

  // Otherwise, render the dedicated Spoken Tutorial landing page
  return <SpokenTutorialLanding />;
};

export default SpokenTutorial;
