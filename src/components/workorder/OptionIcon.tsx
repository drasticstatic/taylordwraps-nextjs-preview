import { Van, Truck, CarProfile, ForkKnife, Boat, TrainRegional, Toolbox, PaintBrushBroad, Rainbow, Wrench, PencilLine, Waves, Lightning, Sparkle, MoonStars, Butterfly, DiscoBall, Compass } from "@phosphor-icons/react";
import type { IconName } from "@/data/workorder";
const MAP = { Van, Truck, CarProfile, ForkKnife, Boat, TrainRegional, Toolbox, PaintBrushBroad, Rainbow, Wrench, PencilLine, Waves, Lightning, Sparkle, MoonStars, Butterfly, DiscoBall, Compass };
export function OptionIcon({ name, size = 26 }: { name: IconName; size?: number }) { const C = MAP[name]; return <C size={size} weight="duotone" />; }
