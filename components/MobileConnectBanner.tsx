import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, X } from 'lucide-react';

const MobileConnectBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [networkUrl, setNetworkUrl] = useState('');

  useEffect(() => {
    // Only show on desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile && window.location.hostname === 'localhost') {
      setShowBanner(true);
      // Try to get network URL from current location
      const port = window.location.port || '3000';
      setNetworkUrl(`Check your terminal for the network URL and QR code`);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md">
        <div className="bg-white/20 p-2 rounded-lg animate-pulse">
          <Smartphone size={20} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Connect Your Phone!</p>
          <p className="text-xs opacity-90">{networkUrl}</p>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default MobileConnectBanner;
