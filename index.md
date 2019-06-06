# Helix Pages

Welcome to Helix Pages!

To use it, change the current URL to `https://<repo>-<owner>.project-helix.page`.
`<owner>` and `<repo>` must refer to a valid Git repository.

Example: [https://helix-home-adobe.project-helix.page/README.html](https://helix-home-adobe.project-helix.page/README.html)

---

### Try it...
Simply paste a GitHub URL to a publicly visible Markdown file (`.md`) here...

<script>
function takeMeThere() {
    const giturl = document.getElementById('giturl').value;
    const resegs = /(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g;
    const segments = [...giturl.matchAll(resegs)];
    const user = segments[0][0];
    const repo = segments[1][0];
    const branch = segments[3][0];
    let separator = '-';

    const path = giturl.substr(segments[3].index + branch.length, giturl.length - (segments[3].index + branch.length) - 3);
    if (user.indexOf('-') >= 0 || branch !== 'master') {
        separator = '--';
    }
    const branchprefix = (branch === 'master' ? '' : branch + separator);
    const url = `https://${branchprefix}${repo}${separator}${user}.project-helix.page${path}.html`;
    window.location = url;
}
</script>
<input type="text" id="giturl">
<button onclick="takeMeThere()">Take Me There</button>