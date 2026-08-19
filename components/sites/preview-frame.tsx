"use client"

import { useState } from "react"

type PreviewFrameProps = {
  chatId: string
  businessName: string
}

/**
 * The server-side /loading fallback route only fires when v0's sandbox
 * itself isn't ready yet - a narrow, increasingly rare case once a chat
 * has been visited before. The far more common wait is the iframe loading
 * the real generated site's own JS/CSS for the first time, which the old
 * setup had zero loading UI for at all. This overlay covers that gap
 * directly: visible by default, hidden once the iframe's onLoad fires.
 */
export function PreviewFrame({ chatId, businessName }: PreviewFrameProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fafaf9",
          }}
        >
          <style>{`
            @keyframes preview-spin { to { transform: rotate(360deg); } }
            @keyframes preview-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
          `}</style>
          <div style={{ textAlign: "center", padding: "2.5rem", width: "100%", maxWidth: 320 }}>
            <div
              style={{
                width: 44,
                height: 44,
                margin: "0 auto 1.75rem",
                borderRadius: "50%",
                border: "3px solid #e7e2db",
                borderTopColor: "#d97757",
                animation: "preview-spin 1s linear infinite",
              }}
            />
            <h1
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                marginBottom: "0.4rem",
                color: "#292524",
              }}
            >
              Preparing {businessName}
            </h1>
            <p
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "0.85rem",
                color: "#78716c",
                marginBottom: "1.5rem",
              }}
            >
              Building your preview, just a moment
            </p>
            <div
              style={{
                height: 4,
                width: "100%",
                background: "#e7e2db",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "40%",
                  borderRadius: 999,
                  background: "#d97757",
                  animation: "preview-slide 1.3s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      )}
      <iframe
        src={`/api/v0-preview/${chatId}/?name=${encodeURIComponent(businessName)}`}
        style={{ height: "100%", width: "100%", border: 0 }}
        title={`${businessName} preview`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
