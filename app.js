// app.js — modern tri-view with resilient DMN initialization
window.addEventListener('DOMContentLoaded', () => {
  (async function () {

    const $  = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    // --- Modelers (note constructors) --------------------------------------
    const cmmnModeler = new window.CmmnJS({ container: '#cmmn' });
    const bpmnModeler = new window.BpmnJS({ container: '#bpmn' });
   // DMN — pick constructor from the global namespace that exists on your page
    const DMNNS = window.dmn || window.DmnJS || window.DMNJS || window.DMN || {};
    //const DmnModelerCtor =
    //(typeof DMNNS === 'function' ? DMNNS : null) ||
    //(typeof DMNNS.Modeler === 'function' ? DMNNS.Modeler : null) ||
    //(typeof DMNNS.default === 'function' ? DMNNS.default : null);

if (!DmnModelerCtor) {
  console.error('DMN modeler constructor not found. Introspect:', { keys: Object.keys(DMNNS || {}) });
  alert('DMN modeler library not available (see console).');
  // return; // optionally bail out to avoid follow-on errors
}

const dmnModeler = new DmnModelerCtor({ container: '#dmn' });
// AFTER (robust across UMD variants)
function pickDmnModelerCtor() {
  const g =
    window.DmnJS   ||   // most common UMD global
    window.dmn     ||   // some bundles namespace as `dmn`
    window.DMNJS   ||   // rare
    window.DMN     ||   // rare
    window.dmnjs   ||   // very rare
    null;

  if (!g) return null;

  // cases:
  // 1) g is the constructor itself  -> typeof g === 'function'
  // 2) g is a namespace with .Modeler
  // 3) g is a namespace with .default (constructor on default export)
  if (typeof g === 'function') return g;
  if (typeof g.Modeler === 'function') return g.Modeler;
  if (typeof g.default === 'function') return g.default;

  return null;
}

const DmnModelerCtor = pickDmnModelerCtor();

if (!DmnModelerCtor) {
  console.error('DMN modeler constructor not found. Available DMN globals:', {
    DmnJS:   typeof window.DmnJS,
    dmn:     typeof window.dmn,
    DMNJS:   typeof window.DMNJS,
    DMN:     typeof window.DMN,
    dmnjs:   typeof window.dmnjs
  });
  alert('DMN modeler library not loaded (or unexpected global). See console for details.');
  // early return if you want to avoid cascading errors:
  // return;
}

// const dmnModeler = new DmnModelerCtor({ container: '#dmn' });


    // --- Tabs ---------------------------------------------------------------
    $$('.tab').forEach((tab) =>
      tab.addEventListener('click', () => {
        $$('.tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const tgt = tab.getAttribute('data-target');
        $$('.canvas').forEach((c) => c.classList.remove('active'));
        $('#canvas-' + tgt).classList.add('active');

        if (tgt === 'cmmn') cmmnModeler.get('canvas')?.zoom('fit-viewport');
        if (tgt === 'bpmn') bpmnModeler.get('canvas')?.zoom('fit-viewport');
        if (tgt === 'dmn')  getDmnCanvas()?.zoom('fit-viewport');
      })
    );

    // --- Utility: get active DMN canvas ------------------------------------
    function getDmnActiveViewer() {
      // In modeler, we still have "views"
      return dmnModeler.getActiveViewer?.();
    }
    function getDmnCanvas() {
      const av = getDmnActiveViewer();
      return av?.get('canvas');
    }

    // --- Props renderers ----------------------------------------------------
    function renderProps(root, entries) {
      root.classList.remove('empty');
      root.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.style.display = 'grid';
      wrap.style.gridTemplateColumns = '120px 1fr';
      wrap.style.gap = '6px 10px';

      (entries || []).forEach(([k, v]) => {
        const kd = document.createElement('div');
        kd.style.color = '#9aa2b6';
        kd.textContent = k;

        const vd = document.createElement('div');
        if (typeof v === 'string' && (v.startsWith('bpmn:') || v.startsWith('dmn:'))) {
          const a = document.createElement('a');
          a.href = '#';
          a.textContent = v;
          a.addEventListener('click', (ev) => {
            ev.preventDefault();
            if (v.startsWith('bpmn:')) {
              $('.tab[data-target="bpmn"]').click();
              focusBpmn(v.split(':')[1]);
            } else {
              $('.tab[data-target="dmn"]').click();
              focusDmn(v.split(':')[1]);
            }
          });
          vd.appendChild(a);
        } else {
          vd.innerHTML = `<code>${(v ?? '').toString()}</code>`;
        }
        wrap.appendChild(kd);
        wrap.appendChild(vd);
      });

      root.appendChild(wrap);
    }

    function wirePropsCMMN() {
      const bus = cmmnModeler.get('eventBus');
      bus.on('element.click', (e) => {
        const def = e.element?.businessObject?.definitionRef || e.element?.businessObject;
        const hints = (def?.extensionElements?.values || []).find((v) =>
          (v.$type || '').includes('uiHints')
        );
        const entries = [
          ['ID',   def?.id],
          ['Type', def?.$type],
          ['Name', def?.name],
        ];
        if (def?.processRef)  entries.push(['Process Ref',  def.processRef]);
        if (def?.decisionRef) entries.push(['Decision Ref', def.decisionRef]);
        if (hints) {
          entries.push(['Badge',   hints.badge || '']);
          entries.push(['Tooltip', hints.tooltip || '']);
        }
        renderProps($('#cmmn-props'), entries);
      });
    }

    function wirePropsBPMN() {
      const bus = bpmnModeler.get('eventBus');
      bus.on('element.click', (e) => {
        const bo = e.element?.businessObject;
        const entries = [
          ['ID',   bo?.id],
          ['Type', bo?.$type],
          ['Name', bo?.name],
        ];
        const jump = bo?.extensionElements?.values?.find((v) => v.$type?.includes('jump'));
        if (jump?.decisionRef) entries.push(['Decision Ref', jump.decisionRef]);
        renderProps($('#bpmn-props'), entries);
      });
    }

    function wirePropsDMN() {
      dmnModeler.on?.('views.changed', () => {
        const av = getDmnActiveViewer();
        const bus = av?.get('eventBus');
        if (!bus) return;
        bus.on('element.click', (e) => {
          const bo = e.element?.businessObject;
          const entries = [
            ['ID',   bo?.id],
            ['Type', bo?.$type],
            ['Name', bo?.name],
          ];
          renderProps($('#dmn-props'), entries);
        });
      });
    }

    // --- Focus helpers ------------------------------------------------------
    function focusBpmn(id) {
      const reg = bpmnModeler.get('elementRegistry');
      const el = reg.get(id);
      if (!el) return;
      const canvas = bpmnModeler.get('canvas');
      canvas.addMarker(el, 'marker-active');
      setTimeout(() => canvas.removeMarker(el, 'marker-active'), 1200);
      canvas.scrollToElement(el);
      canvas.zoom('fit-viewport');
    }

    async function focusDmn(id) {
      const view = await ensureDmnOpenView();
      if (!view) return;
      const av = getDmnActiveViewer();
      const reg = av.get('elementRegistry');
      const el  = reg.get(id);
      const canvas = av.get('canvas');
      if (el) {
        canvas.zoom('fit-viewport');
        canvas.scrollToElement(el);
      }
    }

    // --- DMN: robust view open in modeler ----------------------------------
    async function ensureDmnOpenView() {
      const current = dmnModeler.getActiveView?.();
      if (current) return current;

      let views = [];
      try {
        views = dmnModeler.getViews ? dmnModeler.getViews() : [];
      } catch (e) {
        views = [];
      }
      if (!views.length) {
        try { await dmnModeler.open(); } catch(e) { /* ignore */ }
        return dmnModeler.getActiveView?.() || null;
      }
      const preferredOrder = ['drd', 'decisionTable', 'literalExpression', 'context', 'relation'];
      const byType = Object.fromEntries(views.map(v => [v.type, v]));
      const chosen = preferredOrder.map(t => byType[t]).find(Boolean) || views[0];
      await dmnModeler.open(chosen);
      return dmnModeler.getActiveView?.() || null;
    }

    // --- Export / Import / Reset / Token -----------------------------------
    function download(name, text) {
      const blob = new Blob([text], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }

    $('#btn-export').addEventListener('click', async () => {
      const active = document.querySelector('.tab.active').dataset.target;
      try {
        if (active === 'cmmn') {
          const { xml } = await cmmnModeler.saveXML({ format: true });
          download('case.cmmn', xml);
        } else if (active === 'bpmn') {
          const { xml } = await bpmnModeler.saveXML({ format: true });
          download('process.bpmn', xml);
        } else {
          const res = await dmnModeler.saveXML({ format: true });
          const xml = res?.xml ?? res;
          download('policy.dmn', xml);
        }
      } catch (e) { console.error(e); alert('Export failed; see console.'); }
    });

    const fileInput = $('#file-input');
    async function handleImport(target) {
      fileInput.onchange = async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        const xml = await file.text();
        try {
          if (target === 'cmmn') {
            await cmmnModeler.importXML(xml);
            cmmnModeler.get('canvas').zoom('fit-viewport');
          } else if (target === 'bpmn') {
            await bpmnModeler.importXML(xml);
            bpmnModeler.get('canvas').zoom('fit-viewport');
          } else {
            await dmnModeler.importXML(xml);
            const view = await ensureDmnOpenView();
            view && getDmnCanvas()?.zoom('fit-viewport');
          }
        } catch (e) { console.error('Import error', e); alert('Import failed; see console.'); }
        fileInput.value = '';
      };
      fileInput.click();
    }
    $('#btn-import-cmmn').addEventListener('click', () => handleImport('cmmn'));
    $('#btn-import-bpmn').addEventListener('click', () => handleImport('bpmn'));
    $('#btn-import-dmn') .addEventListener('click', () => handleImport('dmn'));

    $('#btn-reset').addEventListener('click', () => {
      cmmnModeler.get('canvas')?.zoom('fit-viewport');
      bpmnModeler.get('canvas')?.zoom('fit-viewport');
      getDmnCanvas()?.zoom('fit-viewport');
    });

    // token animation on BPMN path
    $('#btn-token').addEventListener('click', async () => {
      const canvas = bpmnModeler.get('canvas');
      const reg    = bpmnModeler.get('elementRegistry');
      const path = ['StartEvent_1','Task_Read','UserTask_Findings','EndEvent_1']
        .map(id => reg.get(id))
        .filter(Boolean);

      const token = document.createElement('div');
      token.className = 'token';
      document.querySelector('.viewer#bpmn').appendChild(token);

      for (const el of path) {
        const gfx = bpmnModeler.get('graphicsFactory')._elementRegistry.getGraphics(el);
        const box = gfx.getBBox();
        token.style.left = (box.x + box.width/2) + 'px';
        token.style.top  = (box.y + box.height/2) + 'px';
        canvas.addMarker(el, 'marker-active');
        await new Promise(r => setTimeout(r, 700));
        canvas.removeMarker(el, 'marker-active');
        canvas.addMarker(el, 'marker-completed');
      }
      await new Promise(r => setTimeout(r, 900));
      token.remove();
      path.forEach(el => canvas.removeMarker(el, 'marker-completed'));
    });

    // --- Load initial models from /models ----------------------------------
    try {
      const [cmmnXML, bpmnXML, dmnXML] = await Promise.all([
        fetch('models/case.cmmn').then(r => r.text()),
        fetch('models/process.bpmn').then(r => r.text()),
        fetch('models/policy.dmn').then(r => r.text()),
      ]);

      await cmmnModeler.importXML(cmmnXML);
      cmmnModeler.get('canvas').zoom('fit-viewport');
      wirePropsCMMN();

      await bpmnModeler.importXML(bpmnXML);
      bpmnModeler.get('canvas').zoom('fit-viewport');
      wirePropsBPMN();

      await dmnModeler.importXML(dmnXML);
      const view = await ensureDmnOpenView();
      view && getDmnCanvas()?.zoom('fit-viewport');
      wirePropsDMN();

    } catch (err) {
      console.error('Import error', err);
      alert('Failed to load one of the models; see console.');
    }
  })();
});