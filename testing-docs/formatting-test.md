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