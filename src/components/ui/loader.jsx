'use client';

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin" size={32} />
    </div>
  );
}
