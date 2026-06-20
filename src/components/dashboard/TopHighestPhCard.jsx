import React, { useMemo } from 'react';

const TopHighestPhCard = ({ historyData }) => {
  const topPhData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    // Sort by lowest pH (most acidic)
    const sorted = [...historyData].sort((a, b) => a.ph - b.ph);
    const unique = [];
    const seen = new Set();
    for (const item of sorted) {
      const key = `${item.ph}-${item.timestamp}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
      if (unique.length === 5) break;
    }
    return unique;
  }, [historyData]);

  const getSeverityDetails = (ph) => {
    if (ph <= 2.5) return {
      bg: 'bg-[#7A0103]', text: 'text-white', subtext: 'text-white/80', pill: 'bg-black/20',
      issue: 'Kondisi Sangat Ekstrem', desc: 'Risiko korosi berat pada infrastruktur logam.'
    };
    if (ph <= 3.0) return {
      bg: 'bg-[#A50104]', text: 'text-white', subtext: 'text-white/80', pill: 'bg-black/20',
      issue: 'Kritis Ekstrem', desc: 'Pelarutan logam berat sangat beracun meningkat drastis.'
    };
    if (ph <= 3.5) return {
      bg: 'bg-[#B81702]', text: 'text-white', subtext: 'text-white/80', pill: 'bg-black/20',
      issue: 'Bahaya Tinggi', desc: 'Netralisasi kapur segera diperlukan.'
    };
    if (ph <= 4.0) return {
      bg: 'bg-[#EC3F13]', text: 'text-white', subtext: 'text-white/80', pill: 'bg-black/15',
      issue: 'Waspada Asam', desc: 'Aktivasi pompa dosing otomatis.'
    };
    if (ph <= 4.5) return {
      bg: 'bg-[#FA5E1F]', text: 'text-white', subtext: 'text-white/80', pill: 'bg-black/10',
      issue: 'Perhatian', desc: 'Nilai keasaman menuju ambang batas.'
    };
    if (ph <= 5.0) return {
      bg: 'bg-[#FF7E33]', text: 'text-white', subtext: 'text-white/80', pill: 'bg-black/10',
      issue: 'Slightly Acidic', desc: 'Pantau laju penurunan pH.'
    };
    if (ph <= 5.5) return {
      bg: 'bg-[#FF931F]', text: 'text-[#6B3200]', subtext: 'text-[#8A4600]', pill: 'bg-white/40',
      issue: 'Marginal', desc: 'Kualitas air mulai terganggu.'
    };
    if (ph <= 6.0) return {
      bg: 'bg-[#FFAD33]', text: 'text-[#6B3200]', subtext: 'text-[#8A4600]', pill: 'bg-white/40',
      issue: 'Batas Toleransi', desc: 'Masih dalam batas wajar sistem.'
    };
    return {
      bg: 'bg-[#FFB950]', text: 'text-[#6B3200]', subtext: 'text-[#8A4600]', pill: 'bg-white/40',
      issue: 'Normal Terjaga', desc: 'Kondisi air asam tidak signifikan.'
    };
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#EAECF0] flex flex-col p-4 w-full h-full">
      <div className="flex flex-col mb-4">
        <h3 className="text-[14px] font-bold text-[#101828]">Top 5 Anomali Keasaman</h3>
        <p className="text-[12px] font-normal text-[#98A2B3] mt-1.5">Puncak tingkat keasaman (pH terendah) yang terekam sistem</p>
      </div>

      <div className="flex-1 w-full pb-2">
        {topPhData.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
            {topPhData.map((item, idx) => {
              const details = getSeverityDetails(item.ph);
              return (
                <div
                  key={idx}
                  className={`flex flex-col justify-between p-3 sm:p-4 rounded-[14px] cursor-pointer transition-[filter] duration-200 hover:brightness-110 min-h-[180px] sm:min-h-[220px] ${details.bg}`}
                >
                  {/* Top: Rank, Node, Time, and Issue */}
                  <div className="shrink-0 flex flex-col w-full">
                    <div className="flex items-center justify-between mb-3 w-full">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-[24px] h-[24px] rounded-full ${details.pill} flex items-center justify-center text-[11px] font-bold ${details.text}`}>
                          #{idx + 1}
                        </div>
                        <div className={`text-[11px] font-bold ${details.text} ${details.pill} px-2 py-0.5 rounded-md`}>
                          {item.nodeId}
                        </div>
                      </div>
                      <div className={`text-[10px] font-medium ${details.text} ${details.pill} px-1.5 py-0.5 rounded`}>
                        {item.timestamp.split(' ')[1]}
                      </div>
                    </div>
                    <div className={`text-[12px] font-bold leading-tight ${details.text} text-center px-1`}>
                      {details.issue}
                    </div>
                  </div>
                  
                  {/* Center: BIG pH */}
                  <div className="flex-1 flex flex-col items-center justify-center py-2">
                    <div className={`text-[36px] sm:text-[46px] font-black tracking-tighter leading-none drop-shadow-sm ${details.text}`}>
                      {item.ph.toFixed(2)}
                    </div>
                    <div className={`text-[10px] font-semibold uppercase tracking-widest mt-1 ${details.subtext}`}>
                      pH Terukur
                    </div>
                  </div>

                  {/* Bottom: Description */}
                  <div className="shrink-0 text-center w-full px-2">
                    <div className={`text-[11px] leading-relaxed line-clamp-3 ${details.subtext}`}>
                      {details.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 h-full min-h-[140px]">
            <span className="text-[12px] font-normal text-[#98A2B3]">Belum ada data terekam.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHighestPhCard;
