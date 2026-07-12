import { useState, useEffect } from "react";
import CheckIn from "./CheckIn";
import FloorPlan from "./FloorPlan";
import type { GuestMatch } from "./guestsMatcher";
import { loadCheckIn, clearCheckIn } from "./storage";

function App() {
  const [match, setMatch] = useState<GuestMatch | null>(null);

  useEffect(() => {
    const saved = loadCheckIn<GuestMatch>();
    if (saved) setMatch(saved);
  }, []);

  function handleFound(result: GuestMatch) {
    setMatch(result);
  }

  function handleReset() {
    clearCheckIn();
    setMatch(null);
  }

  if (match) {
    return <FloorPlan match={match} onSearchDifferentName={handleReset} />;
  }

  return <CheckIn onFound={handleFound} />;
}

export default App;