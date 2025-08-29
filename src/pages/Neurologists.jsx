import React from 'react';
import SpecialistPage from '../components/SpecialistPage';

export default function Neurologists() {
  return (
    <SpecialistPage
      title="Neurologists"
      description="Expert brain and nervous system specialists"
      icon="/icons/doctor.png"
      searchTerms="neurology brain neurologist"
      specialty="neurology"
      seoTitle="Neurologists | Brain Specialists Near You | Doctar"
      seoDescription="Find qualified neurologists and brain specialists near you. Book appointments with certified neurologists for headaches, seizures, and nervous system conditions."
      seoKeywords="neurologist, brain specialist, neurology, headaches, seizures, stroke, parkinson"
      treatments={[
        "Headaches and migraines",
        "Seizures and epilepsy",
        "Stroke and cerebrovascular disease",
        "Parkinson's disease and movement disorders",
        "Multiple sclerosis and demyelinating diseases",
        "Memory problems and dementia"
      ]}
    />
  );
}
