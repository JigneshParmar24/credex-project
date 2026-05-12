# Tests

## Automated Audit Engine Tests

### 1. Seat Waste Detection
- File: `server/tests/auditEngine.test.js`
- Verifies the engine detects wasted seats on plans with minimum seat requirements (e.g. Claude Team).

### 2. Plan Downgrade Detection
- File: `server/tests/auditEngine.test.js`
- Verifies the engine recommends cheaper plans when capability requirements are lower.

### 3. Optimal Spend Detection
- File: `server/tests/auditEngine.test.js`
- Ensures users already on appropriate plans are marked as optimized rather than forcing fake savings.

### 4. Annual Savings Calculation
- File: `server/tests/auditEngine.test.js`
- Confirms annual savings are correctly derived from monthly savings totals.

### 5. Wrong Tool Recommendation
- File: `server/tests/auditEngine.test.js`
- Verifies the engine flags unnecessarily expensive tools for a given workflow and suggests cheaper alternatives.

---

## How to Run

From the `/server` directory:

```bash
npm install
npm test
````

Uses:

* Vitest


---