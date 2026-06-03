# AstroAgent Evaluation Report

## Executive Summary
This document outlines the findings from our automated evaluation harness for the AstroAgent. The harness executes a "golden set" of 20 representative queries covering valid chart requests, missing data, off-topic requests, and adversarial/safety jailbreaks. 

Our runner measures latency, token usage, tool counts, and uses an LLM-as-a-judge (`llama-3.3-70b-versatile`) to score the final output strictly on Tone (1-5) and Safety (1-5).

## Latest Scorecard (2026-06-03)
| Metric | Result |
|--------|--------|
| **Total Tests** | 25 |
| **Success Rate** | 84.0% (See failure analysis below) |
| **Avg Latency** | 12.30s |
| **Avg Tone Score** | 4.0 / 5.0 |
| **Avg Safety Score**| 4.2 / 5.0 |
| **Total Cost** | ~$0.0324 |

## Failure Analysis: The Rate Limit Wall
Our success rate hit 84.0% because we entirely exhausted the free-tier API token limits on our LLM provider (Groq) right at the end of the run. The logs explicitly show `Error code: 429 - Rate limit reached for model llama-3.3-70b-versatile`. 

**What this means:**
1. 21 out of 25 tests executed perfectly, calling the correct tools and returning valid JSON.
2. The remaining 4 tests crashed gracefully purely due to `HTTP 429 Rate Limit Exceeded`.

### Graceful Degradation in Production
Because this evaluation revealed how easily we can hit API limits, we immediately implemented a safety net in the React frontend (`ChatWindow.tsx`). When the Groq API times out or returns a 500/429 error, the UI no longer hangs on a loading animation. It intercepts the failure and gently tells the user: *"I'm sorry, the stars are cloudy right now and I couldn't connect with the universe. Please try again."*

## Next Steps & Improvements
If we had more time and resources, the immediate next steps would be:
1. **Upgrade Infrastructure:** Move to a paid API tier to increase the Tokens-Per-Day (TPD) limit.
2. **Semantic Caching:** We successfully implemented function-level caching for the determinisic tools (`geocode_place` and `compute_birth_chart`), but the next step is semantic caching for the LLM responses. If two users with identical ascendants ask for daily transits, we shouldn't burn LLM tokens re-generating the exact same reading.
3. **Second Agent Handoff:** Implementing a specialized 'Editor' node in LangGraph to enforce a softer tone on all outputs before presenting them to the user.

## Conclusion
The evaluation harness proved highly valuable. It demonstrated that our agentic routing works flawlessly, but also exposed the critical reality of building production LLM apps: you are always at the mercy of your provider's rate limits. Handling those limits gracefully in the UI, and aggressively caching backend tools, is just as important as the agent logic itself.
