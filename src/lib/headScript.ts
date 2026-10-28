// Runs inline in <head> before first paint. Keys must match src/lib/stores/*. It only touches <html>
// (classes, data attributes, lang) so there is nothing to disagree with React about on <body>.
export const HEAD_SCRIPT = `(function(){var d=document.documentElement;try{
var t=localStorage.getItem('tw-theme');if(t==='light')d.classList.remove('dark');
if(localStorage.getItem('tw-psyclone')==='true')d.classList.add('psyclone');
d.dataset.trail=localStorage.getItem('tw-trail')==='false'?'off':'on';
d.dataset.toolbox=localStorage.getItem('tw-toolbox')==='true'?'on':'off';
var l=localStorage.getItem('tw-lang');if((l==='es'||l==='en')&&location.pathname.indexOf('/es/')<0)d.lang=l;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.motion='reduce';
if(matchMedia('(pointer: coarse)').matches)d.dataset.pointer='coarse';
}catch(e){}})()`;
