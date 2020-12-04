# Helix Pages

Welcome to Helix Pages!

To use it, change the current URL to `https://<repo>-<owner>.project-helix.page`.
`<owner>` and `<repo>` must refer to a valid Git repository.

Example: [https://helix-home-adobe.project-helix.page/README.html](https://helix-home-adobe.project-helix.page/README.html)

---

### Try it...
Simply paste a GitHub URL to a publicly visible Markdown file (`.md`) here...

<script>

function splitURL() {
    const giturl = document.getElementById('giturl').value;
    const resegs = /(?<!\?.+)(?<=\/)[\w-\.]+(?=[/\r\n?]|$)/g;
    const segments = [...giturl.matchAll(resegs)];
    const path = giturl.substr(segments[4].index + segments[4][0].length);
    return ({ "user": segments[1][0], "repo": segments[2][0], "branch": segments[4][0], "path": path});
}

function change() {
    const alertElem = document.getElementById('alert');
    const alert=checkURL();

    if (alert) {
        alertElem.innerHTML = alert;
        alertElem.style = '';
    }  else {
        alertElem.style = 'display: none';
    }
}

function checkURL() {
    let c;

    try {
        c = splitURL();
    } catch (e) {
        return ('URL needs be a valid GitHub URL');
    }
    
    if (!c.path.endsWith(`.md`)) return ('URL needs to end in \'.md\'');
    if (c.repo.indexOf('.')>=0) return('Repository name cannot contain a \'.\'');
    if (c.user.indexOf('.')>=0) return('User name cannot contain a \'.\'');
    if (c.branch.indexOf('.')>=0) return('Branch cannot contain a \'.\'');
}

function takeMeThere() {
    if (checkURL()) {
      return;
    }
    const c = splitURL();
    let separator = '-';

    const pathstub = c.path.substr(0, c.path.length - 3);
    if (c.user.indexOf('-') >= 0 || c.branch !== 'master') {
        separator = '--';
    }
    const branchprefix = (c.branch === 'master' ? '' : c.branch + separator);
    const url = `https://${branchprefix}${c.repo}${separator}${c.user}.hlx.page${pathstub}.html`;
    window.location = url;
}
</script>
<input onkeyup="change()" type="text" id="giturl" aria-label="Github URL" placeholder="GitHub URL"></input>
<span id="alert" class="alert" style="display:none"></span>
<button id="takemethere" onclick="takeMeThere()">Take Me There</button>

## For developers

- [Add an Atom feed to your site](docs/feed.md)
- [Add a Sitemap to your site](docs/sitemap.md)

## For authors

- [Add the Sidekick to your bookmark bar](tools/sidekick/)
