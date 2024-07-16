import React, { useState } from "react";

import Audio from "@/pages/dashboard/audio";
import HistoryAudio from "./history-audio";


export function Home() {

  return (
    <div className="mt-10">
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Audio />
        <HistoryAudio />
      </div>
    </div>
  );
}

export default Home;
