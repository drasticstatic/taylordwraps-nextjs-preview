// One place for the stacking order of every fixed layer. All of them are children of <body>;
// nothing ever puts a filter or transform on <body> or <html>, so position:fixed keeps meaning fixed.
export const Z = {
  glow: -10,
  content: 0,
  nav: 500,
  trail: 800,
  paint: 801,
  ticker: 850,
  toolbox: 860,
  toolCursor: 870,
  drawer: 900,
  modal: 950,
  toast: 9500,
  preloader: 10000,
} as const;
