'use client';

import React, { useState, useEffect } from 'react';
import { ArtifactCanvas } from '@/components/ArtifactCanvas';
import { LEGEND_ATLAS } from '@/lib/legend-atlas';
import './reveal.css';

interface RevealPageProps {
  params: {
    saleId: string;
  };
}

interface SaleData {
  sale_id: string;
  sender_name: string;
  receiver_name: string;
  element_index: number;
  celestial_index: number;
  logic_index: number;
  verify_hash: string;
}

export default function RevealPage({ params }: RevealPageProps) {
  const { saleId } = params;
  const [saleData, setSaleData] = useState<SaleData | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        const response = await fetch(`/api/sale/${saleId}`);
        if (!response.ok) {
          throw new Error('Sale not found');
        }
        const data = await response.json();
        setSaleData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sale');
      } finally {
        setLoading(false);
      }
    };

    fetchSaleData();
  }, [saleId]);

  if (loading) {
    return (
      <div className="reveal-container">
        <div className="loading-text">Loading cipher artifact...</div>
      </div>
    );
  }

  if (error || !saleData) {
    return (
      <div className="reveal-container">
        <div className="error-text">✗ {error || 'Artifact not found'}</div>
      </div>
    );
  }

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div className="reveal-container">
      {!isRevealed ? (
        <div className="sealed-envelope-wrapper">
          {/* Sealed Envelope */}
          <div className="sealed-envelope" onClick={handleReveal}>
            {/* Envelope flap */}
            <div className="envelope-flap"></div>

            {/* Envelope body */}
            <div className="envelope-body">
              {/* Seal wax center */}
              <div className="seal-wax"></div>

              {/* Seal center symbol */}
              <div className="seal-symbol">◇</div>

              {/* Text on envelope */}
              <div className="envelope-text">
                <div className="envelope-sender">{saleData.sender_name}</div>
                <div className="envelope-arrow">→</div>
                <div className="envelope-receiver">{saleData.receiver_name}</div>
              </div>

              {/* Instructions */}
              <div className="envelope-instructions">CLICK TO REVEAL</div>
            </div>
          </div>

          {/* Decorative frame */}
          <div className="frame-corner top-left"></div>
          <div className="frame-corner top-right"></div>
          <div className="frame-corner bottom-left"></div>
          <div className="frame-corner bottom-right"></div>
        </div>
      ) : (
        <div className="revealed-content">
          {/* Artifact Canvas */}
          <div className="canvas-wrapper">
            <ArtifactCanvas
              elementIndex={saleData.element_index}
              celestialIndex={saleData.celestial_index}
              logicIndex={saleData.logic_index}
              senderName={saleData.sender_name}
              receiverName={saleData.receiver_name}
              saleId={saleData.sale_id}
            />
          </div>

          {/* Legend Atlas Text Fragments */}
          <div className="legend-fragment-container">
            <div className="legend-section">
              <h3 className="legend-title">ELEMENT</h3>
              <p className="legend-text">
                {LEGEND_ATLAS.elements[saleData.element_index]}
              </p>
            </div>

            <div className="legend-section">
              <h3 className="legend-title">CELESTIAL</h3>
              <p className="legend-text">
                {LEGEND_ATLAS.celestial[saleData.celestial_index]}
              </p>
            </div>

            <div className="legend-section">
              <h3 className="legend-title">LOGIC</h3>
              <p className="legend-text">
                {LEGEND_ATLAS.logic[saleData.logic_index]}
              </p>
            </div>
          </div>

          {/* Verification Hash (Small Print) */}
          <div className="verification-footer">
            <code>{saleData.verify_hash.slice(0, 16)}...{saleData.verify_hash.slice(-16)}</code>
          </div>
        </div>
      )}
    </div>
  );
}
