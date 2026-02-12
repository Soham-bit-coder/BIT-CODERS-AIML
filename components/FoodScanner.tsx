import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, AlertCircle, X, ChevronRight, Video, Image as ImageIcon, Sparkles, Zap, Info } from 'lucide-react';
import { MealLog } from '../types';
import { analyzeFoodImage } from '../services/geminiService';

interface FoodScannerProps {
  onMealLogged: (log: MealLog) => void;
}

const MealScoreCard = ({ score }: { score: number }) => (
  <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:shadow-emerald-200/50">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
          <Sparkles size={18} />
        </div>
        <span className="font-bold text-slate-700">Health Score</span>
      </div>
      <span className="text-3xl font-black text-emerald-500">
        {score}
        <span className="text-sm text-slate-400">/100</span>
      </span>
    </div>
    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000 ease-out"
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const FoodScanner: React.FC<FoodScannerProps> = ({ onMealLogged }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const constraints = { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraActive(true);
      setError(null);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      setCameraActive(false);
      setError("Camera access denied. Try uploading a photo instead.");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setCameraActive(false);
  };

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setImage(canvas.toDataURL('image/jpeg'));
    stopCamera();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    
    setAnalyzing(true);
    setError(null);
    
    try {
      // Extract base64 data from data URL
      const base64Data = image.split(',')[1];
      
      // Call Gemini API
      const nutritionData = await analyzeFoodImage(base64Data);
      
      setResult(nutritionData);
    } catch (err: any) {
      console.error('Error analyzing food:', err);
      setError(err.message || 'Failed to analyze food. Please try again.');
      setResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setAnalyzing(false);
    setError(null);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20 md:pb-8">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none md:left-64">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4">
        <header className="text-center space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-emerald-500/20 animate-bounce">
            <Zap size={12} className="md:w-3.5 md:h-3.5" fill="currentColor" /> Gemini Vision 2.0
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-slate-900 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-emerald-800 px-4">
            Smart Meal Scan
          </h2>
          <p className="text-slate-500 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed px-4">
            Harness the power of AI to transform your food photos into detailed nutritional data instantly.
          </p>
        </header>

        {/* Camera Active View */}
        {cameraActive && (
          <div className="relative max-w-3xl mx-auto bg-black rounded-[2rem] md:rounded-[3rem] p-2 md:p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border-4 md:border-8 border-white overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="relative aspect-[4/3] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale-[0.1]" />
              
              {/* Camera Hud */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-6 md:inset-12 border-2 border-white/20 rounded-[1rem] md:rounded-[2rem]" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10" />
                
                {/* Corners */}
                <div className="absolute top-5 md:top-10 left-5 md:left-10 w-8 md:w-12 h-8 md:h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl" />
                <div className="absolute top-5 md:top-10 right-5 md:right-10 w-8 md:w-12 h-8 md:h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl" />
                <div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 w-8 md:w-12 h-8 md:h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl" />
                <div className="absolute bottom-5 md:bottom-10 right-5 md:right-10 w-8 md:w-12 h-8 md:h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl" />
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 flex gap-3 md:gap-4">
              <button 
                onClick={stopCamera} 
                className="p-4 md:p-5 bg-white/10 backdrop-blur-xl text-white rounded-[1.5rem] md:rounded-[2rem] hover:bg-white/20 transition-all active:scale-90 border border-white/10"
              >
                <X size={24} className="md:w-7 md:h-7" />
              </button>
              <button 
                onClick={captureFromCamera}
                className="flex-1 py-4 md:py-5 bg-emerald-500 text-white font-black text-base md:text-xl rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3"
              >
                <Camera size={24} className="md:w-7 md:h-7" /> CAPTURE PHOTO
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Side-by-Side Cinematic Options */}
        {!image && !cameraActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 h-full">
            {/* Option 1: Realistic Camera Card */}
            <div 
              onClick={startCamera}
              className="group relative h-[350px] md:h-[450px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:-translate-y-2 active:scale-95"
            >
              <img 
                src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=800&q=80" 
                alt="Camera background" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/20 to-transparent" />
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between items-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center border border-white/30 shadow-2xl transform transition-transform group-hover:rotate-12">
                  <Video size={32} className="text-white group-hover:animate-pulse md:w-10 md:h-10" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Live Scan</h3>
                  <p className="text-emerald-50 font-semibold opacity-80 text-sm md:text-base">Point your camera at food for instant detection</p>
                  <div className="inline-flex items-center gap-2 px-5 md:px-6 py-2 bg-emerald-500 text-white rounded-full text-xs md:text-sm font-black mt-4 shadow-xl group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                    LAUNCH CAMERA <ChevronRight size={14} className="md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Realistic Upload Card */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-[350px] md:h-[450px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:-translate-y-2 active:scale-95"
            >
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80" 
                alt="Upload background" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between items-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center border border-white/30 shadow-2xl transform transition-transform group-hover:-rotate-12">
                  <ImageIcon size={32} className="text-white md:w-10 md:h-10" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Upload Photo</h3>
                  <p className="text-slate-100 font-semibold opacity-80 text-sm md:text-base">Choose from your high-res food library</p>
                  <div className="inline-flex items-center gap-2 px-5 md:px-6 py-2 bg-white text-slate-900 rounded-full text-xs md:text-sm font-black mt-4 shadow-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    BROWSE FILES <ChevronRight size={14} className="md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        )}

        {/* Preview & Analysis Result View */}
        {image && (
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white">
              <img src={image} alt="Food preview" className="w-full h-auto object-cover" />
              
              {analyzing && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/95 to-teal-600/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
                  <div className="relative">
                    <div className="w-24 h-24 border-8 border-white/30 border-t-white rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" size={40} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-black text-white tracking-tight">Analyzing Meal...</h3>
                    <p className="text-emerald-50 font-semibold">AI is processing nutritional data</p>
                  </div>
                </div>
              )}
            </div>

            {!analyzing && !result && (
              <button 
                onClick={startAnalysis}
                className="w-full py-5 md:py-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg md:text-xl rounded-[2rem] shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3"
              >
                <Sparkles size={20} className="md:w-6 md:h-6" /> ANALYZE WITH AI
              </button>
            )}

            {result && (
              <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <MealScoreCard score={result.healthScore} />

                <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl space-y-4 md:space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{result.foodName}</h3>
                      <p className="text-slate-500 font-semibold text-sm md:text-base">Serving: {result.servingSize}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-3xl md:text-4xl font-black text-emerald-500">{result.calories}</div>
                      <div className="text-xs md:text-sm text-slate-500 font-bold">CALORIES</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {[
                      { label: 'Protein', value: result.protein, unit: 'g', color: 'from-blue-500 to-cyan-500' },
                      { label: 'Carbs', value: result.carbs, unit: 'g', color: 'from-amber-500 to-orange-500' },
                      { label: 'Fat', value: result.fat, unit: 'g', color: 'from-purple-500 to-pink-500' },
                      { label: 'Fiber', value: result.fiber, unit: 'g', color: 'from-green-500 to-emerald-500' }
                    ].map((macro, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 text-center border border-slate-200 hover:shadow-lg transition-all">
                        <div className={`text-3xl font-black bg-gradient-to-r ${macro.color} bg-clip-text text-transparent mb-1`}>
                          {macro.value}{macro.unit}
                        </div>
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">{macro.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 size={18} className="md:w-5 md:h-5" />
                      <h4 className="font-black text-slate-900 text-sm md:text-base">Health Benefits</h4>
                    </div>
                    <ul className="space-y-2">
                      {result.healthBenefits.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm md:text-base">
                          <Sparkles size={14} className="text-emerald-500 mt-1 flex-shrink-0 md:w-4 md:h-4" />
                          <span className="font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.warnings && result.warnings.length > 0 && (
                    <div className="space-y-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle size={18} className="md:w-5 md:h-5" />
                        <h4 className="font-black text-sm md:text-base">Dietary Warnings</h4>
                      </div>
                      <ul className="space-y-2">
                        {result.warnings.map((warning: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-amber-900 text-sm md:text-base">
                            <Info size={14} className="mt-1 flex-shrink-0 md:w-4 md:h-4" />
                            <span className="font-medium">{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button 
                    onClick={reset}
                    className="flex-1 py-4 md:py-5 bg-white border-2 border-slate-200 text-slate-700 font-black text-base md:text-lg rounded-[2rem] hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                  >
                    DISCARD
                  </button>
                  <button 
                    onClick={() => {
                      onMealLogged({
                        id: Date.now().toString(),
                        timestamp: Date.now(),
                        imageUrl: image || '',
                        nutrition: {
                          foodName: result.foodName,
                          servingSize: result.servingSize,
                          calories: result.calories,
                          protein: result.protein,
                          carbs: result.carbs,
                          fat: result.fat,
                          fiber: result.fiber,
                          sugar: result.sugar,
                          healthScore: result.healthScore,
                          ingredients: result.ingredients,
                          healthBenefits: result.healthBenefits,
                          warnings: result.warnings
                        }
                      });
                      reset();
                    }}
                    className="flex-1 py-4 md:py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-base md:text-lg rounded-[2rem] shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3"
                  >
                    <CheckCircle2 size={20} className="md:w-6 md:h-6" /> SAVE TO LOG
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-3xl p-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AlertCircle className="text-red-500 flex-shrink-0" size={28} />
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodScanner;
