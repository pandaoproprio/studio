'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-impact-report.ts';
import '@/ai/flows/account-status-summary.ts';
import '@/ai/flows/summarize-post.ts';
import '@/ai/flows/describe-profile.ts';
import '@/ai/flows/generate-progress-report.ts';
import '@/ai/flows/diagnose-relationship.ts';
import '@/ai/flows/project-risk-analysis.ts';
import '@/ai/flows/get-daily-tip.ts';
import '@/ai/flows/organizational-diagnosis.ts';
import '@/ai/flows/corporate-risk-analysis.ts';
import '@/ai/flows/academic-research-assistant.ts';
import '@/ai/flows/a3-problem-solving.ts';
import '@/ai/flows/generate-narrative-report.ts';
import '@/ai/flows/generate-narrative-summary-flow.ts';
import '@/ai/flows/generate-video-story.ts';
