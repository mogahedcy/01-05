import type { Metadata } from 'next';
import ProjectAnalysisClient from './ProjectAnalysisClient';

export const metadata: Metadata = {
  title: 'تحليلات المشاريع AI | لوحة التحكم',
  description: 'عرض وإدارة تحليلات الذكاء الاصطناعي للمشاريع',
  robots: 'noindex, nofollow',
};

export default function ProjectAnalysisPage() {
  return <ProjectAnalysisClient />;
}
