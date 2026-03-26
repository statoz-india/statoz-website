import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] p-8 hover:border-[#ad46ff] transition-all duration-300 hover:scale-105 group">
      <div className="bg-[#1d293d] border-2 border-[rgba(97,95,255,0.3)] w-14 h-14 flex items-center justify-center mb-6 group-hover:border-[#7C86FF] transition-colors">
        <Icon className="w-7 h-7 text-[#7C86FF]" />
      </div>
      
      <h3 className="font-orbitron font-extrabold text-xl text-white uppercase mb-4 tracking-wide">
        {title}
      </h3>
      
      <p className="font-jakarta text-[#cad5e2] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
