import type { APIRoute } from 'astro';
import {
  PUBLIC_BAZI_TEST_CASES,
  PUBLIC_TEST_CASES_UPDATED,
  PUBLIC_TEST_CASE_VERSION,
  PUBLIC_TEST_CONVENTIONS,
} from '../data/public-bazi-test-cases';
import { SITE_URL } from '../lib/brand';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: 'MyBaziDestiny public BaZi calculator test cases',
        version: PUBLIC_TEST_CASE_VERSION,
        dateModified: PUBLIC_TEST_CASES_UPDATED,
        webpage: `${SITE_URL}/test-cases.html`,
        methodology: `${SITE_URL}/methodology.html`,
        conventions: PUBLIC_TEST_CONVENTIONS,
        testCases: PUBLIC_BAZI_TEST_CASES,
      },
      null,
      2
    ),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
