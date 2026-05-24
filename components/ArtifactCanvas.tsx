'use client';

import React, { useEffect, useRef } from 'react';

interface ArtifactCanvasProps {
  elementIndex: number;
  celestialIndex: number;
  logicIndex: number;
  senderName: string;
  receiverName: string;
  saleId: string;
}

/**
 * ArtifactCanvas renders a 1200x800 industrial-themed canvas displaying
 * three cipher SVG icons (element, celestial, logic) with deterministic positioning.
 * Uses Courier Prime font for a monospace, industrial aesthetic.
 */
export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({
  elementIndex,
  celestialIndex,
  logicIndex,
  senderName,
  receiverName,
  saleId,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // SVG icon path generators
  const getElementPath = (index: number) => `/public/assets/cipher/el-${index % 4}.svg`;
  const getCelestialPath = (index: number) => `/public/assets/cipher/cl-${index % 9}.svg`;
  const getLogicPath = (index: number) => `/public/assets/cipher/lg-${index % 24}.svg`;

  return (
    <div
      ref={canvasRef}
      className="artifact-canvas"
      style={{
        width: '1200px',
        height: '800px',
        backgroundColor: '#0a0a0a',
        color: '#e0e0e0',
        fontFamily: '"Courier Prime", monospace',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #333',
      }}
    >
      {/* Header: Sale ID and Names */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          letterSpacing: '1px',
          borderBottom: '1px solid #333',
          paddingBottom: '20px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ color: '#666' }}>SALE_ID</div>
          <div style={{ fontWeight: 'bold', color: '#00ff00' }}>{saleId}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#666' }}>SENDER</div>
          <div style={{ fontWeight: 'bold' }}>{senderName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#666' }}>RECEIVER</div>
          <div style={{ fontWeight: 'bold' }}>{receiverName}</div>
        </div>
      </div>

      {/* Main Icon Grid: 3 columns (Element | Celestial | Logic) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '40px',
          flex: 1,
          alignItems: 'center',
          justifyItems: 'center',
          margin: '40px 0',
        }}
      >
        {/* Element Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <img
              src={getElementPath(elementIndex)}
              alt={`Element ${elementIndex}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '10px',
              }}
            />
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#888',
              textAlign: 'center',
              letterSpacing: '1px',
            }}
          >
            ELEMENT_{elementIndex}
          </div>
        </div>

        {/* Celestial Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <img
              src={getCelestialPath(celestialIndex)}
              alt={`Celestial ${celestialIndex}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '10px',
              }}
            />
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#888',
              textAlign: 'center',
              letterSpacing: '1px',
            }}
          >
            CELESTIAL_{celestialIndex}
          </div>
        </div>

        {/* Logic Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <img
              src={getLogicPath(logicIndex)}
              alt={`Logic ${logicIndex}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '10px',
              }}
            />
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#888',
              textAlign: 'center',
              letterSpacing: '1px',
            }}
          >
            LOGIC_{logicIndex}
          </div>
        </div>
      </div>

      {/* Footer: Industrial Frame */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '1px solid #333',
          paddingTop: '20px',
          fontSize: '10px',
          color: '#666',
          letterSpacing: '2px',
        }}
      >
        [CIPHER_ARTIFACT_SEALED]
      </div>
    </div>
  );
};

export default ArtifactCanvas;
