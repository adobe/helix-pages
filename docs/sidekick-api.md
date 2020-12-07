## Classes

<dl>
<dt><a href="#Sidekick">Sidekick</a></dt>
<dd><p>The sidekick provides helper tools for authors.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#elemAttr">elemAttr</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>The name and value of the attribute to set on an element.</p>
</dd>
<dt><a href="#elemLstnr">elemLstnr</a> : <code>Object.&lt;string, function()&gt;</code></dt>
<dd><p>The event name and listener to register on an element.</p>
</dd>
<dt><a href="#elemConfig">elemConfig</a> : <code>Object</code></dt>
<dd><p>The configuration of an element to add.</p>
</dd>
<dt><a href="#pluginButton">pluginButton</a> : <code>Object</code></dt>
<dd><p>The configuration for a plugin button. This can be used as
a shorthand for <a href="#elemConfig">elemConfig</a>.</p>
</dd>
<dt><a href="#plugin">plugin</a> : <code>Object</code></dt>
<dd><p>The plugin configuration.</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_window.hlx.sidekickConfig">window.hlx.sidekickConfig</a> : <code>Object</code></dt>
<dd><p>The sidekick configuration needs to be defined in this global variable
before creating the <a href="#Sidekick">Sidekick</a> and will be deleted after consumption.</p>
</dd>
<dt><a href="#external_window.hlx.sidekick">window.hlx.sidekick</a> : <code><a href="#Sidekick">Sidekick</a></code></dt>
<dd><p>The global variable referencing the <a href="#Sidekick">Sidekick</a> singleton.</p>
</dd>
</dl>

<a name="Sidekick"></a>

## Sidekick
The sidekick provides helper tools for authors.

**Kind**: global class  

