import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatsCard({ title, value, icon: Icon, iconColor, iconBg }: StatsCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={iconColor} size={20} />
        </div>
        <span className="text-sm text-gray-600 font-medium">{title}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
