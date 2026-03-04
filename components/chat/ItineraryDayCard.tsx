'use client';

import { useState } from 'react';
import { formatINR } from '@/lib/utils/budget';
import type { ItineraryDay } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  day: ItineraryDay;
}

export default function ItineraryDayCard({ day }: Props) {
  const [open, setOpen] = useState(false);

  const blocks = [
    { label: 'Morning', data: day.morning?.activities ?? [] },
    { label: 'Afternoon', data: day.afternoon?.activities ?? [] },
    { label: 'Evening', data: day.evening?.activities ?? [] },
  ];

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden animate-[slideUp_300ms_ease-out]">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#252525] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E8A838]/10 border border-[#E8A838]/20 flex items-center justify-center shrink-0">
            <span className="text-[#E8A838] text-xs font-semibold">{day.day}</span>
          </div>
          <div>
            <p className="text-[#F5F0E8] text-sm font-medium">Day {day.day}</p>
            {day.date && <p className="text-[#A09A90] text-xs">{day.date}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#E8A838] font-mono text-sm">{formatINR(day.daily_cost_estimate_inr)}</span>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={cn('text-[#A09A90] transition-transform', open && 'rotate-180')}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-[#2A2A2A] px-5 py-4 space-y-4">
          {blocks.map(block => block.data.length > 0 && (
            <div key={block.label}>
              <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-2">{block.label}</p>
              <div className="space-y-2">
                {block.data.map((activity, i) => (
                  <div key={i} className="bg-[#0F0F0F] rounded-xl p-3">
                    <p className="text-[#F5F0E8] text-sm font-medium">{activity.name}</p>
                    <p className="text-[#A09A90] text-xs mt-0.5">{activity.place}</p>
                    {activity.description && <p className="text-[#A09A90] text-xs mt-1">{activity.description}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#A09A90]">
                      {activity.duration_minutes > 0 && <span>{activity.duration_minutes}min</span>}
                      {activity.travel_time_from_previous_minutes > 0 && (
                        <span>+{activity.travel_time_from_previous_minutes}min travel</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {day.meals?.length > 0 && (
            <div>
              <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-2">Meals</p>
              <div className="space-y-2">
                {day.meals.map((meal, i) => (
                  <div key={i} className="bg-[#0F0F0F] rounded-xl p-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[#F5F0E8] text-sm font-medium capitalize">{meal.type} — {meal.restaurant}</p>
                      {meal.what_to_order && <p className="text-[#A09A90] text-xs mt-0.5">{meal.what_to_order}</p>}
                    </div>
                    <span className="text-[#E8A838] font-mono text-xs shrink-0">{formatINR(meal.estimated_cost_inr)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {day.pro_tips?.length > 0 && (
            <div>
              <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-2">Pro Tips</p>
              <ul className="space-y-1">
                {day.pro_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#A09A90]">
                    <span className="text-[#E8A838] mt-0.5">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
