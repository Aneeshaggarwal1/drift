import LoadingDots from '@/components/ui/LoadingDots';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-[fadeIn_200ms_ease-out]">
      <div className="w-7 h-7 rounded-full bg-[#E8A838]/10 border border-[#E8A838]/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[#E8A838] text-xs">D</span>
      </div>
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl rounded-tl-sm px-4 py-3">
        <LoadingDots />
      </div>
    </div>
  );
}
