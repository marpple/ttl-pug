# ttl-pug
ES6 tagged template literals like Pug

## Getting Started

### 1. plain
```javascript
import pug, {html, escape, unescape, map, scat, el, elpug, elhtml} from '/ttl-pug/ttl-pug.js';

const links = [
  { name: 'MARPPLE', url: 'https://marpple.com', is_app: true },
  { name: 'abym', url: 'https://abym.co.kr', is_app: true },
  { name: 'blog', url: 'https://marpple.github.io' },
  { name: 'GitHub', url: 'https://github.com/marpple' }
];

let demo1 = document.createElement('div');
demo1.setAttribute('id', 'demo1');
demo1.innerHTML = `
  <h1>1: Link</h1>
  <ul class="list">
    ${links.map(link =>
      `<li><a href="${link.url}">${link.name}</a></li>`
    ).join('')}
  </ul>
`;
document.querySelector('#content').appendChild(demo1);
```

```html
<div id="demo1">
  <h1>1: Link</h1>
  <ul class="list">
    <li><a href="https://marpple.com">MARPPLE</a></li>
    <li><a href="https://abym.co.kr">abym</a></li>
    <li><a href="https://marpple.github.io">blog</a></li>
    <li><a href="https://github.com/marpple">GitHub</a></li>
  </ul>
</div>
```

### 2. with html
```javascript
let demo2 = document.createElement('div');
demo2.setAttribute('id', 'demo2');
demo2.innerHTML = html`
  <h1>2: Link</h1>
  <ul class="list">
    ${links.map(link =>
      `<li><a href="${link.url}">${link.name}</a></li>`
    )}
  </ul>
`;
document.querySelector('#content').appendChild(demo2);
```

```html
<div id="demo2">
  <h1>2: Link</h1>
  <ul class="list">
    <li><a href="https://marpple.com">MARPPLE</a></li>
    <li><a href="https://abym.co.kr">abym</a></li>
    <li><a href="https://marpple.github.io">blog</a></li>
    <li><a href="https://github.com/marpple">GitHub</a></li>
  </ul>
</div>
```

### 3. html, el
```javascript
var str = html`
  <div id="demo3">
    <h1>3: Link</h1>
    <ul class="list">
      ${links.map(link =>
        `<li><a href="${link.url}">${link.name}</a></li>`
      )}
    </ul>
  </div>
`;
var element = el(str);
document.querySelector('#content').appendChild(element);
```

```html
<div id="demo3">
  <h1>3: Link</h1>
  <ul class="list">
    <li><a href="https://marpple.com">MARPPLE</a></li>
    <li><a href="https://abym.co.kr">abym</a></li>
    <li><a href="https://marpple.github.io">blog</a></li>
    <li><a href="https://github.com/marpple">GitHub</a></li>
  </ul>
</div>
```

### 4. elhtml
```javascript
document
  .querySelector('#content')
  .appendChild(elhtml`
    <div id="demo4">
      <h1>4: Link</h1>
      <ul class="list">
        ${links.map(link =>
          `<li><a href="${link.url}">${link.name}</a></li>`
        )}
      </ul>
    </div>
  `);
```

```html
<div id="demo4">
  <h1>4: Link</h1>
  <ul class="list">
    <li><a href="https://marpple.com">MARPPLE</a></li>
    <li><a href="https://abym.co.kr">abym</a></li>
    <li><a href="https://marpple.github.io">blog</a></li>
    <li><a href="https://github.com/marpple">GitHub</a></li>
  </ul>
</div>
```

### 5. pug, el
```javascript
var str = pug`
  #demo5
    h1 5: Link
    ul.list
      ${links.map(link => pug`
        li
          a[href="${link.url}"] ${link.name}`
      )}
`;
var element = el(str);
document.querySelector('#content').appendChild(element);
```

```html
<div id="demo5"><h1>5: Link</h1>
  <ul class="list">
    <li><a href="https://marpple.com">MARPPLE</a></li>
    <li><a href="https://abym.co.kr">abym</a></li>
    <li><a href="https://marpple.github.io">blog</a></li>
    <li><a href="https://github.com/marpple">GitHub</a></li>
  </ul>
</div>
```

### 6. elpug
```javascript
document
  .querySelector('#content')
  .appendChild(elpug`
    #demo6
      h1 6: Link
      ul.list
        ${links
          .filter(link => link.is_app)
          .map(link => pug`
            li
              a[href="${link.url}"] ${link.name}`
        )}
  `);
```


```html
<div id="demo6"><h1>6: Link</h1>
  <ul class="list">
    <li><a href="https://marpple.com">MARPPLE</a></li>
    <li><a href="https://abym.co.kr">abym</a></li>
  </ul>
</div>
```

### 7. elpug, map(support array, array-like, Object, Set, Map, typeof list[Symbol.iterator] == 'function')
```javascript
var links2 = new Set(links);
document
  .querySelector('#content')
  .appendChild(elpug`
    #demo7
      h1 7: Link
      ul.list
        ${map(links2, link => pug`
          li
            a[href="${link.url}"] ${link.name}`
        )}
  `);
```

```html
<div id="demo7"><h1>7: Link</h1>
  <ul class="list">
    <li><a href="https://marpple.com">MARPPLE</a></li>
    <li><a href="https://abym.co.kr">abym</a></li>
    <li><a href="https://marpple.github.io">blog</a></li>
    <li><a href="https://github.com/marpple">GitHub</a></li>
  </ul>
</div>
```

8. plain, el, scat(support array, array-like, Object, Set, Map, typeof list[Symbol.iterator] == 'function')
```javascript
var links3 = {
  MARPPLE: { name: 'MARPPLE', url: 'https://marpple.com', is_app: true },
  abym: { name: 'abym', url: 'https://abym.co.kr', is_app: true },
  blog: { name: 'blog', url: 'https://marpple.github.io' },
  GitHub: { name: 'GitHub', url: 'https://github.com/marpple' }
};
document
  .querySelector('#content')
  .appendChild(el(`
    <div id="demo8">
      <h1>8: Link</h1>
      <ul class="list">
        ${scat(links3, link =>
          `<li><a href="${link.url}">${link.name}</a></li>`
        )}
      </ul>
    </div>
  `));
```

```html
<div id="demo8">
  <h1>8: Link</h1>
  <ul class="list">
    <li><a href="https://marpple.com">MARPPLE</a></li>
    <li><a href="https://abym.co.kr">abym</a></li>
    <li><a href="https://marpple.github.io">blog</a></li>
    <li><a href="https://github.com/marpple">GitHub</a></li>
  </ul>
</div>
```

### 9. escape, unescape
```javascript
var str = '<ul class="test"><li>hi</li></ul>';
document
  .querySelector('#content')
  .appendChild(el(`
    <div id="demo9">
      <h1>9: escape, unescape</h1>
      <div>${escape(str)}</div>
      <div>${unescape(escape(str))}</div>
    </div>
  `));
```

```html
<div id="demo9">
  <h1>9: escape, unescape</h1>
  <div>&lt;ul class="test"&gt;&lt;li&gt;hi&lt;/li&gt;&lt;/ul&gt;</div>
  <div>
    <ul class="test">
      <li>hi</li>
    </ul>
  </div>
</div>
```
