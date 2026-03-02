# Privacy by Architecture

## Foundational Principle

> Privacy in AgentricAI-planner is not enforced by policy.
> It is enforced by **architecture**.

There is no privacy policy to read, no cookie banner to dismiss, no opt-out to configure. The system is **incapable** of violating the student's privacy because no mechanism exists to transmit, share, or expose their data.

---

## The Privacy Model

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      THE STUDENT'S WORLD                        │
│                     (Completely Private)                         │
│                                                                 │
│    ┌──────────────────────────────────────────────────────┐      │
│    │                                                      │      │
│    │  Every tap, every choice, every hesitation,          │      │
│    │  every success, every moment of struggle —           │      │
│    │  ALL processed exclusively by the onboard AI.        │      │
│    │                                                      │      │
│    │  This data is:                                       │      │
│    │  ✓ Encrypted by the Guardian agent                   │      │
│    │  ✓ Stored locally in IndexedDB                       │      │
│    │  ✓ Accessible ONLY to the AI agents                  │      │
│    │  ✓ NEVER transmitted to any external server          │      │
│    │  ✓ NEVER visible to caregivers in raw form           │      │
│    │  ✓ NEVER used for advertising                        │      │
│    │  ✓ NEVER used for financial gain                     │      │
│    │                                                      │      │
│    └──────────────────────────────────────────────────────┘      │
│                                                                 │
│    ┌──────────────────────────────────────────────────────┐      │
│    │                                                      │      │
│    │  THE CAREGIVER'S VIEW                                │      │
│    │  (AI-Filtered Summaries Only)                        │      │
│    │                                                      │      │
│    │  The caregiver receives:                             │      │
│    │  ✓ Engagement percentages                            │      │
│    │  ✓ Completion rates                                  │      │
│    │  ✓ Skill progress summaries                          │      │
│    │  ✓ AI-generated insights (breakthroughs, milestones) │      │
│    │  ✓ Curriculum framework status                       │      │
│    │                                                      │      │
│    │  The caregiver NEVER receives:                       │      │
│    │  ✗ Raw interaction timestamps                        │      │
│    │  ✗ Individual button presses or tap sequences        │      │
│    │  ✗ Canvas drawings or written text                   │      │
│    │  ✗ Real-time student screen view                     │      │
│    │  ✗ Audio recordings                                  │      │
│    │  ✗ Moment-by-moment behavioral data                  │      │
│    │                                                      │      │
│    └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why This Matters

For children on the autism spectrum — particularly those who are non-verbal — learning is deeply personal. Every interaction with a learning tool is an act of vulnerability. The child is trying, failing, succeeding, and growing in ways that are meaningful and private.

Traditional educational software treats student data as a commodity:
- It is transmitted to servers for "analytics"
- It is visible to teachers, administrators, and sometimes other students
- It is used to generate reports that quantify the child's worth
- It creates anxiety for both the child and the caregiver

**AgentricAI-planner rejects all of this.**

The learning journey is a safe, trusted space between the student and their AI companion. The AI acts as a **trusted filter** — it understands the raw data, learns from it, and translates it into meaningful summaries that caregivers need, without exposing the intimate details of the child's learning process.

---

## Technical Implementation

### Guardian Agent: The Wall

The Guardian agent is the enforcement mechanism. It has exactly 2 actions:

#### Action 1: Data Encryption

Every write operation to IndexedDB passes through the Guardian:

```
Raw Data → Guardian.encrypt() → Encrypted Blob → IndexedDB
```

The Guardian intercepts all `database.put()` calls and encrypts the data before it reaches persistent storage. This ensures that even if the device is compromised, the raw data is unreadable without the encryption context.

#### Action 2: Access Gating

Every read operation from IndexedDB is filtered by the Guardian:

```
IndexedDB → Guardian.decrypt() → Guardian.filterByRole(requester) → Filtered Data
```

When the Student View requests data, it receives the full decrypted data (because the student owns their data).

When the Caregiver View requests data, the Guardian filters out raw interaction data and returns only AI-generated summaries, aggregated metrics, and curriculum status.

### Guardian State: Always Monitoring

