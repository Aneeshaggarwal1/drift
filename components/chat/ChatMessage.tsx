import { parseAIResponse } from '@/lib/ai/parser';
import DestinationCard from './DestinationCard';
import ItineraryDayCard from './ItineraryDayCard';
import type { DestinationCard as DestinationCardType, ItineraryDay, ProfileData } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
  onPickDestination?: (card: DestinationCardType) => void;
  onConfirmProfile?: (data: ProfileData) => void;
  onSaveTrip?: (days: ItineraryDay[]) => void;
}

export default function ChatMessage({ message, onPickDestination, onConfirmProfile, onSaveTrip }: ChatMessageProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-[fadeIn_200ms_ease-out]">
        <div className="max-w-[75%] bg-[#E8A838]/10 border border-[#E8A838]/20 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-[#F5F0E8] text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  const segments = parseAIResponse(message.content);

  return (
    <div className="flex items-start gap-3 animate-[fadeIn_200ms_ease-out]">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-[#E8A838]/10 border border-[#E8A838]/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[#E8A838] text-xs font-semibold" style={{ fontFamily: 'Fraunces, serif' }}>D</span>
      </div>

      <div className="flex-1 space-y-3 max-w-[90%]">
        {segments.map((segment, i) => {
          if (segment.type === 'text') {
            return (
              <div
                key={i}
                className={cn(
                  'bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl rounded-tl-sm px-4 py-3',
                  i === 0 && 'rounded-tl-sm',
                )}
              >
                <p className="text-[#F5F0E8] text-sm whitespace-pre-wrap leading-relaxed">{segment.content}</p>
              </div>
            );
          }

          if (segment.type === 'json_block') {
            const data = segment.data as { type?: string; data?: unknown };

            if (data?.type === 'destination_cards') {
              const cards = (data.data as DestinationCardType[]) ?? [];
              return (
                <div key={i} className="space-y-3">
                  {cards.map((card, j) => (
                    <DestinationCard
                      key={j}
                      card={card}
                      onPick={onPickDestination}
                    />
                  ))}
                </div>
              );
            }

            if (data?.type === 'itinerary') {
              const days = (data.data as ItineraryDay[]) ?? [];
              return (
                <div key={i} className="space-y-2">
                  {days.map((day, j) => (
                    <ItineraryDayCard key={j} day={day} />
                  ))}
                  {onSaveTrip && (
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full mt-2"
                      onClick={() => onSaveTrip(days)}
                    >
                      Save this trip
                    </Button>
                  )}
                </div>
              );
            }

            if (data?.type === 'travel_profile') {
              const profileData = data.data as ProfileData;
              return (
                <div key={i} className="bg-[#1A1A1A] border border-[#E8A838]/20 rounded-2xl p-4 space-y-3">
                  <div>
                    <p className="text-[#E8A838] font-semibold" style={{ fontFamily: 'Fraunces, serif' }}>
                      {profileData?.traveler_type ?? 'Your Travel Persona'}
                    </p>
                    {profileData?.traveler_description && (
                      <p className="text-[#A09A90] text-sm mt-1">{profileData.traveler_description}</p>
                    )}
                  </div>
                  {onConfirmProfile && (
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onConfirmProfile(profileData)}
                      >
                        Looks good — save it
                      </Button>
                    </div>
                  )}
                </div>
              );
            }

            if (data?.type === 'profile_update') {
              const update = data.data as { field_path?: string; old_value?: unknown; new_value?: unknown; reason?: string };
              return (
                <div key={i} className="bg-[#1A1A1A] border border-[#7C9A6E]/20 rounded-2xl p-4">
                  <p className="text-[#7C9A6E] text-xs uppercase tracking-wider mb-2">Profile Update</p>
                  <p className="text-[#F5F0E8] text-sm">{update?.reason}</p>
                  <div className="mt-2 text-xs text-[#A09A90] font-mono">
                    <span>{update?.field_path}: </span>
                    <span className="text-[#D4756B] line-through">{JSON.stringify(update?.old_value)}</span>
                    {' → '}
                    <span className="text-[#7C9A6E]">{JSON.stringify(update?.new_value)}</span>
                  </div>
                </div>
              );
            }

            // Fallback: show raw content
            return (
              <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl rounded-tl-sm px-4 py-3">
                <pre className="text-[#A09A90] text-xs overflow-auto">{segment.content}</pre>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
