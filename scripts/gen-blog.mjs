#!/usr/bin/env node
// One-off generator for placeholder blog posts. Safe to re-run (skips existing).
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, 'content/blog');
mkdirSync(dir, { recursive: true });

const DATE = '2026-05-30';
const posts = [
  {
    slug: 'how-to-transfer-to-cornell',
    title: 'How to Transfer to Cornell University: The Complete Guide',
    description:
      'Everything you need to know about transferring to Cornell — acceptance rates, GPA requirements, essays, deadlines, and insider strategy from a consultant who transferred there.',
    tags: ['cornell', 'ivy league', 'transfer guide'],
  },
  {
    slug: 'how-to-transfer-to-columbia',
    title: 'How to Transfer to Columbia University: Strategy & Requirements',
    description:
      "A detailed guide to Columbia's transfer admissions process, GPA expectations, essay prompts, and what makes a competitive transfer applicant.",
    tags: ['columbia', 'ivy league', 'transfer guide'],
  },
  {
    slug: 'how-to-transfer-to-uchicago',
    title: 'How to Transfer to UChicago: What Admissions Looks For',
    description:
      "Inside UChicago's transfer process — acceptance rates, supplemental essays, academic fit, and how to position yourself as a strong transfer candidate.",
    tags: ['uchicago', 'transfer guide'],
  },
  {
    slug: 'how-to-transfer-to-northwestern',
    title: 'How to Transfer to Northwestern University: Full Breakdown',
    description:
      'How to build a competitive Northwestern transfer application — GPA benchmarks, essay approach, and strategies that work for non-traditional applicants.',
    tags: ['northwestern', 'transfer guide'],
  },
  {
    slug: 'can-you-transfer-with-a-low-gpa',
    title: 'Can You Transfer to a Top University With a Low GPA?',
    description:
      'Yes. Our founder did it with a 2.9. Here’s how GPA factors into transfer admissions and what you can do to compensate for a lower number.',
    tags: ['low gpa', 'transfer strategy'],
  },
  {
    slug: 'is-transferringup-legit-reviews-and-results',
    title: 'Is TransferringUP Legit? Reviews, Results, and What We Actually Do',
    description:
      'Real client results, real testimonials, and a transparent look at how TransferringUP works — and why transfer admissions is the only thing we do.',
    tags: ['reviews', 'results'],
  },
  {
    slug: 'transfer-application-timeline-2026-2027',
    title: 'Transfer Application Timeline 2026-2027: Key Dates and Deadlines',
    description:
      'A month-by-month timeline for the 2026-2027 transfer application cycle. When to start, what to prepare, and how to stay on track.',
    tags: ['timeline', 'deadlines', 'transfer guide'],
  },
  {
    slug: 'community-college-to-ivy-league-transfer-guide',
    title: 'Community College to Ivy League: A Realistic Transfer Guide',
    description:
      'How to transfer from a community college to an Ivy League or T30 university. Acceptance data, application strategy, and real examples.',
    tags: ['community college', 'ivy league', 'transfer guide'],
  },
  {
    slug: 'transfer-essay-examples-and-tips',
    title: 'Transfer Essay Examples and Writing Tips That Actually Work',
    description:
      'How to write a transfer essay that admissions officers remember. Structure, common mistakes, and what top schools are really looking for.',
    tags: ['essays', 'transfer strategy'],
  },
  {
    slug: 'best-schools-for-transfer-students',
    title: 'The Best Universities for Transfer Students in 2026',
    description:
      'Which top universities are most transfer-friendly? Acceptance rates, credit policies, and which schools give transfer students the best experience.',
    tags: ['school selection', 'transfer guide'],
  },
];

let written = 0;
for (const p of posts) {
  const file = resolve(dir, `${p.slug}.md`);
  if (existsSync(file)) continue;
  const tags = `[${p.tags.map((t) => `"${t}"`).join(', ')}]`;
  const body = `---
title: "${p.title.replace(/"/g, '\\"')}"
description: "${p.description.replace(/"/g, '\\"')}"
date: "${DATE}"
author: "Ajay"
image: "/images/blog/${p.slug}.jpg"
tags: ${tags}
---

> Placeholder draft — the founder will replace this with the full guide.

${p.description}

## Overview

This guide will walk through the strategy, requirements, and timeline involved. Our approach is built from firsthand experience: our founder transferred to Cornell with a 2.9 GPA, and we now run that same system for every client.

## What admissions actually looks for

Transfer admissions rewards a clear narrative, an upward academic trajectory, and a strong "why this school" case. We help you build all three.

## Next steps

Ready to start? [Book a free consultation](/contact) and we'll map out your transfer plan.
`;
  writeFileSync(file, body);
  written++;
}

console.log(`[gen-blog] wrote ${written} new post(s) to content/blog/`);
