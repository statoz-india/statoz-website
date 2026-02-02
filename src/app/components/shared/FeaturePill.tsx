import { LucideIcon } from 'lucide-react';

interface FeaturePillProps {
  icon: LucideIcon;
  label: string;
}

export function FeaturePill({ icon: Icon, label }: FeaturePillProps) {
  return (
    <div className="bg-[rgba(15,23,43,0.5)] border border-[#1d293d] px-4 py-4 flex items-center gap-3">
      <Icon className="w-5 h-5 text-[#c27aff]" />
      <span className="font-orbitron font-bold text-sm text-white uppercase">{label}</span>
    </div>
  );
}
