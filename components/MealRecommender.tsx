import React, { useState, useEffect } from 'react';
import { 
  Calculator, TrendingUp, TrendingDown, Minus, ChefHat, Apple, Beef, Egg, Fish, 
  Salad, Cookie, AlertCircle, CheckCircle2, Target, Flame, Activity, Droplets, 
  ArrowRight, RefreshCcw, Info, Zap, Sparkles, Brain, ShieldCheck, Eye
} from 'lucide-react';

// Cinematic Image Constants
const MEAL_IMAGES = {
  breakfast: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=800",
  snack: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800",
  lunch: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
  dinner: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
  pregnancy: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
  hero: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1600"
};

const MealRecommender = () => {
  const [step, setStep] = useState('input');
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInput, setUserInput] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    goal: 'maintain',
    activityLevel: 'moderate',
    isPregnant: false,
    trimester: '2',
  });
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const calculateRecommendations = () => {
    const weight = parseFloat(userInput.weight);
    const height = parseFloat(userInput.height);
    const age = parseFloat(userInput.age);
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Optimal';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    let bmr = userInput.gender === 'male' 
      ? (10 * weight + 6.25 * height - 5 * age + 5)
      : (10 * weight + 6.25 * height - 5 * age - 161);

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9,
    };

    const tdee = Math.round(bmr * activityMultipliers[userInput.activityLevel]);
    let targetCalories = tdee;

    if (userInput.isPregnant && userInput.gender === 'female') {
      const pregnancyCalories = { '1': 0, '2': 340, '3': 450 };
      targetCalories += pregnancyCalories[userInput.trimester || '2'];
    } else {
      if (userInput.goal === 'lose') targetCalories = tdee - 500;
      else if (userInput.goal === 'gain') targetCalories = tdee + 500;
    }

    let proteinPercentage = userInput.isPregnant ? 0.35 : 0.3;
    const protein = Math.round((targetCalories * proteinPercentage) / 4);
    const carbs = Math.round((targetCalories * 0.4) / 4);
    const fats = Math.round((targetCalories * (1 - proteinPercentage - 0.4)) / 9);

    const meals = generateMealPlan(userInput.goal, targetCalories, userInput.isPregnant);
    const tips = generateTips(userInput.goal, bmi, bmiCategory, userInput.isPregnant);

    let waterIntake = Math.round(weight * 35);
    if (userInput.isPregnant) waterIntake = Math.max(waterIntake, 2500);

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      bmiCategory,
      tdee,
      targetCalories,
      protein,
      carbs,
      fats,
      meals,
      tips,
      waterIntake,
      pregnancyWarnings: userInput.isPregnant ? getPregnancyWarnings() : [],
      essentialNutrients: userInput.isPregnant ? getEssentialNutrients() : [],
    };
  };

  const getPregnancyWarnings = () => [
    'Avoid raw or undercooked animal products',
    'Do not consume unpasteurized dairy items',
    'Limit caffeine to < 200mg per day',
    'Avoid high-mercury predatory fish',
    'Ensure deli meats are steaming hot'
  ];

  const getEssentialNutrients = () => [
    { name: 'Folic Acid', amount: '800 mcg', reason: 'Neural tube safety' },
    { name: 'Elemental Iron', amount: '27 mg', reason: 'Hemoglobin support' },
    { name: 'Omega-3 DHA', amount: '300 mg', reason: 'Cognitive development' }
  ];

  const generateMealPlan = (goal, calories, isPregnant) => {
    const baseMeals = [
      { 
        name: 'Precision Breakfast', 
        type: 'breakfast', 
        time: '08:00 AM', 
        items: isPregnant 
          ? ['Pasteurized Scrambled Eggs', 'Whole Grain Avocado Toast'] 
          : ['Steel Cut Oats', '2 Cage-Free Eggs'] 
      },
      { 
        name: 'Metabolic Snack', 
        type: 'snack', 
        time: '11:00 AM', 
        items: ['Cultured Greek Yogurt', 'Activated Walnuts'] 
      },
      { 
        name: 'Optimal Lunch', 
        type: 'lunch', 
        time: '01:30 PM', 
        items: ['Grilled Atlantic Salmon', 'Steamed Baby Bok Choy'] 
      },
      { 
        name: 'Regenerative Dinner', 
        type: 'dinner', 
        time: '07:30 PM', 
        items: ['Lean Grass-Fed Beef', 'Mashed Sweet Potato'] 
      }
    ];

    return baseMeals.map(m => ({
      ...m,
      calories: Math.round(calories * (m.type === 'snack' ? 0.15 : 0.283))
    }));
  };

  const generateTips = (goal, bmi, category, isPregnant) => {
    const base = ['Prioritize hydration (alkaline)', 'Sleep 8.5 hours for insulin rest'];
    if (isPregnant) return [...base, 'Consult OBGYN for micro-adjustments', 'Take high-purity prenatal multivitamins'];
    if (goal === 'lose') return [...base, 'Eat fibrous greens first', 'Intermittent fast (14:10)'];
    return base;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecommendation(calculateRecommendations());
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        .hover-lift { 
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); 
        }
        
        .hover-lift:hover { 
          transform: translateY(-5px); 
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 10px 40px -12px rgba(0, 0, 0, 0.1);
        }
        
        .icon-hover-effect { 
          transition: all 0.3s ease; 
        }
        
        .icon-hover-effect:hover { 
          transform: scale(1.1); 
        }
        
        .input-focus-black:focus {
          border-color: black;
          background: white;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }
        
        .hero-banner {
          background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('${MEAL_IMAGES.hero}');
          background-size: cover;
          background-position: center;
          height: 400px;
          border-radius: 0 0 4rem 4rem;
        }
        
        .stagger-1 { animation-delay: 100ms; }
        .stagger-2 { animation-delay: 200ms; }
        .stagger-3 { animation-delay: 300ms; }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1.5rem center;
          background-size: 1rem;
        }
      `}</style>

      {/* High-Color Hero Banner */}
      <div className="hero-banner w-full relative mb-[-80px] shadow-2xl overflow-hidden" style={{ height: '250px' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass-card px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border-none">
            <div className="p-2 bg-black rounded-xl shadow-lg animate-float">
              <Eye className="text-white" size={18} />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-black text-black tracking-tight leading-none mb-0.5">
                Nutri<span className="text-emerald-600">Vision</span>
              </h1>
              <p className="text-black text-[8px] font-black tracking-[0.2em] uppercase opacity-70">
                Scientific Analysis Engine
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
        <div className="flex justify-end mb-6">
          {step === 'results' && (
            <button 
              onClick={() => setStep('input')}
              className="group flex items-center gap-2 px-5 py-2.5 bg-black text-white font-black text-sm rounded-xl shadow-xl hover:bg-emerald-600 transition-all hover-lift active:scale-95 mt-[-30px] relative z-20"
            >
              <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> 
              NEW ANALYSIS
            </button>
          )}
        </div>

        {step === 'input' ? (
          <div className="grid lg:grid-cols-12 gap-6 items-start relative z-10">
            {/* Professional Analysis Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 glass-card rounded-2xl p-6 space-y-6 animate-slide-up">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: 'weight', label: 'Weight', unit: 'KG', placeholder: '00' },
                  { id: 'height', label: 'Height', unit: 'CM', placeholder: '00' },
                  { id: 'age', label: 'Age', unit: 'YRS', placeholder: '00' }
                ].map(field => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-wider ml-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required 
                        placeholder={field.placeholder}
                        value={userInput[field.id]} 
                        onChange={(e) => setUserInput({...userInput, [field.id]: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 input-focus-black rounded-2xl transition-all outline-none font-black text-black placeholder:text-slate-300 text-base"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-black opacity-30 tracking-widest">
                        {field.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-wider ml-1">
                    Gender Identification
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setUserInput({...userInput, gender: 'male', isPregnant: false})}
                      className={`py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
                        userInput.gender === 'male' ? 'bg-white shadow-lg text-black' : 'text-slate-400 hover:text-black'
                      }`}
                    >
                      Male
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setUserInput({...userInput, gender: 'female'})}
                      className={`py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
                        userInput.gender === 'female' ? 'bg-white shadow-lg text-black' : 'text-slate-400 hover:text-black'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-wider ml-1">
                    Daily Activity Level
                  </label>
                  <select 
                    value={userInput.activityLevel} 
                    onChange={(e) => setUserInput({...userInput, activityLevel: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-black/5 transition-all outline-none font-black text-black text-sm cursor-pointer"
                  >
                    <option value="sedentary">Sedentary Profile</option>
                    <option value="light">Active (1-2 Days)</option>
                    <option value="moderate">Consistent (3-5 Days)</option>
                    <option value="active">Performance (Daily)</option>
                  </select>
                </div>
              </div>

              {/* Goal Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-black uppercase tracking-wider ml-1">
                  Physiological Goal
                </label>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { id: 'lose', label: 'Weight Loss', icon: TrendingDown, color: 'text-black' },
                    { id: 'maintain', label: 'Maintenance', icon: Minus, color: 'text-black' },
                    { id: 'gain', label: 'Muscle Gain', icon: TrendingUp, color: 'text-black' }
                  ].map(goal => (
                    <button
                      key={goal.id} 
                      type="button"
                      onClick={() => setUserInput({...userInput, goal: goal.id})}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover-lift ${
                        userInput.goal === goal.id 
                          ? `border-black bg-white shadow-xl` 
                          : 'border-slate-50 bg-slate-50 opacity-40 grayscale'
                      }`}
                    >
                      <goal.icon size={24} className={goal.color} />
                      <span className="font-black text-black text-[9px] uppercase tracking-wider">
                        {goal.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pregnancy Mode */}
              {userInput.gender === 'female' && (
                <div className={`p-6 rounded-2xl border-2 transition-all duration-700 ${
                  userInput.isPregnant ? 'bg-pink-50 border-pink-200' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl transition-all duration-500 ${
                        userInput.isPregnant ? 'bg-black text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        <Zap size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-black uppercase tracking-tight">
                          Pregnancy Protocol
                        </h4>
                        <p className="text-[9px] font-bold text-black opacity-60 uppercase tracking-wider mt-0.5">
                          Maternal Health Tracking
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setUserInput({...userInput, isPregnant: !userInput.isPregnant})}
                      className={`w-12 h-7 rounded-full transition-all relative ${
                        userInput.isPregnant ? 'bg-black' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`absolute top-1 bg-white w-5 h-5 rounded-full transition-all shadow-md ${
                        userInput.isPregnant ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {userInput.isPregnant && (
                    <div className="mt-5 pt-5 border-t border-pink-200 animate-slide-up grid grid-cols-3 gap-3">
                      {['1st', '2nd', '3rd'].map((t, idx) => (
                        <button
                          key={idx} 
                          type="button" 
                          onClick={() => setUserInput({...userInput, trimester: (idx + 1).toString()})}
                          className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
                            userInput.trimester === (idx+1).toString() 
                              ? 'bg-black text-white shadow-xl' 
                              : 'bg-white text-black border-2 border-black/10'
                          }`}
                        >
                          {t} Stage
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-black text-white py-4 rounded-2xl font-black text-base uppercase tracking-wider shadow-2xl hover:bg-emerald-600 transition-all hover-lift active:scale-95 group"
              >
                Execute Analysis 
                <ArrowRight size={18} className="inline ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
            </form>

            {/* Sidebar Branding */}
            <div className="lg:col-span-4 space-y-6 relative z-10">
              <div className="bg-black p-6 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
                <Brain size={32} className="text-white mb-4" />
                <h3 className="text-lg font-black mb-3 uppercase tracking-tight">
                  Precision Logic
                </h3>
                <p className="text-white/60 font-bold leading-relaxed mb-6 text-xs">
                  NutriVision maps physiological data against the <span className="text-white">Mifflin-St Jeor</span> clinical standard for elite-level metabolic reporting.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" size={16} />
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">
                      Verified Methodology
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-none shadow-xl text-center">
                <div className="rounded-xl overflow-hidden mb-4 shadow-2xl">
                  <img 
                    src={userInput.isPregnant ? MEAL_IMAGES.pregnancy : "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800"} 
                    className="w-full h-40 object-cover" 
                    alt="Healthy"
                  />
                </div>
                <h4 className="text-xs font-black text-black mb-2 uppercase tracking-wider">
                  Quality Standard
                </h4>
                <p className="text-[10px] text-black/60 font-bold leading-relaxed italic">
                  "Optimizing metabolic pathways via calculated caloric intake and macronutrient density."
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* RESULTS / REPORT VIEW */
          <div className="space-y-8 animate-fade-in relative z-10">
            {/* Results Title */}
            <div className="text-center md:text-left mb-3">
              <h2 className="text-2xl font-black text-black tracking-tighter uppercase">
                Nutrition Report
              </h2>
              <div className="w-16 h-1.5 bg-black mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Metabolic BMI', val: recommendation.bmi, sub: recommendation.bmiCategory, icon: Eye, color: 'bg-black' },
                { label: 'Caloric Cap', val: recommendation.targetCalories, sub: 'Daily Target', icon: Flame, color: 'bg-black' },
                { label: 'Expenditure', val: recommendation.tdee, sub: 'Daily Burn', icon: Zap, color: 'bg-black' },
                { label: 'Liquid Goal', val: `${(recommendation.waterIntake/1000).toFixed(1)}L`, sub: 'Hydration', icon: Droplets, color: 'bg-black' }
              ].map((stat, i) => (
                <div key={i} className={`glass-card p-5 rounded-2xl hover-lift group shadow-xl stagger-${i+1} animate-slide-up`}>
                  <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-2xl group-hover:scale-110 transition-all`}>
                    <stat.icon size={18} />
                  </div>
                  <p className="text-[9px] font-black text-black uppercase tracking-wider opacity-40 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-black leading-none tracking-tighter">
                    {stat.val}
                  </p>
                  <p className="text-[9px] font-black text-emerald-600 mt-2 uppercase tracking-wider">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="glass-card p-12 rounded-[3.5rem] shadow-2xl h-fit border-none">
                <h3 className="text-xl font-black text-black mb-12 uppercase tracking-[0.2em] border-b-2 border-slate-50 pb-6">
                  Target Macros
                </h3>
                <div className="space-y-10">
                  {[
                    { label: 'Protein', val: recommendation.protein, color: 'bg-black', icon: Beef, pc: '30%' },
                    { label: 'Carbohydrates', val: recommendation.carbs, color: 'bg-black', icon: Cookie, pc: '40%' },
                    { label: 'Healthy Fats', val: recommendation.fats, color: 'bg-black', icon: Fish, pc: '30%' }
                  ].map((m, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-4">
                        <span className="font-black text-black uppercase text-[10px] tracking-[0.1em]">
                          {m.label}
                        </span>
                        <span className="font-black text-black text-xl">
                          {m.val}g
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${m.color} transition-all duration-1000 w-0`} 
                          style={{ width: isLoaded ? m.pc : '0%' }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-10">
                <h3 className="text-2xl font-black text-black flex items-center gap-4 uppercase tracking-[0.15em]">
                  <ChefHat size={32} /> Vision Meal Protocol
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {recommendation.meals.map((meal, idx) => (
                    <div key={idx} className={`group glass-card rounded-[3rem] shadow-2xl overflow-hidden hover-lift border-none`}>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={MEAL_IMAGES[meal.type]} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          alt={meal.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-8 text-white">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2">
                            {meal.time}
                          </p>
                          <h4 className="font-black text-2xl uppercase tracking-tighter">
                            {meal.name}
                          </h4>
                        </div>
                        <div className="absolute top-6 right-6 bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-black shadow-2xl">
                          {meal.calories} KCAL
                        </div>
                      </div>
                      <div className="p-10">
                        <ul className="space-y-4">
                          {meal.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-xs font-black text-black uppercase tracking-wider">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scientific Verification */}
            <div className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 flex flex-col md:flex-row items-center gap-10 shadow-inner">
              <div className="p-6 bg-white rounded-[2rem] shadow-2xl group hover-lift">
                <ShieldCheck className="text-black group-hover:text-emerald-500 transition-colors" size={48} />
              </div>
              <div>
                <h4 className="text-lg font-black text-black uppercase tracking-widest mb-2">
                  Scientific Integrity Disclaimer
                </h4>
                <p className="text-[10px] text-black/50 leading-relaxed font-black uppercase tracking-widest">
                  NutriVision is an advanced data-driven tool for physiological optimization. Biometric accuracy is subject to user input precision. Consultation with clinical nutritionists is recommended for individuals with metabolic pathologies or during gestational periods.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealRecommender;
