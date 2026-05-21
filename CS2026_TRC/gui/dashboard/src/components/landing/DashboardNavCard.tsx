import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type DashboardNavCardProps = {
  title: string
  description: string
  path: string
  image: string
}

export default function DashboardNavCard({
  title,
  description,
  path,
  image,
}: DashboardNavCardProps) {
  return (
    <Link
      to={path}
      className="group transition-transform duration-300 hover:scale-[1.02]"
    >
      <Card className="h-full cursor-pointer overflow-hidden border border-[#f8edef]/15 bg-[#1a0d11]/95 shadow-2xl transition-all hover:border-[#f2a7b8]/45 hover:bg-[#211015]">
        <CardHeader className="pb-6">
          <div className="mb-4 h-40 w-full overflow-hidden rounded-xl border border-[#f8edef]/10 bg-gradient-to-br from-[#2a1d22] to-[#1a0d11]">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>

          <CardTitle className="text-2xl text-[#f8edef]">{title}</CardTitle>

          <CardDescription className="mt-2 text-[#f8edef]/60">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}