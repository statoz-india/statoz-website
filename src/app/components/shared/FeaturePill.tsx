import { LucideIcon } from 'lucide-react';

interface FeaturePillProps {
  icon: LucideIcon;
  label: string;
}

export function FeaturePill({ icon: Icon, label }: FeaturePillProps) {
  return (
    <div className="bg-[rgba(15,23,43,0.5)] border border-[#1d293d] px-2 py-2 sm:px-4 sm:py-4 flex items-center gap-2 sm:gap-3">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#c27aff]" />
      <span className="font-orbitron font-bold text-[11px] sm:text-sm text-white uppercase whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
