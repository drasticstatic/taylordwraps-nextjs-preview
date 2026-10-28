"use client";
import type { Level as LevelT } from "@/data/levels";
import { Level } from "@/components/chrome/Level";
import { WrapStage } from "./WrapStage";
import { BodyPicker, FilmSwatches, FinishPicker, LetteringInput } from "./Pickers";
import { BuildActions } from "./BuildActions";
import { MomMethodModal } from "./MomMethodModal";
import { useBuildLink } from "./useBuildLink";
import { compliance } from "@/data/business";

/** The booth. Pick a body, a film, a finish; type and drag your lettering; or bring your own ride. */
export function Visualizer({ level }: { level: LevelT }) {
  useBuildLink();
  return (
    <Level level={level}>
      <p className="lede -mt-2 mb-8">Mowers, toolboxes, RC trucks, boats, a drum kit, a school bus. If it has a surface, it can have a second skin. Pick one, or bring your own.</p>
      <div className="grid gap-8 pb-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0"><WrapStage /><p className="readout mt-2 text-dim">{compliance.placeholderImagery}</p></div>
        <div className="grid min-w-0 content-start gap-7">
          <BodyPicker />
          <FilmSwatches />
          <FinishPicker />
          <LetteringInput />
          <BuildActions />
        </div>
      </div>
      <MomMethodModal />
    </Level>
  );
}
