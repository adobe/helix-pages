# Helix Pages

Welcome to Helix Pages!

No sign-up: All you need is a public GitHub repository, then you can navigate to `https://<ref>--<repo>--<owner>.hlx.page`
(`<owner>`, `<repo>` and `<ref>` must refer to a valid GitHub repository).

Example: <https://main--helix-home--adobe.hlx.page/>

---

### Try it...
Simply paste a GitHub URL to a public repository here...

<script>

function splitURL() {
    const giturl = new URL(document.getElementById('giturl').value);
    const [user, repo, _, branch = 'main', ...psegs] = giturl.pathname.substring(1).split('/');
    const path = `/${psegs.join('/') || 'README'}`;
    return ({ user, repo, branch, path });
}

function change(evt) {
    if (evt.key === 'Enter') return takeMeThere();
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
    const separator = '--';
    const pathstub = c.path.substr(0, c.path.length - 3);
    const branchprefix = (c.branch === 'master' ? '' : c.branch + separator);
    const url = `https://${branchprefix}${c.repo}${separator}${c.user}.hlx.page${pathstub}`;
    window.open(url);
}
</script>
<input onkeyup="change(event)" type="text" id="giturl" aria-label="Github URL" placeholder="https://github.com/..."></input>
<span id="alert" class="alert" style="display:none"></span>
<button id="takemethere" onclick="takeMeThere()">Take me to my Helix Pages site!</button>

## For developers

- [Add an Atom feed to your site](docs/feed.md)
- [Add an Index to your site](https://main--helix-home--adobe.hlx.page/docs/setup-indexing.html)
- [Configure the Sidekick for your site](tools/sidekick/config.md)

## For authors

- [Add the Sidekick to your bookmark bar](tools/sidekick/)
