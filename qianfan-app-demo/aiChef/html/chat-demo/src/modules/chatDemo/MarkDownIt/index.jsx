import Prism from 'prismjs';
import MarkdownIt from 'markdown-it';
import MarkdownItKatex from 'markdown-it-katex';
// import 'katex/dist/katex.min.css';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-c';
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-json";
import './prism.css'
import './index.less'


const highlight = (str, lang) => {
  if (!Prism.languages[lang]) {
    lang = 'js';
  }
  let code = Prism.highlight(str, Prism.languages[lang], lang);
  return `<pre class="language-` + lang + `"><code>${code}</code></pre>`
}

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
}).use(MarkdownItKatex);
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const hrefAttr = tokens[idx].attrGet('href');

  if (/^https?/.test(hrefAttr)) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  }

  return defaultRender(tokens, idx, options, env, self);
};

export default md