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
    const url = `https://${branchprefix}${c.repo}${separator}${c.user}.project-helix.page${pathstub}.html`;
    window.location = url;
}
</script>
<input onkeyup="change()" type="text" id="giturl" aria-label="Github URL" placeholder="GitHub URL"></input>
<span id="alert" class="alert" style="display:none"></span>
<button id="takemethere" onclick="takeMeThere()">Take Me There</button>

## Do more

- [Add an Atom feed to your site](docs/feed.md)
- [Add a Sitemap to your site](docs/sitemap.md)

---
<hr>

# Style Testing

# H1
## H2
### H3
#### H4
##### H5
###### H6

# Designers create hierarchy and contrast by playing with the scale of letterforms. 
###### 10/10/2020
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor id eu nisl nunc mi. Dictum non consectetur a erat. Tristique senectus et netus et. Nec feugiat nisl pretium fusce id velit ut tortor pretium. Egestas sed sed risus pretium quam vulputate. Sed egestas egestas fringilla phasellus faucibus. Nullam vehicula ipsum a arcu cursus vitae. Arcu cursus euismod quis viverra nibh cras. Non tellus orci ac auctor augue. Montes nascetur ridiculus mus mauris vitae ultricies leo integer.

## Bulleted lists
After initial sketches and an evening of light exploration we a bit of informed direction:  
- Enough variance to be different but recognizable
- Neutral - Not intrusive visually to the canvas
- Modest / simple form with a lot of room to evolve and grow over time

Urna nunc id cursus metus aliquam eleifend mi. Arcu risus quis varius quam quisque id diam vel. Sapien et ligula ullamcorper malesuada. Ornare quam viverra orci sagittis eu volutpat odio facilisis. Eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Sit amet porttitor eget dolor morbi non arcu risus quis. Amet nisl purus in mollis nunc sed id semper. 

## Sections with blockquotes
Hac habitasse platea dictumst vestibulum rhoncus est. Viverra justo nec ultrices dui. Ac turpis egestas maecenas pharetra convallis posuere morbi leo. 

<blockquote>
Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque. Non consectetur a erat nam at lectus. Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Adipiscing elit duis tristique sollicitudin nibh sit.
</blockquote>       

`<Button variant='primary'>Beep</Button>`
`<Button variant='secondary'>Boop</Button>`
While this can be good for developer ergonomics, it flies in the face of tree-shakeability and code splitting. Styles that would have otherwise been scoped to the component's module are now globally available. For commonly used styles like typography, this can make more sense, but it still blurs the lines of where this sort of responsibility should lie.

This is what a longer code block looks like:

<pre>
// hover, focus, active states
  
  hoverColor: [ 
    theme.colors[0].text, 
    theme.colors[1].text 
  ],
  hoverBgColor: [ 
    theme.colors[0].bg, 
    theme.colors[0].bg 
  ],
  focusColor: [ 
    theme.colors[1].text, 
    theme.colors[1].bg 
  ],
  textTransform: ['uppercase', 'capitalized'],
  transitionProperty: ['opacity', 'color', 'background-color'],
  transitionDuration: ['.25s'],
  transitionTimingFunction: ['ease-out'],
}
</pre>