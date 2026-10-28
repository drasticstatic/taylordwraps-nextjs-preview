/** A floor that exists but is still unwrapped. Honest primer, one sentence about what lands here. */
export function BareMetal({ what }: { what: string }) {
  return (
    <div className="panel primer mb-16 p-8">
      <p className="readout text-dim">bare metal, film arriving</p>
      <p className="mt-3 max-w-[60ch] text-lg">{what}</p>
    </div>
  );
}
