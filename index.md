# Helix Pages

Welcome to Helix Pages!

To use it, change the current url to `https://<repo>-<owner>.project-helix.page`.
`<owner>` and `<repo>` must refer to a valid Git repository.

Example: [https://helix-test-davidnuescheler.project-helix.page/](https://helix-test-davidnuescheler.project-helix.page/)

---

### Try it...
Simply Paste a github URL to a publicly visible Markdown file (`.md`) here... 

<script>
function takeMeThere() {
    let giturl=document.getElementById('giturl').value;
    let resegs=/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g;
    let segments = [...giturl.matchAll(resegs)];
    let separator = '-';
    const user = segments[0][0];
    const repo = segments[1][0];
    const branch = segments[3][0];
    console.log (segments);
    const path = giturl.substr(segments[3].index+branch.length, giturl.length - (segments[3].index+branch.length) - 3);
    if (user.indexOf('-')>=0 || branch!='master') {
        separator = '--';
    }
    const branchprefix=(branch=='master'?"":branch+separator);
    const url=`https://${branchprefix}${repo}${separator}${user}.project-helix.page${path}.html`;
    window.location=url;

    
}
</script>
<input type="text" id="giturl">
<button onclick="takeMeThere()">Take Me There</button>

