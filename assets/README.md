# OutcomeAI — Modern Diagram Demo

A tiny, polished tri-view demo showing **CMMN (Case)**, **BPMN (Work)**, and **DMN (Policy)**:
- ✨ Modern CSS-only styling (no custom renderers needed)
- 🔗 Cross-links: CMMN `processTask` → BPMN, decision task → DMN; BPMN user task → DMN via extension
- 🎯 Property/artefact panel driven by clicks
- 🟢 Demo token animation across BPMN path
- ⬇️ Export XML for each diagram

## Run
```bash
python -m http.server 8000
# open http://localhost:8000/modernized-diagrams/
```
