import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Thermometer,
  Wifi,
  Server,
} from "lucide-react"

import logoWhite from "@/assets/logo-white.png"
import mobilityImg from "@/assets/mobility_img1.JPG"
import armImg from "@/assets/arm_img1.JPG"
import scienceImg from "@/assets/science_img1.JPG"

import DashboardNavCard from "@/components/landing/DashboardNavCard"
import MiniBreakdownRow from "@/components/landing/MiniBreakdownRow"
import OverviewStatCard from "@/components/landing/OverviewStatCard"

type DashboardCard = {
  title: string
  description: string
  path: string
  image: string
}

export default function LandingPage() {
  const dashboards: DashboardCard[] = [
    {
      title: "Mobility",
      description: "Rover control and telemetry",
      path: "/mobility",
      image: mobilityImg,
    },
    {
      title: "Arm",
      description: "Robotic arm control",
      path: "/arm",
      image: armImg,
    },
    {
      title: "Science",
      description: "Science instruments",
      path: "/science",
      image: scienceImg,
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#140608] text-[#f8edef]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.12]">
        <img
          src={logoWhite}
          alt="Karura Logo"
          className="h-[36rem] w-auto object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1750px] flex-col px-4 py-6">
        <header className="mb-8 text-center">
          <img
            src={logoWhite}
            alt="Karura"
            className="mx-auto mb-6 h-24 w-auto object-contain"
          />

          <h1 className="text-4xl font-bold tracking-tight">Karura Rover GUI</h1>
          <p className="mt-2 text-[#f8edef]/70">
            Select a dashboard or review a quick rover systems overview.
          </p>
        </header>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-[#f2a7b8]" />
            <h2 className="text-xl font-semibold text-[#fff3f5]">
              Rover Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <OverviewStatCard
                title="System Computers"
                value="3 / 3 Online"
                subtext="Mobility Pi, Arm Pi, Science Pi"
                icon={<Server className="h-5 w-5" />}
                centerContent
                />

                <OverviewStatCard
                title="Average CPU Load"
                value="34%"
                subtext="Across onboard computers"
                icon={<Cpu className="h-5 w-5" />}
                >
                <MiniBreakdownRow label="Mobility Pi" value="38%" />
                <MiniBreakdownRow label="Arm Pi" value="29%" />
                <MiniBreakdownRow label="Science Pi" value="35%" />
                </OverviewStatCard>

                <OverviewStatCard
                title="Average Memory Use"
                value="58%"
                subtext="RAM utilization"
                icon={<MemoryStick className="h-5 w-5" />}
                >
                <MiniBreakdownRow label="Mobility Pi" value="61%" />
                <MiniBreakdownRow label="Arm Pi" value="52%" />
                <MiniBreakdownRow label="Science Pi" value="60%" />
                </OverviewStatCard>

                <OverviewStatCard
                title="System Temperature"
                value="51°C"
                subtext="Average compute temp"
                icon={<Thermometer className="h-5 w-5" />}
                >
                <MiniBreakdownRow label="Mobility Pi" value="53°C" />
                <MiniBreakdownRow label="Arm Pi" value="49°C" />
                <MiniBreakdownRow label="Science Pi" value="51°C" />
                </OverviewStatCard>

                <OverviewStatCard
                title="Storage Usage"
                value="62%"
                subtext="Onboard storage consumed"
                icon={<HardDrive className="h-5 w-5" />}
                centerContent
                />

                <OverviewStatCard
                title="Network Status"
                value="Nominal"
                subtext="Internal rover comms healthy"
                icon={<Wifi className="h-5 w-5" />}
                centerContent
                />
          </div>
        </section>

        <section className="mt-auto">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[#fff3f5]">Dashboards</h2>
          </div>

          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {dashboards.map((dashboard) => (
              <DashboardNavCard
                key={dashboard.path}
                title={dashboard.title}
                description={dashboard.description}
                path={dashboard.path}
                image={dashboard.image}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}