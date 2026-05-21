import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "@/pages/Landing"
import MobilityPage from "@/pages/Mobility"
import ArmPage from "@/pages/Arm"
import { useEffect } from "react";
import { useTelemetryStore } from "@/store/useTelemetryStore";
import SciencePage from "@/pages/Science"

export default function App() {
  const connect = useTelemetryStore((state) => state.connect);
  useEffect(() => {
    connect('ws://localhost:9090'); 
  }, [connect]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mobility" element={<MobilityPage />} />
        <Route path="/arm" element={<ArmPage />} />
        <Route path="/science" element={<SciencePage />} />
      </Routes>
    </BrowserRouter>
  )
}
