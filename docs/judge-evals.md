# Judge eval cases

Manual QA checklist for the Groq judge (`USE_MOCK_JUDGE=false`).

Canonical definitions live in `frontend/src/lib/judge/evalCases.ts`.

## How to run

1. Set `.env.local`:
   ```env
   USE_MOCK_JUDGE=false
   GROQ_API_KEY=...
   GROQ_MODEL=llama-3.3-70b-versatile
   ```
2. Restart the dev server.
3. Open the composer, paste each case text, click **Check now**.
4. Compare findings to the expected notes below.

Bump `JUDGE_PROMPT_VERSION` in `prompts.ts` when prompt behavior changes — server cache keys include it.

---

## Case 1: Ad hominem + unsupported collapse

**Text:**
> Everyone who supports remote work is just lazy. If companies don't force everyone back into the office, productivity will collapse and the economy will fall apart.

**Expected:**
- Ad hominem or personal-attack finding (fallacy or clarity — **not** claim-needs-evidence)
- Claim finding for productivity/economy collapse
- **2–3 findings max**

---

## Case 2: Empirical overclaim

**Text:**
> Studies prove congestion pricing always cuts emissions by 40% within one year.

**Expected:**
- **Claim** finding
- **1 finding** is enough

---

## Case 3: Cautious policy judgment

**Text:**
> Partial bans may work better than full bans if deliveries still need access.

**Expected:**
- **0 findings**, or at most one light **clarity** finding
- Must **not** be claim-needs-evidence

---

## Case 4: Loaded attribution

**Text:**
> Anyone who opposes this clearly doesn't care about pedestrians at all.

**Expected:**
- **Clarity** / loaded attribution / too absolute
- Must **not** be false dilemma

---

## Case 5: Irrelevant starter (context eval A)

**Motion:** Should cities ban cars from downtown areas?  
**Post type:** starter

**Text:**
> 99 + 1 can literally never be said to be 100

**Expected:**
- **Clarity** finding for unclear relevance to the motion
- Must **not** be claim or fallacy

---

## Case 6: Relevant conditional reply (context eval B)

**Motion:** Should cities ban cars from downtown areas?  
**Post type:** reply  
**Parent argument:** European cities reduced car access and became more walkable.

**Text:**
> That only works if transit is already good enough to replace car trips.

**Expected:**
- Relevant reply — **no** unclear-relevance (clarity) finding
- 0 findings is ideal in structured_debate; at most 1 in strict mode

---

## Case 7: Relevant factual starter (context eval C)

**Motion:** Should cities ban cars from downtown areas?  
**Post type:** starter

**Text:**
> Paris has expanded low-traffic and pedestrian-friendly zones in recent years.

**Expected:**
- Relevant to the motion — **no** unclear-relevance finding
- May return a **claim** finding asking for a source; that is acceptable

---

## Server cache verification

1. Paste Case 2 text, click **Check now** — Groq runs (watch server logs or network latency).
2. Click **Check now** again on the **same** text without editing.
3. Second call should be instant — served from server in-memory cache (frontend cache may also hit first).
4. Wait 20+ minutes or bump `JUDGE_PROMPT_VERSION` to force a fresh Groq call.
