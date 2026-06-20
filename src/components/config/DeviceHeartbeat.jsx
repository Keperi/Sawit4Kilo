import React, { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

const initialDevices = [
  {
    id: 'KDC01',
    name: 'Node KDC01',
    status: 'ONLINE',
    signal: 'LoRa 868 MHz',
    lastPingSeconds: 12,
    location: 'Pit Area A — Kolam Pengendap 1',
    firmware: 'v2.4.1',
    mac: '24:6F:28:DA:11:3C',
  },
  {
    id: 'KDC02',
    name: 'Node KDC02',
    status: 'OFFLINE',
    signal: 'Sinyal Hilang',
    lastPingSeconds: 48,
    location: 'Pit Area B — Kolam Pengendap 2',
    firmware: 'v2.3.8',
    mac: '24:6F:28:DA:44:7B',
  },
];

const DeviceHeartbeat = () => {
  const [devices, setDevices] = useState(initialDevices);

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(d => ({
        ...d,
        lastPingSeconds: d.status === 'ONLINE' ? 12 : d.lastPingSeconds + 1,
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          marginBottom: '12px',
        }}
      >
        Status Live Perangkat
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {devices.map((device) => {
          const isTimedOut = device.lastPingSeconds > 30;
          const isOnline = device.status === 'ONLINE' && !isTimedOut;

          return (
            <Card key={device.id} id={`device-${device.id}`}>
              <div style={{ padding: '16px' }}>
                {/* ── Top Row ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {device.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                      {isOnline && (
                        <span
                          className="animate-ping-slow"
                          style={{
                            position: 'absolute',
                            display: 'inline-flex',
                            width: '100%',
                            height: '100%',
                            borderRadius: '9999px',
                            backgroundColor: 'var(--semantic-safe)',
                            opacity: 0.6,
                          }}
                        />
                      )}
                      <span
                        style={{
                          position: 'relative',
                          display: 'inline-flex',
                          width: '8px',
                          height: '8px',
                          borderRadius: '9999px',
                          backgroundColor: isOnline ? 'var(--semantic-safe)' : 'var(--semantic-offline)',
                        }}
                      />
                    </span>
                    <Badge variant={isOnline ? 'safe' : 'gray'} size="sm">
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </Badge>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-secondary)', margin: '0 -16px 16px', width: 'calc(100% + 32px)' }} />

                {/* ── Info Grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '12px', columnGap: '16px' }}>
                  {[
                    ['Sinyal', device.signal],
                    ['Lokasi', device.location],
                    ['Firmware', device.firmware],
                    ['MAC Address', device.mac],
                    ['Ping Terakhir', isTimedOut ? `RTO: ${device.lastPingSeconds}s (> 30s)` : `${device.lastPingSeconds} dtk lalu`],
                    ['Status Koneksi', isOnline ? 'Sinkronisasi Aktif' : 'Lost Signal'],
                  ].map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: 'var(--color-text-tertiary)',
                        }}
                      >
                        {key}
                      </span>
                      <span
                        style={{
                          fontFamily: 'ui-monospace, "DM Mono", monospace',
                          fontSize: '12px',
                          color: isOnline ? 'var(--color-text-primary)' : 'var(--semantic-offline)',
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceHeartbeat;
