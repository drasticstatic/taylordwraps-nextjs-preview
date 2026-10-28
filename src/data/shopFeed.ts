// The culture layer. No invented engagement numbers; the real feed lives on the shop's own accounts.
export interface Post { id: string; kind: "story" | "reel" | "throwback" | "note"; title: string; body: string; icon: "Dog" | "TShirt" | "Timer" | "Wrench" }
export const SHOP_FEED: Post[] = [
  { id: "qc", kind: "story", title: "Quality control", body: "The shop dog signs off on every install. No bubbles, no treats withheld.", icon: "Dog" },
  { id: "pink", kind: "throwback", title: "No pink.", body: "The hoodie said it in 2019 and sold out by DM. The rule has exactly one exception, and you have to ask.", icon: "TShirt" },
  { id: "forty", kind: "reel", title: "Forty hours in forty seconds", body: "A 36-foot trailer, every rivet relieved, compressed into one timelapse the crew still rewatches.", icon: "Timer" },
  { id: "edges", kind: "note", title: "Post-heat every edge", body: "The difference between a wrap that lasts and a wrap that lifts is the last twenty minutes with the heat gun.", icon: "Wrench" },
];
