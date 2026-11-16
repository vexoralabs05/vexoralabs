(() => {
  const $ = id => document.getElementById(id);
  const copyText = async text => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const temp = document.createElement('textarea'); temp.value = text;
      document.body.appendChild(temp); temp.select();
      const ok = document.execCommand('copy'); temp.remove(); return ok;
    }
  };
  document.querySelectorAll('[data-copy-target]').forEach(btn => btn.addEventListener('click', async () => {
    const target = $(btn.dataset.copyTarget);
    if (!target) return;
    const value = 'value' in target ? target.value : target.textContent;
    const ok = await copyText(value);
    btn.textContent = ok ? 'Copied!' : 'Copy failed';
    setTimeout(() => btn.textContent = btn.dataset.label || 'Copy', 1400);
  }));

  const length = $('passwordLength'), lengthValue = $('lengthValue');
  if (length && lengthValue) length.addEventListener('input', () => lengthValue.textContent = length.value);
  const generate = $('generatePassword');
  if (generate) generate.addEventListener('click', () => {
    const sets = [];
    if ($('lowercase').checked) sets.push('abcdefghijklmnopqrstuvwxyz');
    if ($('uppercase').checked) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if ($('numbers').checked) sets.push('0123456789');
    if ($('symbols').checked) sets.push('!@#$%^&*()-_=+[]{};:,.?');
    const output = $('passwordOutput');
    if (!sets.length) { output.value = ''; $('passwordMessage').textContent = 'Select at least one character set.'; return; }
    const size = Number(length.value);
    if (size < sets.length) { $('passwordMessage').textContent = 'Increase length to fit every selected character set.'; return; }
    const alphabet = sets.join('');
    const randomIndex = max => {
      const limit = Math.floor(256 / max) * max;
      const bytes = new Uint8Array(1);
      let n; do { crypto.getRandomValues(bytes); n = bytes[0]; } while (n >= limit);
      return n % max;
    };
    const chars = sets.map(set => set[randomIndex(set.length)]);
    while (chars.length < size) chars.push(alphabet[randomIndex(alphabet.length)]);
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomIndex(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    output.value = chars.join(''); $('passwordMessage').textContent = 'Password generated locally in your browser.';
  });

  const textInput = $('textInput');
  if (textInput) {
    const update = () => {
      const value = textInput.value;
      $('wordCount').textContent = (value.trim().match(/\S+/g) || []).length;
      $('charCount').textContent = value.length;
      $('noSpaceCount').textContent = value.replace(/\s/g, '').length;
      $('lineCount').textContent = value.length ? value.split(/\r\n|\r|\n/).length : 0;
    };
    textInput.addEventListener('input', update); update();
  }

  const caseInput = $('caseInput'), caseOutput = $('caseOutput');
  if (caseInput && caseOutput) {
    const convert = mode => {
      const text = caseInput.value;
      const title = text.toLowerCase().replace(/\b([a-z])/g, c => c.toUpperCase());
      const sentence = text.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, c => c.toUpperCase());
      caseOutput.value = ({ upper: text.toUpperCase(), lower: text.toLowerCase(), title, sentence })[mode];
    };
    document.querySelectorAll('[data-case]').forEach(btn => btn.addEventListener('click', () => convert(btn.dataset.case)));
  }

  const urlInput = $('urlInput'), urlOutput = $('urlOutput');
  if (urlInput && urlOutput) {
    $('encodeUrl').addEventListener('click', () => {
      try { urlOutput.value = encodeURIComponent(urlInput.value); $('urlMessage').textContent = 'Encoded successfully.'; }
      catch { $('urlMessage').textContent = 'Could not encode this input.'; }
    });
    $('decodeUrl').addEventListener('click', () => {
      try { urlOutput.value = decodeURIComponent(urlInput.value); $('urlMessage').textContent = 'Decoded successfully.'; }
      catch { urlOutput.value = ''; $('urlMessage').textContent = 'Invalid encoded URL component.'; }
    });
    $('clearUrl').addEventListener('click', () => { urlInput.value = ''; urlOutput.value = ''; $('urlMessage').textContent = ''; });
  }
})();