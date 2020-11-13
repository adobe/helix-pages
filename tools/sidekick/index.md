# Helix Sidekick Bookmarklet

---
id: form
---

<label for="giturl">Repository URL:</label>
<input id="giturl" placeholder="https://github.com/....">
<label for="host">Production Hostname (optional): </label>
<input id="host">
<label for="project">Project Name (optional): </label>
<input id="project">
<!-- <input type="hidden" id="title"> -->
<br>
<button onclick="run()">Generate Bookmarklet</button>

---
id: book
style: display:none
---

Drag the Helix logo below to your browser's bookmark bar, or <a href="#" onclick="copy()">copy</a> its <b>Link Address</b> to add the bookmarklet manually.

<a id="bookmark" title="Sidekick" href="">Sidekick</a>

<style>
#copy {
  width: unset;
  display: inline;
}
#bookmark {
  color: transparent;
  margin: 40px auto;
  display: block;
  width: 100px;
  height: 100px;
  background-image: url("/default-meta-image.png");
  background-repeat: no-repeat;
  background-color: var(--background-color);
  background-size: auto 180px;
  background-position: -14px;
  border-radius: 50px;
}
</style>

<script>
  function copy() {
    const text = document.getElementById('bookmark').href;
    navigator.clipboard.writeText(text);
  }

  function run() {
    let giturl = document.getElementById('giturl').value;
    const host = document.getElementById('host').value;
    // const title = document.getElementById('title').value;
    const project = document.getElementById('project').value;
    if (!giturl) {
      alert('Repository URL is mandatory.');
      return;
    }
    giturl = new URL(giturl);
    const segs = giturl.pathname.substring(1).split('/');
    const owner = segs[0];
    const repo = segs[1];
    const ref = segs[3] || 'master';

    const config = {
      project,
      host,
      owner,
      repo,
      ref,
    };

    const bm=document.getElementById('bookmark');
    bm.href = [
      'javascript:',
      '/* ** Helix Sidekick Bookmarklet ** */',
      '(() => {if(!window.sidekick){',
        `window.sidekickConfig=${JSON.stringify(config)};`,
        'document.head.appendChild(document.createElement("script")).src="https://www.project-helix.io/bookmarklets/sidekick.js";',
      '}else{window.sidekick.toggle();}',
      '})();',
    ].join('');
    if (project) {
      bm.setAttribute('title', `${project} ${bm.getAttribute('title')}`);
    }
    document.getElementById('book').style.display = 'block';
  }

  function init() {
    let autorun = false;
    new URLSearchParams(window.location.search).forEach((v,k) => {
      const field = document.getElementById(k);
      if (!field) return;
      field.value = v;
      autorun = true;
    });
    if (autorun) {
      document.getElementById('form').style.display = 'none';
      run();
    }
  }

  init();
</script>
