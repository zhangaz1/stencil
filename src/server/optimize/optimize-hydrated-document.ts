import * as d from '@declarations';
import { catchError } from '@utils';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { optimizeStyles } from './optimize-styles';
import { relocateMetaCharset } from './relocate-meta-charset';
import { updateCanonicalLink } from './canonical-link';


export function optimizeHydratedDocument(opts: d.HydrateOptions, results: d.HydrateResults, windowLocationUrl: URL, doc: Document) {
  optimizeStyles(opts, results, doc);

  if (typeof opts.title === 'string') {
    try {
      doc.title = opts.title;
    } catch (e) {}
  }

  if (opts.removeScripts) {
    removeScripts(doc.documentElement);
  }

  if (opts.collapseWhitespace === true) {
    try {
      collapseHtmlWhitepace(doc.documentElement);
    } catch (e) {}
  }

  if (typeof opts.canonicalLink === 'string') {
    try {
      updateCanonicalLink(doc, opts.canonicalLink);
    } catch (e) {}
  }

  try {
    relocateMetaCharset(doc);
  } catch (e) {}

  if (typeof opts.afterHydrate === 'function') {
    try {
      opts.afterHydrate(doc as any, windowLocationUrl);
    } catch (e) {
      catchError(results.diagnostics, e);
    }
  }

  results.title = doc.title;
}


function removeScripts(elm: HTMLElement) {
  const children = elm.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    removeScripts(child as any);

    if (child.nodeName === 'SCRIPT') {
      child.remove();
    }
  }
}
