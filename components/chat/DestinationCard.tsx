import { formatINR } from '@/lib/utils/budget';
import type { DestinationCard as DestinationCardType } from '@/lib/types';
import Button from '@/components/ui/Button';

interface Props {
  card: DestinationCardType;
  onPick?: (card: DestinationCardType) => void;
}

export default function DestinationCard({ card, onPick }: Props) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden animate-[slideUp_300ms_ease-out]">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-[#E8A838]/20 to-[#7C9A6E]/10 px-5 py-4 border-b border-[#2A2A2A]">
        <h3 className="text-lg font-semibold text-[#F5F0E8]" style={{ fontFamily: 'Fraunces, serif' }}>
          {card.name}
        </h3>
        <p className="text-[#A09A90] text-sm mt-0.5">{card.hook}</p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Why it fits */}
        <div>
          <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-2">Why it fits you</p>
          <ul className="space-y-1">
            {card.why_it_fits.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#F5F0E8]">
                <span className="text-[#7C9A6E] mt-0.5">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Weather + Duration */}
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-1">Weather</p>
            <p className="text-sm text-[#F5F0E8]">{card.weather}</p>
          </div>
          <div className="flex-1">
            <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-1">Duration</p>
            <p className="text-sm text-[#F5F0E8]">{card.duration_fit}</p>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-[#0F0F0F] rounded-xl p-3">
          <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-2">Estimated Budget</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-[#A09A90] text-xs">Flights</span>
              <p className="text-[#F5F0E8] font-mono text-sm">{formatINR(card.budget_estimate.flights_inr)}</p>
            </div>
            <div>
              <span className="text-[#A09A90] text-xs">Stay/night</span>
              <p className="text-[#F5F0E8] font-mono text-sm">{formatINR(card.budget_estimate.stay_per_night_inr)}</p>
            </div>
            <div>
              <span className="text-[#A09A90] text-xs">Daily</span>
              <p className="text-[#F5F0E8] font-mono text-sm">{formatINR(card.budget_estimate.daily_expenses_inr)}</p>
            </div>
            <div>
              <span className="text-[#A09A90] text-xs">Total</span>
              <p className="text-[#E8A838] font-mono text-sm font-semibold">{formatINR(card.budget_estimate.total_estimate_inr)}</p>
            </div>
          </div>
        </div>

        {/* Flags */}
        {card.flags?.length > 0 && (
          <div>
            <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-2">Heads up</p>
            <ul className="space-y-1">
              {card.flags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#A09A90]">
                  <span className="text-[#D4756B] mt-0.5">!</span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {onPick && (
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => onPick(card)}
          >
            Pick {card.name}
          </Button>
        )}
      </div>
    </div>
  );
}
