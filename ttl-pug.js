// ttl-pug.js 1.0
// Contributors - Indong Yoo, Hanah Choi
// (c) 2015-2018 Marpple. MIT Licensed.
var TAB, TAB_SIZE, REG1, REG2, REG3, REG4, REG5, REG6;
export function tab(size) {
  TAB_SIZE = size;
  TAB = "( {" + size + "}|\\t)";
  var TABS = TAB + "+";
  REG1 = new RegExp("^" + TABS);
  REG2 = {};
  REG3 = new RegExp("^(" + TABS + ")(\\[.*?\\]|\\{.*?\\}|\\S)+\\.(?!\\S)");
  REG4 = {};
  REG5 = new RegExp("\\n(" + TABS + "[\\s\\S]*)");
  REG6 = new RegExp("^" + TABS + "\\|");
}
tab(2);

export default function pug(strs, ...datas) {
  var lines = strs
    .reduce((a, b, i) => `${a}{{${i-1}}}${b}`)
    .split('\n')
    .filter(v => v);

  var tag_stack = [], btab = number_of_tab(lines[0]), is_paragraph = 0;

  for (var i = 0; i < lines.length; i++) {
    while (number_of_tab(lines[i]) - btab < tag_stack.length) {
      is_paragraph = 0;
      if (tag_stack.length == 0) break;
      lines[i - 1] += end_tag(tag_stack.pop());
    }
    var tmp = lines[i];
    if (!is_paragraph) {
      lines[i] = line(lines[i], tag_stack);
      if (tmp.match(REG3)) is_paragraph = number_of_tab(RegExp.$1) + 1;
      continue;
    }
    lines[i] = lines[i].replace(REG4[is_paragraph] || (REG4[is_paragraph] = new RegExp("(" + TAB + "{" + is_paragraph + "})", "g")), "\n");
    if (lines[i] !== (lines[i] = lines[i].replace(REG5, "\n"))) lines = push_in(lines, i + 1, RegExp.$1);
  }

  while (tag_stack.length) lines[lines.length - 1] += end_tag(tag_stack.pop());

  return datas.reduce(
    (res, data, i) => res.replace('{{'+i+'}}', array_to_str(data)),
    lines.join(""));
}

const array_to_str = str =>
  typeof str == 'function' ? str() : Array.isArray(str) ? str.join('') : str;

export function html(strs) {
  return strs.reduce((res, str, i) => res + array_to_str(arguments[i]) + str);
}

function number_of_tab(a) {
  var snt = a.match(REG1)[0];
  var tab_length = (snt.match(/\t/g) || []).length;
  var space_length = snt.replace(/\t/g, "").length;
  return space_length / TAB_SIZE + tab_length;
}
function line(source, tag_stack) {
  source = source.replace(REG6, "\n").replace(/^[ \t]*/, "");
  return source.match(/^[\[.#\w\-]/) ? source.replace(/^(\[.*\]|\{.*?\}|\S)+ ?/, function(str) {
    return start_tag(str, tag_stack);
  }) : source;
}
function push_in(ary, index, data) {
  var rest_ary = ary.splice(index);
  ary.push(data);
  return ary.concat(rest_ary);
}
function start_tag(str, tag_stack, attrs, name, cls) {
  attrs = '';
  name = str.match(/^\w+/);

  // name
  name = (!name || name == 'd') ? 'div' : name == 'sp' ? 'span' : name;
  if (name != 'input' && name != 'br' ) tag_stack.push(name);

  // attrs
  str = str.replace(/\[(.*)\]/, function(match, inner) { return (attrs += ' ' + inner) && ''; });

  // attrs = class + attrs
  (cls = map(str.match(/\.(\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); }).join(' '))
  && attrs == (attrs = attrs.replace(/class\s*=\s*((\").*?\"|(\{.*?\}|\S)+)/,
    function(match, tmp, q) { return ' class=' + '"' + cls + ' ' + (q ? tmp.slice(1, -1) : tmp) + '"'; }))
  && (attrs = ' class="' + cls + '"' + attrs);

  // attrs = id + attrs
  attrs = ['',
    ...(map(str.match(/#(\{\{.*?\}\}|[\w\-]+)/g), function(v) { return v.slice(1); }))
  ].join(' id=') + attrs;

  return '<' + name + attrs + ' >';
}
function end_tag(tag) { return '</' + tag + '>'; }


var escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' };
var unescapeMap = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#x60;': '`' };
var createEscaper = function(map) {
  var escaper = function(match) {
    return map[match];
  };
  var source = '(?:' + Object.keys(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function(string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
};

const escape = createEscaper(escapeMap);
const unescape = createEscaper(unescapeMap);

var ObjectValues = Object.values || function(list) {
  return Object.keys(list).map(key => list[key]);
};

export function values(list) {
  if (!list) return [];
  if (Array.isArray(list)) return list;
  if (typeof list[Symbol.iterator] == 'function') return [...list.values ? list.values() : list[Symbol.iterator]()];
  return list.length ? [...list] : ObjectValues(list);
}

export function map(list, mapper) {
  return values(list).map(mapper);
}

export function scat(list, mapper = v => v) {
  return values(list).reduce((a, b) => `${a}${mapper(b)}`, '');
}

export { escape, unescape };

export function el(html) {
  var els, tmp;
  if (/^<(tr|th|td).*><\/(tr|th|td)>$/.test(html)) {
    tmp = document.createElement('table');
    tmp.innerHTML = html;
    tmp = tmp.firstChild;
    if (RegExp.$1 != 'tr') tmp = tmp.firstChild;
  } else {
    tmp = document.createElement('div');
    tmp.innerHTML = html;
  }
  return (els = map(tmp.children, v => v)).length == 1 ? els[0] : els;
}

export function elpug() {
  return el(pug(...arguments));
}

export function elhtml() {
  return el(html(...arguments));
}