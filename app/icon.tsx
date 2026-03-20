import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080809",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        {/* Brand "R" lettermark */}
        <span
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: "serif",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            marginTop: "1px",
          }}
        >
          R
        </span>

        {/* Sage green accent dot — mirrors the hero badge dot */}
        <div
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#3d6b4f",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
