"use client";

import { Call } from "@prisma/client";
import React from "react";
import CallsList from "./CallsList";

export default function Calls({ calls: _calls }: { calls: Call[] }) {
  const [calls, setCalls] = React.useState(_calls);
  React.useEffect(() => {
    setCalls(_calls);
  }, [_calls]);

  function removeCall(call: Call) {
    setCalls(calls.filter((c) => c.id !== call.id));
  }

  return (
    <div className="mx-4 md:mx-32 p-4 md:p-8 space-y-4 border rounded-xl bg-white">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg md:text-2xl">My Calls</h1>
      </div>
      <CallsList calls={calls} removeCall={removeCall} />
    </div>
  );
}
