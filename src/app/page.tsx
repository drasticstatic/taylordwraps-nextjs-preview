import { LEVELS } from "@/data/levels";
import { HeroSection } from "@/components/hero/HeroSection";
import { Manifesto } from "@/components/manifesto/Manifesto";
import { Visualizer } from "@/components/visualizer/Visualizer";
import { Receipts } from "@/components/receipts/Receipts";
import { WorkOrder } from "@/components/workorder/WorkOrder";
import { ShopFeed } from "@/components/shop/ShopFeed";
import { Lab } from "@/components/lab/Lab";
import { ArrivalKit } from "@/components/arrival/ArrivalKit";

// THE HOLE. One long descent; each <Level> is a floor the depth meter counts. Sections arrive floor by floor;
// a floor that is still bare metal says so instead of pretending.
export default function Home() {
  const by = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
  return (
    <>
      <HeroSection level={by.hero} />
      <Manifesto level={by.manifesto} />
      <Receipts level={by.receipts} />
      <Visualizer level={by.visualizer} />
      <WorkOrder level={by.quote} />
      <ShopFeed level={by.shop} />
      <Lab level={by.lab} />
      <ArrivalKit level={by.arrival} />
    </>
  );
}
