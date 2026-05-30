import React from "react";
import { GridAction, Widget } from "@/types/playground";
import { TEMPLATES } from "@/lib/grid-utils";

interface Props {
  activeTemplate: string;
  onSelect: (name: string) => void;
}

export function TemplateSelector({ activeTemplate, onSelect }: Props) {
  return (
    <>
      {Object.keys(TEMPLATES).map(name => (
        <button key={name} onClick={() => onSelect(name)}
          className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition-all ${activeTemplate === name ? "bg-electric/15 text-electric ring-1 ring-electric/30" : "bg-surface text-fog ring-1 ring-rail hover:ring-smoke hover:text-frost"}`}>
          {name}
        </button>
      ))}
    </>
  );
}
