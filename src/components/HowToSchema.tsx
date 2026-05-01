import React from 'react';
import StructuredDataScript from './StructuredDataScript';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string;
  steps: HowToStep[];
  image?: string;
}

export default function HowToSchema({ 
  name, 
  description, 
  totalTime = 'P2D',
  steps,
  image = 'https://www.deyarsu.com/images/hero-bg.webp'
}: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "image": image,
    "totalTime": totalTime,
    "estimatedCost": {
      "@type": "MoneyAmount",
      "currency": "SAR",
      "value": "2500"
    },
    "tool": [
      {
        "@type": "HowToTool",
        "name": "معدات تركيب احترافية"
      },
      {
        "@type": "HowToTool",
        "name": "مواد عالية الجودة"
      }
    ],
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": step.image || image
    }))
  };

  return <StructuredDataScript data={schema} />;
}
