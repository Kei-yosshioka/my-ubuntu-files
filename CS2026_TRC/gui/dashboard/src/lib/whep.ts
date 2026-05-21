type WhepSession = {
  pc: RTCPeerConnection
  sessionUrl: string | null
}

function waitForIceGatheringComplete(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === "complete") {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const checkState = () => {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener("icegatheringstatechange", checkState)
        resolve()
      }
    }

    pc.addEventListener("icegatheringstatechange", checkState)
  })
}

export async function startWhepPlayback(
  videoEl: HTMLVideoElement,
  path: string,
  baseUrl: string
): Promise<WhepSession> {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "")
  const normalizedPath = path.replace(/^\/+/, "")
  const whepUrl = `${normalizedBaseUrl}/${normalizedPath}/whep`

  const pc = new RTCPeerConnection({
    iceServers: [],
  })

  const mediaStream = new MediaStream()
  videoEl.srcObject = mediaStream
  videoEl.autoplay = true
  videoEl.playsInline = true
  videoEl.muted = true

  pc.addEventListener("track", (event) => {
    for (const track of event.streams[0].getTracks()) {
      mediaStream.addTrack(track)
    }
  })

  pc.addTransceiver("video", { direction: "recvonly" })
  pc.addTransceiver("audio", { direction: "recvonly" })

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  await waitForIceGatheringComplete(pc)

  const response = await fetch(whepUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/sdp",
    },
    body: pc.localDescription?.sdp,
  })

  if (!response.ok) {
    pc.close()
    throw new Error(`WHEP failed: ${response.status} ${response.statusText}`)
  }

  const answerSdp = await response.text()
  const locationHeader = response.headers.get("Location")
  const sessionUrl = locationHeader
    ? new URL(locationHeader, whepUrl).toString()
    : null

  await pc.setRemoteDescription({
    type: "answer",
    sdp: answerSdp,
  })

  return { pc, sessionUrl }
}

export async function stopWhepPlayback(session: WhepSession | null) {
  if (!session) return

  try {
    if (session.sessionUrl) {
      await fetch(session.sessionUrl, { method: "DELETE" })
    }
  } catch {
    // ignore cleanup failures
  }

  session.pc.close()
}