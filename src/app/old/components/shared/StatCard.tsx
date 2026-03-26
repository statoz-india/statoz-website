import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Icon className="w-8 h-8 text-[#c27aff]" />
      <p className="font-orbitron font-extrabold text-3xl lg:text-4xl text-white text-center">{value}</p>
      <p className="font-orbitron font-semibold text-xs lg:text-sm text-[rgba(255,255,255,0.5)] uppercase text-center">{label}</p>
    </div>
  );
}
