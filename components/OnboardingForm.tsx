import React, { useState } from 'react';
import { User, Calendar, Weight, Ruler, Heart, Baby, ArrowRight, Sparkles, Target, TrendingUp, TrendingDown, Activity, Dumbbell } from 'lucide-react';

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  weight: number;
  height: number;
  birthdate: string;
  gender: 'male' | 'female';
  isPregnant?: boolean;
  trimester?: '1' | '2' | '3';
  fitnessGoal: 'lose_weight' | 'gain_weight' | 'gain_muscle' | 'maintain' | 'general_fitness';
  targetWeight?: number;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    weight: 0,
    height: 0,
    birthdate: '',
    gender: 'male',
    isPregnant: false,
    trimester: undefined,
    fitnessGoal: 'maintain',
    targetWeight: undefined
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
        newErrors.weight = 'Please enter a valid weight (20-300 kg)';
      }
      if (!formData.height || formData.height < 100 || formData.height > 250) {
        newErrors.height = 'Please enter a valid height (100-250 cm)';
      }
    }

    if (currentStep === 2) {
      if (!formData.birthdate) {
        newErrors.birthdate = 'Please select your birthdate';
      } else {
        const age = calculateAge(formData.birthdate);
        if (age < 13 || age > 120) {
          newErrors.birthdate = 'Please enter a valid birthdate';
        }
      }
    }

    if (currentStep === 4) {
      if (!formData.fitnessGoal) {
        newErrors.fitnessGoal = 'Please select a fitness goal';
      }
      if ((formData.fitnessGoal === 'lose_weight' || formData.fitnessGoal === 'gain_weight') && 
          (!formData.targetWeight || formData.targetWeight < 20 || formData.targetWeight > 300)) {
        newErrors.targetWeight = 'Please enter a valid target weight (20-300 kg)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 4) {
        // Final step - submit
        onComplete(formData);
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">
              Step {step} of 4
            </span>
            <span className="text-xs font-bold text-slate-500">
              {Math.round((step / 4) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100 animate-fade-in">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-4">
              <Sparkles size={14} /> Complete Your Profile
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">
              {step === 1 && 'Physical Metrics'}
              {step === 2 && 'Personal Details'}
              {step === 3 && 'Health Information'}
              {step === 4 && 'Fitness Goals'}
            </h2>
            <p className="text-slate-600 mt-3 font-medium">
              {step === 1 && 'Help us personalize your nutrition goals'}
              {step === 2 && 'Tell us a bit more about yourself'}
              {step === 3 && 'Final step to complete your profile'}
              {step === 4 && 'What do you want to achieve?'}
            </p>
          </div>

          {/* Step 1: Weight & Height */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Weight size={14} /> Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.weight || ''}
                    onChange={(e) => updateFormData('weight', parseFloat(e.target.value))}
                    placeholder="Enter your weight"
                    className={`w-full px-6 py-4 bg-slate-50 border ${
                      errors.weight ? 'border-red-300' : 'border-slate-100'
                    } rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-lg`}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    kg
                  </span>
                </div>
                {errors.weight && (
                  <p className="text-red-600 text-sm font-medium">{errors.weight}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Ruler size={14} /> Height (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => updateFormData('height', parseFloat(e.target.value))}
                    placeholder="Enter your height"
                    className={`w-full px-6 py-4 bg-slate-50 border ${
                      errors.height ? 'border-red-300' : 'border-slate-100'
                    } rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-lg`}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    cm
                  </span>
                </div>
                {errors.height && (
                  <p className="text-red-600 text-sm font-medium">{errors.height}</p>
                )}
              </div>

              {/* BMI Preview */}
              {formData.weight > 0 && formData.height > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mt-6">
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">
                    Your BMI Preview
                  </p>
                  <p className="text-3xl font-black text-emerald-600">
                    {((formData.weight / ((formData.height / 100) ** 2))).toFixed(1)}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    {((formData.weight / ((formData.height / 100) ** 2))) < 18.5 ? 'Underweight' :
                     ((formData.weight / ((formData.height / 100) ** 2))) < 25 ? 'Normal' :
                     ((formData.weight / ((formData.height / 100) ** 2))) < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Birthdate */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => updateFormData('birthdate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-6 py-4 bg-slate-50 border ${
                    errors.birthdate ? 'border-red-300' : 'border-slate-100'
                  } rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-lg`}
                />
                {errors.birthdate && (
                  <p className="text-red-600 text-sm font-medium">{errors.birthdate}</p>
                )}
              </div>

              {/* Age Preview */}
              {formData.birthdate && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-2">
                    Your Age
                  </p>
                  <p className="text-3xl font-black text-blue-600">
                    {calculateAge(formData.birthdate)} years old
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Gender & Pregnancy */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} /> Gender
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      updateFormData('gender', 'male');
                      updateFormData('isPregnant', false);
                      updateFormData('trimester', undefined);
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all font-bold ${
                      formData.gender === 'male'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">👨</div>
                    Male
                  </button>
                  <button
                    onClick={() => updateFormData('gender', 'female')}
                    className={`p-6 rounded-2xl border-2 transition-all font-bold ${
                      formData.gender === 'female'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">👩</div>
                    Female
                  </button>
                </div>
              </div>

              {/* Pregnancy Options (Only for Female) */}
              {formData.gender === 'female' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 p-4 bg-pink-50 border border-pink-200 rounded-2xl">
                    <input
                      type="checkbox"
                      id="pregnant"
                      checked={formData.isPregnant}
                      onChange={(e) => {
                        updateFormData('isPregnant', e.target.checked);
                        if (!e.target.checked) {
                          updateFormData('trimester', undefined);
                        }
                      }}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <label htmlFor="pregnant" className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                      <Baby size={18} className="text-pink-600" />
                      I am currently pregnant
                    </label>
                  </div>

                  {formData.isPregnant && (
                    <div className="space-y-3 animate-fade-in">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Heart size={14} /> Trimester
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['1', '2', '3'].map((tri) => (
                          <button
                            key={tri}
                            onClick={() => updateFormData('trimester', tri as '1' | '2' | '3')}
                            className={`p-4 rounded-2xl border-2 transition-all font-bold ${
                              formData.trimester === tri
                                ? 'border-pink-500 bg-pink-50 text-pink-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {tri === '1' ? '1st' : tri === '2' ? '2nd' : '3rd'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Fitness Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} /> Select Your Goal
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'lose_weight', label: 'Lose Weight', icon: TrendingDown, color: 'rose', emoji: '📉' },
                    { id: 'gain_weight', label: 'Gain Weight', icon: TrendingUp, color: 'blue', emoji: '📈' },
                    { id: 'gain_muscle', label: 'Gain Muscle', icon: Dumbbell, color: 'purple', emoji: '💪' },
                    { id: 'maintain', label: 'Maintain Weight', icon: Target, color: 'emerald', emoji: '🎯' },
                    { id: 'general_fitness', label: 'General Fitness', icon: Activity, color: 'amber', emoji: '⚡' }
                  ].map((goal) => {
                    const Icon = goal.icon;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => {
                          updateFormData('fitnessGoal', goal.id as any);
                          if (goal.id !== 'lose_weight' && goal.id !== 'gain_weight') {
                            updateFormData('targetWeight', undefined);
                          }
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all font-bold flex items-center gap-4 ${
                          formData.fitnessGoal === goal.id
                            ? `border-${goal.color}-500 bg-${goal.color}-50 text-${goal.color}-700`
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-3xl">{goal.emoji}</div>
                        <div className="flex-1 text-left">
                          <div className="font-black">{goal.label}</div>
                        </div>
                        <Icon size={20} />
                      </button>
                    );
                  })}
                </div>
                {errors.fitnessGoal && (
                  <p className="text-red-600 text-sm font-medium">{errors.fitnessGoal}</p>
                )}
              </div>

              {/* Target Weight (Only for Lose/Gain Weight) */}
              {(formData.fitnessGoal === 'lose_weight' || formData.fitnessGoal === 'gain_weight') && (
                <div className="space-y-3 animate-fade-in">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Weight size={14} /> Target Weight (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.targetWeight || ''}
                      onChange={(e) => updateFormData('targetWeight', parseFloat(e.target.value))}
                      placeholder="Enter your target weight"
                      className={`w-full px-6 py-4 bg-slate-50 border ${
                        errors.targetWeight ? 'border-red-300' : 'border-slate-100'
                      } rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-lg`}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      kg
                    </span>
                  </div>
                  {errors.targetWeight && (
                    <p className="text-red-600 text-sm font-medium">{errors.targetWeight}</p>
                  )}

                  {/* Weight Difference Preview */}
                  {formData.targetWeight && formData.weight && (
                    <div className={`border-2 rounded-2xl p-4 ${
                      formData.fitnessGoal === 'lose_weight' 
                        ? 'bg-rose-50 border-rose-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <p className="text-xs font-black uppercase tracking-widest mb-2 ${
                        formData.fitnessGoal === 'lose_weight' ? 'text-rose-700' : 'text-blue-700'
                      }">
                        {formData.fitnessGoal === 'lose_weight' ? 'Weight to Lose' : 'Weight to Gain'}
                      </p>
                      <p className={`text-3xl font-black ${
                        formData.fitnessGoal === 'lose_weight' ? 'text-rose-600' : 'text-blue-600'
                      }`}>
                        {Math.abs(formData.weight - formData.targetWeight).toFixed(1)} kg
                      </p>
                      <p className="text-xs font-medium mt-2 text-slate-600">
                        Current: {formData.weight} kg → Target: {formData.targetWeight} kg
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-5 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-200 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              {step === 4 ? 'Complete Profile' : 'Continue'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
          Your information is securely stored and used only to personalize your experience
        </p>
      </div>
    </div>
  );
};

export default OnboardingForm;
