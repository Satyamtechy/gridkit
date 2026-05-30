import React from "react";
import { Features, GridAction } from "@/types/playground";

interface Props {
  features: Features;
  dispatch: React.Dispatch<GridAction>;
}

export function FeatureChips({ features, dispatch }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(features) as (keyof Features)[]).map(key => (
        <button key={key} onClick={() => dispatch({ type: "TOGGLE_FEATURE", key })}
          className={`cursor-pointer flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium transition-all ${features[key] ? "bg-electric/15 text-electric ring-1 ring-electric/30" : "bg-surface text-fog ring-1 ring-rail hover:ring-smoke"}`}>
          {features[key] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}
    </div>
  );
}