The Guardian agent NEVER enters `awaiting` or `engaged` state. Its state is permanently `monitoring`:

```typescript
// This is immutable in the codebase
if (agent.id === 'guardian') {
  return 'monitoring'; // Always. No exceptions.
}
```

This is enforced at multiple levels:
1. **Type system:** The `monitoring` state is reserved for Guardian
2. **State transitions:** `activateHive()` and `deactivateHive()` skip Guardian
3. **UI indicators:** Guardian always shows blue (monitoring) indicator
4. **Documentation:** Guardian's immutability is a stated constraint for contributors

---

## Data That Never Leaves the Device

| Data Type | Stored In | Accessible By | Transmitted Externally |
|-----------|-----------|---------------|----------------------|
| Student profile | IndexedDB `profiles` | All agents, caregiver (name/avatar only) | **Never** |
| Daily schedule | IndexedDB `sessions` | All agents, student view | **Never** |
| Interaction records | IndexedDB `interactions` | AI agents ONLY | **Never** |
| Canvas drawings | Not persisted | Displayed during task only | **Never** |
| Text input | Not persisted | Displayed during task only | **Never** |
| Speech audio | Not persisted | Browser Speech API only | **Never** |
| Engagement scores | IndexedDB `metrics` | AI agents, caregiver (aggregated) | **Never** |
| AI insights | IndexedDB `insights` | AI agents, caregiver | **Never** |
| Curriculum frameworks | IndexedDB `curriculum` | All agents, caregiver | **Never** |

### Special Note on Transient Data

Canvas drawings and text input during activities are **never persisted to any storage**. They exist only in browser memory during the activity and are discarded when the activity view closes. The AI may process them for feedback generation (via the local AgentricAI-IED-ollama instance), but the raw content is never saved.

---

## Network Boundary

```
┌─────────────────────────────────────────────┐
│              LOCAL DEVICE / NETWORK          │
│                                             │
│  ┌───────────────┐    ┌─────────────────┐   │
│  │  AgentricAI-  │    │  AgentricAI-    │   │
│  │  planner      │◄──►│  IED-ollama     │   │
│  │  (PWA)        │    │  (localhost)     │   │
│  └───────────────┘    └─────────────────┘   │
│                                             │
│  ALL communication stays within this box.   │
│                                             │
└─────────────────────────────────────────────┘
         │
         │  ✗ No outbound data connections
         │  ✗ No analytics endpoints
         │  ✗ No telemetry
         │  ✗ No CDN requests (single-file build)
         │  ✗ No advertisement networks
         │  ✗ No social media integrations
         │
         ▼
    ┌─────────┐
    │ INTERNET │  ← The application does not
    │          │     communicate with the internet
    └─────────┘     for ANY data operations.
```

The **only** network communication is between the PWA and the local AgentricAI-IED-ollama instance on `localhost:11434`. This is local loopback traffic that never leaves the device (or at most, stays within the local network if Ollama runs on a separate machine).

---

## Compliance Notes

While AgentricAI-planner is not a medical device and makes no medical claims, its privacy architecture naturally aligns with or exceeds the requirements of:

| Regulation | Alignment |
|-----------|-----------|
| **COPPA** (Children's Online Privacy Protection Act) | No personal information is collected, transmitted, or shared with third parties. No online collection occurs. |
| **FERPA** (Family Educational Rights and Privacy Act) | Educational records never leave the device. No "school official" access without physical device access. |
| **GDPR** (General Data Protection Regulation) | Data stays on-device. No data processor exists. No cross-border transfer. Right to erasure is trivial (clear IndexedDB). |
| **HIPAA** (Health Insurance Portability and Accountability Act) | If biometric data integration is added in the future, the on-device-only architecture ensures no PHI transmission. |

---

## For Contributors

**The privacy architecture is non-negotiable.** Any contribution that introduces:

- External data transmission
- Third-party analytics or tracking
- Server-side data storage
- Remote logging or telemetry
- Advertisement or monetization tracking
- Weakening of Guardian's monitoring state

**will be rejected.**

The child's safety and privacy are the absolute highest priority. There are no exceptions.
