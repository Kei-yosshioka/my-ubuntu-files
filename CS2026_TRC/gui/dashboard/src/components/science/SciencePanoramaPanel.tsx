import { Compass, ScanLine } from "lucide-react"

type SciencePanoramaPanelProps = {
  lastCapturedAt: string | null
}

export default function SciencePanoramaPanel({
  lastCapturedAt,
}: SciencePanoramaPanelProps) {
  // ラズパイのWebサーバーから画像を取得するためのURL
  // ブラウザのキャッシュを避けるため、末尾に time パラメータを付けています
  const panoramaUrl = `http://192.168.137.160:8080/assets/latest_panorama.jpg?t=${lastCapturedAt}`

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-2xl">
      {/* ヘッダー部分 */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#53202b] px-4 py-2.5">
        <div> 
          <h2 className="text-sm font-semibold text-[#fff3f5]">
            Science Panorama
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#5a1a26] bg-[#16080a] px-3 py-1.5 text-[11px] text-[#e7c8cf]">
          <Compass className="h-3.5 w-3.5" />
          <span>N • E • S</span>
        </div>
      </div>

      {/* メイン表示エリア */}
      <div className="min-h-0 flex-1 bg-[#0f0406] p-3">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-[#7a2d3d] bg-[radial-gradient(circle_at_top,_#2a1016_0%,_#120406_55%,_#090203_100%)]">
          
          {/* グリッド線（装飾） */}
          <div className="pointer-events-none absolute inset-y-0 left-1/4 w-px bg-[#7b2940]/35" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-[#7b2940]/45" />
          <div className="pointer-events-none absolute inset-y-0 left-3/4 w-px bg-[#7b2940]/35" />

          {lastCapturedAt ? (
            // ★ 写真がある場合は img タグを表示
            <img 
              src={panoramaUrl} 
              alt="Latest Science Panorama"
              className="h-full w-full object-contain animate-in fade-in zoom-in duration-700"
              onError={(e) => {
                // 画像読み込みに失敗した時の処理（404など）
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            // ★ まだ撮影していない時の表示
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <ScanLine className="h-9 w-9 text-[#d47b94] animate-pulse" />
              <p className="text-base font-semibold text-[#fff3f5]">No Panorama Data</p>
              <p className="text-xs text-[#d4c7ca] opacity-60">
                Click "Capture Panorama" to begin scanning
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
