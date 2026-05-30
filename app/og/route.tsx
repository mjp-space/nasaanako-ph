import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f1117',
          fontFamily: 'sans-serif',
          gap: '16px',
          padding: '60px',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute',
          width: '700px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245,197,66,0.18) 0%, transparent 70%)',
          top: '80px',
        }} />

        {/* Badge */}
        <div style={{
          display: 'flex',
          background: 'rgba(245,197,66,0.12)',
          border: '1px solid rgba(245,197,66,0.3)',
          borderRadius: '24px',
          padding: '6px 20px',
          fontSize: '20px',
          color: '#f5c542',
          fontWeight: 700,
          letterSpacing: '2px',
          marginBottom: '8px',
        }}>
          🇵🇭 PHILIPPINES ONLY · FREE TO PLAY
        </div>

        {/* Title */}
        <div style={{
          fontSize: '96px',
          fontWeight: 900,
          letterSpacing: '-3px',
          lineHeight: 1,
          display: 'flex',
          color: 'white',
        }}>
          <span>Nasaan</span>
          <span style={{ color: '#f5c542' }}>Ako</span>
          <span>.ph</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '32px',
          color: '#9ca3af',
          marginTop: '8px',
          textAlign: 'center',
        }}>
          Drop anywhere in the Philippines. Guess where you are.
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '24px',
          background: '#f5c542',
          color: '#0f1117',
          borderRadius: '32px',
          padding: '16px 48px',
          fontSize: '28px',
          fontWeight: 900,
        }}>
          ▶ Play Now — It's Free
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
