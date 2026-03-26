export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/statoz logo.png"
        alt="Statoz Logo"
        className="h-12 w-12 object-contain"
      />
      <div className="flex flex-col">
        <p className="font-orbitron font-extrabold leading-7 text-xl tracking-wide uppercase text-[#5cdfff]">
          Statoz
        </p>
        <p className="font-orbitron font-bold leading-tight text-[#5cdfff] text-[10px] tracking-wider uppercase">
          Predict. Play. Dominate.
        </p>
      </div>
    </div>
  );
}