* [Sidekick](#Sidekick)
    * [new Sidekick()](#new_Sidekick_new)
    * [.toggle()](#Sidekick+toggle) ⇒ [<code>Sidekick</code>](#Sidekick)
    * [.add(plugin)](#Sidekick+add) ⇒ <code>HTMLElement</code>
    * [.get(id)](#Sidekick+get) ⇒ <code>HTMLElement</code>
    * [.remove(id)](#Sidekick+remove) ⇒ [<code>Sidekick</code>](#Sidekick)
    * [.isEditor()](#Sidekick+isEditor) ⇒ <code>boolean</code>
    * [.isHelix()](#Sidekick+isHelix) ⇒ <code>boolean</code>
    * [.notify(msg, level)](#Sidekick+notify)
    * [.showModal(msg, sticky, level)](#Sidekick+showModal) ⇒ [<code>Sidekick</code>](#Sidekick)
    * [.hideModal()](#Sidekick+hideModal) ⇒ [<code>Sidekick</code>](#Sidekick)
    * [.loadCSS(path)](#Sidekick+loadCSS) ⇒ [<code>Sidekick</code>](#Sidekick)

<a name="new_Sidekick_new"></a>

### new Sidekick()
Creates a new sidekick based on a configuration object in
[window.hlx.sidekickConfig](window.hlx.sidekickConfig).

<a name="Sidekick+toggle"></a>

### sidekick.toggle() ⇒ [<code>Sidekick</code>](#Sidekick)
Shows/hides the sidekick.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: [<code>Sidekick</code>](#Sidekick) - The sidekick  
<a name="Sidekick+add"></a>

### sidekick.add(plugin) ⇒ <code>HTMLElement</code>
Adds a plugin to the sidekick.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: <code>HTMLElement</code> - The plugin  

| Param | Type | Description |
| --- | --- | --- |
| plugin | [<code>plugin</code>](#plugin) | The plugin configuration. |

<a name="Sidekick+get"></a>

### sidekick.get(id) ⇒ <code>HTMLElement</code>
Returns the sidekick plugin with the specified ID.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: <code>HTMLElement</code> - The plugin  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The plugin ID |

<a name="Sidekick+remove"></a>

### sidekick.remove(id) ⇒ [<code>Sidekick</code>](#Sidekick)
Removes the plugin with the specified ID from the sidekick.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: [<code>Sidekick</code>](#Sidekick) - The sidekick  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The plugin ID |

<a name="Sidekick+isEditor"></a>

### sidekick.isEditor() ⇒ <code>boolean</code>
Checks if the current location is an editor URL (SharePoint or Google Docs).

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: <code>boolean</code> - <code>true</code> if editor URL, else <code>false</code>  
<a name="Sidekick+isHelix"></a>

### sidekick.isHelix() ⇒ <code>boolean</code>
Checks if the current location is a configured Helix URL.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: <code>boolean</code> - <code>true</code> if Helix URL, else <code>false</code>  
<a name="Sidekick+notify"></a>

### sidekick.notify(msg, level)
Displays a non-sticky notification.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msg | <code>string</code> \| <code>Array.&lt;string&gt;</code> |  | The message (lines) to display |
| level | <code>number</code> | <code>2</code> | error (0), warning (1), of info (2) |

<a name="Sidekick+showModal"></a>

### sidekick.showModal(msg, sticky, level) ⇒ [<code>Sidekick</code>](#Sidekick)
Displays a modal notification.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: [<code>Sidekick</code>](#Sidekick) - The sidekick  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msg | <code>string</code> \| <code>Array.&lt;string&gt;</code> |  | The message (lines) to display |
| sticky | <code>boolean</code> | <code>false</code> | <code>true</code> if message should be sticky (optional) |
| level | <code>number</code> | <code>2</code> | error (0), warning (1), of info (2) |

<a name="Sidekick+hideModal"></a>

### sidekick.hideModal() ⇒ [<code>Sidekick</code>](#Sidekick)
Hides the modal if shown.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: [<code>Sidekick</code>](#Sidekick) - The sidekick  
<a name="Sidekick+loadCSS"></a>

### sidekick.loadCSS(path) ⇒ [<code>Sidekick</code>](#Sidekick)
Loads the specified default CSS file, or a sibling of the
current JS or HTML file. E.g. when called without argument from
/foo/bar.js, it will attempt to load /foo/bar.css.

**Kind**: instance method of [<code>Sidekick</code>](#Sidekick)  
**Returns**: [<code>Sidekick</code>](#Sidekick) - The sidekick  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to the CSS file (optional) |

<a name="elemAttr"></a>

## elemAttr : <code>Object.&lt;string, string&gt;</code>
The name and value of the attribute to set on an element.

**Kind**: global typedef  
<a name="elemLstnr"></a>

## elemLstnr : <code>Object.&lt;string, function()&gt;</code>
The event name and listener to register on an element.

**Kind**: global typedef  
<a name="elemConfig"></a>

## elemConfig : <code>Object</code>
The configuration of an element to add.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag name (mandatory) |
| text | <code>string</code> | The text content (optional) |
| attrs | [<code>Array.&lt;elemAttr&gt;</code>](#elemAttr) | The attributes (optional) |
| lstnrs | [<code>Array.&lt;elemLstnr&gt;</code>](#elemLstnr) | The event listeners (optional) |

<a name="pluginButton"></a>

## pluginButton : <code>Object</code>
The configuration for a plugin button. This can be used as
a shorthand for [elemConfig](#elemConfig).

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The button text |
| action | <code>function</code> | The click listener |

<a name="plugin"></a>

## plugin : <code>Object</code>
The plugin configuration.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The plugin ID (mandatory) |
| button | [<code>pluginButton</code>](#pluginButton) |  | A button configuration object (optional) |
| override | <code>boolean</code> | <code>false</code> | True to replace an existing plugin (optional) |
| elements | [<code>Array.&lt;elemConfig&gt;</code>](#elemConfig) |  | An array of elements to add (optional) |
| condition | <code>function</code> |  | Determines whether to show this plugin (optional). This function is expected to return a boolean when called with the sidekick as argument. |
| callback | <code>function</code> |  | A function called after adding the plugin (optional). This function is called with the sidekick and the newly added plugin as arguments. |

<a name="external_window.hlx.sidekickConfig"></a>

## window.hlx.sidekickConfig : <code>Object</code>
The sidekick configuration needs to be defined in this global variable
before creating the [Sidekick](#Sidekick) and will be deleted after consumption.

**Kind**: global external  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| owner | <code>string</code> |  | The GitHub owner or organization (mandatory) |
| repo | <code>string</code> |  | The GitHub owner or organization (mandatory) |
| ref | <code>string</code> | <code>&quot;main&quot;</code> | The Git reference or branch (optional) |
| host | <code>string</code> |  | The production host name (optional) |
| project | <code>string</code> |  | The name of the Helix project (optional) |

<a name="external_window.hlx.sidekick"></a>

## window.hlx.sidekick : [<code>Sidekick</code>](#Sidekick)
The global variable referencing the [Sidekick](#Sidekick) singleton.

**Kind**: global external  
