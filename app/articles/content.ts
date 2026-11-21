import type { ProjectImage } from '../projects';
import auLiving from './au-living.json';
import foodDeliveryTrust from './food-delivery-platform-trust.json';
import hospitalResourceForecasting from './hospital-resource-forecasting.json';
import thaiReceiptOrientation from './thai-receipt-orientation.json';

type ArticleSection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  subsections?: readonly { title: string; paragraphs: readonly string[] }[];
  questions?: readonly string[];
  link?: { label: string; href: string };
  figures?: readonly ProjectImage[];
};

type Article = {
  slug: string;
  title: string;
  category: string;
  description: string;
  authors?: readonly string[];
  affiliation?: string;
  abstract?: string;
  keywords: readonly string[];
  pdfPath?: string;
  sections: readonly ArticleSection[];
};

export const articles: readonly Article[] = [
  foodDeliveryTrust,
  hospitalResourceForecasting,
  thaiReceiptOrientation,
  auLiving,
];
