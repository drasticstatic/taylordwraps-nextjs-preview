export interface ArrivalCard { icon: "SprayBottle" | "Path" | "Wrench" | "MapPin"; title: string; body: string }
// English is the key; Spanish lives in src/i18n/es.ts under the same strings.
export const ARRIVAL_CARDS: ArrivalCard[] = [
  { icon: "SprayBottle", title: "Before you arrive", body: "Wash the vehicle. No wax, no ceramic, no tire shine the week before. Bring the logo files you have, even if they’re rough; we build from there." },
  { icon: "Path", title: "The flow", body: "A call, a free quote, a design proof you approve before anything prints. Then we schedule the install. Nothing prints without your yes." },
  { icon: "Wrench", title: "Install day", body: "Drop it off in the morning. Full wraps take one to three days depending on the body. Fresh film cures 48 to 72 hours: no washing, no pressure, no highway speeds the first day." },
  { icon: "MapPin", title: "Find us", body: "126 Industrial Dr, Warminster, PA 18974. By appointment; call first. Street parking, roll-up doors, the dog will greet you." },
];
