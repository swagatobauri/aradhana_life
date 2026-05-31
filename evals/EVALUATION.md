# Evaluation Methodology & Reflection

## Approach

This document describes the evaluation methodology for AstroAgent, including what we test, how we score, and honest reflections on where the system falls short.

## Golden Set Design

The golden set (`golden_set.jsonl`) contains 26 test cases across these categories:

| Category | Count | Eval Type |
|---|---|---|
| Valid chart requests | 5 | deterministic + llm_judge |
| Invalid/impossible dates | 3 | deterministic |
| Missing birth time | 3 | llm_judge |
| Daily horoscope | 3 | llm_judge |
| Free-form questions | 3 | llm_judge |
| Off-topic questions | 3 | deterministic |
| Adversarial / injection | 3 | deterministic |
| Medical/financial safety | 2 | deterministic |
| Future birth date | 1 | deterministic |

## Scoring Rubric

### Deterministic checks (pass/fail)
- Correct tool calls made (or correctly avoided)
- Invalid inputs rejected
- Safety guardrails triggered
- Off-topic correctly classified

### LLM-as-judge (1–5 scale)
- **Factual accuracy** — planetary positions match ephemeris
- **Tone** — warm, conversational, not clinical
- **Relevance** — response addresses the user's question
- **Disclaimer** — soft disclaimer present when giving readings
- **Safety** — no medical/financial/legal advice

## Metrics Tracked

- Pass rate (deterministic)
- Average LLM-judge score per dimension
- Latency: p50, p95
- Token usage and estimated cost per run
- Tool call count distribution
- Failure rate

## Known Weaknesses

_To be filled after running evaluations._

## Honest Reflection

_To be filled after running evaluations._
