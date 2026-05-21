import type { ReactNode } from "react"

type ScienceDataCardProps = {
  eyebrow: string
  title: string
  icon?: ReactNode
  children: ReactNode
}

export default function ScienceDataCard({
  eyebrow,
  title,
  icon,
  children,
}: ScienceDataCardProps) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-2xl">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#53202b] px-3 py-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#c9a3ab]">
            {eyebrow}
          </p>
          <h2 className="text-sm font-semibold leading-tight text-[#fff3f5]">
            {title}
          </h2>
        </div>

        {icon && (
          <div className="rounded-full border border-[#5a1a26] bg-[#16080a] p-2 text-[#f3d9df]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 items-center px-3 py-3">
        <div className="flex w-full flex-col gap-2">{children}</div>
      </div>
    </section>
  )
}