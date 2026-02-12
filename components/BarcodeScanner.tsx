import React, { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, CheckCircle2, AlertCircle, X, Scan, Upload, Video, StopCircle, ArrowRight, ChevronRight, Flame, Zap, Leaf, ArrowLeft } from 'lucide-react';
import { scanAndFetchProduct, fetchFromOpenFoodFacts } from '../services/barcodeService';
import { NutritionInfo, MealLog } from '../types';

interface BarcodeScannerProps {
  onProductLogged: (log: MealLog) => void;
  onBack?: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onProductLogged, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentHeroBg, setCurrentHeroBg] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600"
  ];

  // Background Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroBg(prev => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to results
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg');
    setImage(imageData);
    stopCamera();
    startScan(imageData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setImage(imageData);
        setResult(null);
        setError(null);
        startScan(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async (imageData?: string) => {
    const imgToScan = imageData || image;
    if (!imgToScan) return;

    setScanning(true);
    setError(null);

    try {
      const base64Data = imgToScan.split(',')[1];
      const productInfo = await scanAndFetchProduct(base64Data);
      setResult(productInfo);
    } catch (err: any) {
      setError(err.message || 'Failed to scan barcode. Try manual entry or take a clearer photo.');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleManualSearch = async () => {
    if (!manualBarcode.trim()) return;

    setScanning(true);
    setError(null);

    try {
      console.log('Searching for barcode:', manualBarcode.trim());
      const productInfo = await fetchFromOpenFoodFacts(manualBarcode.trim());
      
      if (!productInfo) {
        throw new Error(`Product with barcode ${manualBarcode} not found in database. This product may not be registered in Open Food Facts yet. Try scanning a different product or use the food scanner for fresh items.`);
      }

      setResult(productInfo);
      setShowManualInput(false);
    } catch (err: any) {
      setError(err.message || 'Product not found in database.');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const confirmLog = () => {
    if (result) {
      onProductLogged({
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000',
        nutrition: result,
      });
      reset();
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setScanning(false);
    setError(null);
    setManualBarcode('');
    setShowManualInput(false);
    stopCamera();
  };

  const isAtStart = !result && !scanning && !cameraActive && !showManualInput && !image;

  return (
    <div className="space-y-8 text-slate-900 font-sans selection:bg-emerald-100 relative">
      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        .food-card-shadow {
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 10px 20px -10px rgba(0, 0, 0, 0.08);
        }
        .bg-overlay {
          background: radial-gradient(circle at center, transparent 0%, rgba(248, 250, 252, 0.4) 40%, rgba(248, 250, 252, 1) 100%);
        }
        @media (min-width: 768px) {
          .bg-overlay {
            left: 16rem;
          }
        }
      `}</style>

      {/* Cinematic Background Layer */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-1000 md:left-64 ${isAtStart ? 'opacity-100' : 'opacity-20'}`}>
        {HERO_IMAGES.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt="background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
              idx === currentHeroBg ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-overlay" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="group bg-white px-6 py-3 rounded-[2rem] font-bold flex items-center gap-3 hover:bg-slate-900 hover:text-white transition-all shadow-lg border border-slate-200 animate-in fade-in slide-in-from-left-4 duration-500"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
        )}

        {/* Header Section */}
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-[2rem] text-emerald-600 mb-2 shadow-lg border border-slate-100">
            <Scan size={40} strokeWidth={2.5} className="animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
            Smart <span className="text-emerald-500 drop-shadow-sm">Scanner</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-md mx-auto font-medium">
            Analyze nutrition instantly with precision.
          </p>
        </header>

        {/* Interaction Area */}
        <main className="space-y-6">
          {cameraActive ? (
            <div className="relative bg-white rounded-[2.5rem] p-3 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-500">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-900">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-[15%] border-2 border-dashed border-emerald-400/50 rounded-2xl" />
                  <div className="absolute left-[15%] right-[15%] h-1.5 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)] animate-scan-line" />
                </div>
                <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8 gap-4">
                  <button 
                    onClick={stopCamera} 
                    className="p-5 bg-white/10 backdrop-blur-xl text-white rounded-3xl hover:bg-white/20 transition-all border border-white/20"
                  >
                    <X size={28} />
                  </button>
                  <button 
                    onClick={captureFromCamera} 
                    className="flex-1 py-5 bg-emerald-500 text-white font-black text-lg rounded-3xl shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Camera size={28} /> Analyze Item
                  </button>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : isAtStart ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-1000">
              <button
                onClick={startCamera}
                className="group relative overflow-hidden bg-white p-10 rounded-[3rem] text-left transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] border border-slate-200 shadow-lg"
              >
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-emerald-500/20">
                  <Video size={32} />
                </div>
                <h3 className="text-2xl font-black mb-3">Live Lens</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Point your camera at any barcode for real-time analysis.
                </p>
                <div className="mt-8 flex items-center text-emerald-600 font-black text-sm gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  START SCANNING <ChevronRight size={18} />
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="group relative overflow-hidden bg-white p-10 rounded-[3rem] text-left transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] border border-slate-200 shadow-lg"
              >
                <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:-rotate-12 transition-transform duration-500 shadow-lg shadow-blue-500/20">
                  <Upload size={32} />
                </div>
                <h3 className="text-2xl font-black mb-3">Gallery</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Have a photo already? Upload it here to see the stats.
                </p>
                <div className="mt-8 flex items-center text-blue-600 font-black text-sm gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  BROWSE PHOTOS <ChevronRight size={18} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </button>

              <button
                onClick={() => setShowManualInput(true)}
                className="md:col-span-2 group py-6 px-10 bg-white rounded-[2.5rem] font-black text-lg flex items-center justify-between hover:bg-slate-900 hover:text-white transition-all active:scale-[0.99] shadow-lg border border-slate-200"
              >
                <span className="flex items-center gap-4">
                  <Scan size={24} className="text-emerald-500 group-hover:text-emerald-400" />
                  Manual Code Entry
                </span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          ) : null}

          {showManualInput && (
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 border border-slate-200">
              <h3 className="text-3xl font-black mb-2">Barcode Entry</h3>
              <p className="text-slate-500 mb-10 font-medium">Type the 8-13 digits found on the packaging.</p>
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value.replace(/\D/g, ''))}
                placeholder="0000000000000"
                maxLength={13}
                className="w-full text-5xl font-mono tracking-widest text-center py-8 bg-white/50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none transition-all placeholder:opacity-10 mb-10 shadow-inner"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowManualInput(false)} 
                  className="flex-1 py-5 bg-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-300 transition-colors"
                >
                  BACK
                </button>
                <button 
                  onClick={handleManualSearch} 
                  disabled={manualBarcode.length < 8 || scanning} 
                  className="flex-[2] py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-600 disabled:opacity-50 transition-all"
                >
                  ANALYZE
                </button>
              </div>
            </div>
          )}

          {scanning && !cameraActive && (
            <div className="bg-white rounded-[3rem] p-16 flex flex-col items-center justify-center gap-8 shadow-2xl text-center border border-slate-200">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                  <Leaf size={40} className="animate-bounce" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-black">Decoding...</h4>
                <p className="text-slate-500 mt-2 font-medium">Pulling data from Global Food Index</p>
              </div>
            </div>
          )}

          {error && !result && (
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-orange-200 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-4">
                <AlertCircle size={32} className="text-orange-500 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-xl font-black text-slate-900 mb-2">Scan Failed</h4>
                  <p className="text-slate-600 font-medium mb-4">{error}</p>
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="px-6 py-3 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all"
                  >
                    Try Manual Entry
                  </button>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div ref={resultRef} className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="relative bg-white rounded-[3.5rem] overflow-hidden food-card-shadow border border-slate-100">
                <div className="relative h-[450px] w-full group">
                  <img 
                    src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} 
                    alt={result.foodName} 
                    className="w-full h-full object-cover transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                  <div className="absolute top-8 right-8">
                    <div className="bg-white px-6 py-5 rounded-[2.5rem] text-center shadow-2xl border border-slate-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 opacity-60 mb-1">Health Score</p>
                      <div className="text-5xl font-black text-slate-900">
                        {result.healthScore}
                        <span className="text-xl opacity-30">/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-12 left-12 right-12">
                    <h3 className="text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">{result.foodName}</h3>
                    <div className="flex items-center gap-4">
                      <span className="px-5 py-2 bg-emerald-500 text-white font-black text-xs rounded-full shadow-lg">
                        SERVING: {result.servingSize}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-12 md:p-16 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] p-8 text-white text-center shadow-2xl shadow-orange-500/30">
                      <Flame className="mx-auto mb-3" size={32} />
                      <p className="text-xs font-black uppercase tracking-widest opacity-70">Calories</p>
                      <p className="text-5xl font-black">{result.calories}</p>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-3 gap-4">
                      {[
                        { label: 'Protein', value: result.protein, color: 'text-blue-600' },
                        { label: 'Carbs', value: result.carbs, color: 'text-amber-600' },
                        { label: 'Fat', value: result.fat, color: 'text-rose-600' }
                      ].map(item => (
                        <div key={item.label} className="bg-slate-50 rounded-[2rem] p-8 text-center border border-slate-100 transition-all hover:bg-white hover:shadow-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                          <p className={`text-3xl font-black ${item.color}`}>{item.value}g</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500" /> Key Benefits
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {result.healthBenefits && result.healthBenefits.map((b, i) => (
                          <div 
                            key={i} 
                            className="px-6 py-3 bg-emerald-50 text-emerald-700 text-sm font-black rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-left-4 duration-500" 
                            style={{ animationDelay: `${i * 150}ms` }}
                          >
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                        <AlertCircle size={20} className="text-orange-500" /> Watch Out
                      </h4>
                      <div className="space-y-3">
                        {result.warnings && result.warnings.map((w, i) => (
                          <div 
                            key={i} 
                            className="px-6 py-3 bg-orange-50 text-orange-700 text-sm font-black rounded-2xl border border-orange-100 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500"
                          >
                            <Zap size={18} className="text-orange-400" /> {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-6">
                    <button 
                      onClick={reset} 
                      className="flex-1 py-6 px-10 bg-slate-100 text-slate-600 font-black rounded-[2rem] hover:bg-slate-200 transition-all active:scale-95"
                    >
                      RESCAN
                    </button>
                    <button 
                      onClick={confirmLog} 
                      className="flex-[2] py-6 px-10 bg-emerald-500 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-emerald-500/30 hover:bg-emerald-400 hover:-translate-y-1 transition-all active:scale-95"
                    >
                      LOG MEAL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center pt-8">
          <div className="inline-flex items-center gap-8 px-10 py-4 bg-white rounded-full text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border border-slate-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> AI Verified
            </span>
            <span className="w-2 h-2 bg-slate-200 rounded-full" />
            <span className="flex items-center gap-2">Gemini 2.5 Flash</span>
            <span className="w-2 h-2 bg-slate-200 rounded-full" />
            <span className="flex items-center gap-2">Global Data</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BarcodeScanner;
