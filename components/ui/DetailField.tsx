"use client";

import { ReactNode } from "react";

interface DetailFieldProps {
  label: string;
  children: ReactNode;
}

export default function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wider text-zinc-600 mb-0.5">
        {label}
      </dt>
      <dd className="text-sm text-zinc-200">{children}</dd>
    </div>
  );
}
