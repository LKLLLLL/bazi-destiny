# Month-One Operations

This is the operating contract for the first 30 days. The constraints are one operator, 1.5-2 hours per day, no ad spend, and no new product features.

## Daily Routine

Spend the first 30 minutes on the same four actions:

1. Record GA4 users, sessions, acquisition source, landing pages, and funnel events.
2. Record Search Console impressions, clicks, and useful queries.
3. Reply to relevant social comments and questions.
4. Update the Daily Log before making any content decision.

## Funnel

The website funnel is:

```text
External content -> website user -> tool result -> payment click -> PayPal checkout -> purchase
```

GA4 events:

| Event | Meaning |
|---|---|
| `generate_chinese_name` | Chinese name results rendered |
| `generate_bazi_chart` | BaZi chart rendered |
| `generate_love_match` | Love Match result rendered |
| `click_payment` | Pay & Unlock clicked |
| `begin_checkout` | PayPal checkout started |
| `purchase` | PayPal capture confirmed by the server |

Never send names, birthdays, cities, email addresses, or other personal data to GA4.

## UTM Convention

Every profile and published asset should use a tracked link:

```text
utm_source=pinterest
utm_medium=social
utm_campaign=month-1-launch
utm_content=birthday-name-pin
```

Use lowercase, hyphen-separated values. `utm_content` identifies the asset or hook variant. Do not include personal data.

## Weekly Decisions

Rank performance in this order:

1. Website users by platform.
2. Completed tool results by platform.
3. Tool completion rate for Chinese Name, BaZi, and Love Match.
4. Payment clicks and checkout starts by content theme.
5. Orders and PayPal failures.

Do not optimize around follower count or impressions alone. At month end retain only two platforms, three content themes, and one primary acquisition tool.

Guardian Spirit remains excluded from external promotion until that decision is explicitly changed.

## Automated Guardrail

`pnpm analytics:audit` verifies the production GA4 measurement ID and all six funnel event hooks. It also runs automatically during `pnpm build`.
