const PROGRESS_BLOCKS = 38;

type Props = {
  citiesCount: number;
  countriesCount: number;
  miles: number;
  updatesCount: number;
  day: number;
  totalDays: number;
  allTimeCitiesCount: number;
  allTimeCountriesCount: number;
  allTimeContinentsCount: number;
};

export function TripStats({
  citiesCount,
  countriesCount,
  miles,
  updatesCount,
  day,
  totalDays,
  allTimeCitiesCount,
  allTimeCountriesCount,
  allTimeContinentsCount,
}: Props) {
  const allTimeStats = [
    { count: allTimeCitiesCount, label: "cities" },
    { count: allTimeCountriesCount, label: "countries" },
    { count: allTimeContinentsCount, label: "continents" },
  ];
  const filledBlocks = Math.round((day / totalDays) * PROGRESS_BLOCKS);

  return (
    <div className="mb-10 space-y-8">
      <div>
        <p className="text-[11px] uppercase font-normal text-text-secondary tracking-wide">
          Sabbatical
        </p>
        <p className="mt-2 text-[16px] text-text-primary tabular-nums">
          {citiesCount} cities, {countriesCount} countries, {Math.round(miles).toLocaleString()}{" "}
          miles, {updatesCount} update{updatesCount === 1 ? "" : "s"}.
        </p>

        <div className="mt-3 flex gap-[2px]">
          {Array.from({ length: PROGRESS_BLOCKS }).map((_, i) => {
            const isCurrent = i === filledBlocks - 1;
            const isElapsed = i < filledBlocks - 1;
            return (
              <div
                key={i}
                className="flex-1"
                style={{
                  height: 8,
                  backgroundColor: isCurrent
                    ? "var(--color-mustard)"
                    : isElapsed
                      ? "var(--color-stone)"
                      : "var(--color-line)",
                }}
              />
            );
          })}
        </div>
        <p className="mt-2 font-mono-num text-[13px] text-text-secondary">
          Day {day} of {totalDays}
        </p>
      </div>

      <div>
        <p className="text-[11px] uppercase font-normal text-text-secondary tracking-wide">
          All time
        </p>
        <div className="mt-2 space-y-3">
          {allTimeStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <p className="text-[16px] text-text-primary tabular-nums w-24 shrink-0">
                {stat.count} {stat.label}
              </p>
              <div className="flex flex-wrap gap-[2px] max-w-[240px]">
                {Array.from({ length: stat.count }).map((_, i) => (
                  <div key={i} style={{ width: 7, height: 7, backgroundColor: "var(--color-stone)" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
