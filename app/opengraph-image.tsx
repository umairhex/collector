import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 800,
          height: 800,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -300,
          left: -200,
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "40px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "30px",
            marginBottom: "40px",
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        </div>

        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-0.05em",
            marginBottom: "20px",
          }}
        >
          Collector
        </div>

        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.5)",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Premium Personal Knowledge Base
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          color: "rgba(255,255,255,0.2)",
          fontSize: 20,
          letterSpacing: "0.05em",
        }}
      >
        built with focus & precision
      </div>
    </div>,
    {
      ...size,
    },
  );
}
