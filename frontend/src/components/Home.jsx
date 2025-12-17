"use client";
import React, { useState } from 'react';
import { 
  Utensils, 
  Weight, 
  Activity, 
  Footprints, 
  Moon, 
  Droplets, 
  Plus,
  Gift,
  ArrowRight,
  Target
} from 'lucide-react';

const HealthTrackerDashboard = () => {
  const [trackedItems, setTrackedItems] = useState({
    food: { calories: 1850, protein: 0, carb: 0, fat: 0, fibre: 0 },
    weight: { current: 0, goal: 10, unit: 'kg' },
    workout: { goal: 372, unit: 'cal' },
    steps: { autoTracking: true },
    sleep: { goalSet: true },
    water: { goal: 8, unit: 'glasses' }
  });

  const TrackerCard = ({ icon, title, subtitle, children, hasToggle = false, isActive = false, size = 'normal' }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
      size === 'large' ? 'col-span-2' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {hasToggle && (
          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
            isActive ? 'bg-teal-500 border-teal-500' : 'border-gray-300'
          }`}>
            {isActive && <div className="w-3 h-3 bg-white rounded-full" />}
          </div>
        )}
        {!hasToggle && (
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>
      {children}
    </div>
  );

  const MacroStat = ({ label, value, unit = '%' }) => (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-500">{value}{unit}</p>
    </div>
  );

  return (
    <div className="bg-gray-50 p-8 max-w-screen-xl mx-auto rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Trackers</h1>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Trackers */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Food Tracker - Large Card */}
            <TrackerCard
              icon={<Utensils className="w-6 h-6 text-gray-600" />}
              title="Track Food"
              subtitle="Eat 1,850 cal"
              size="large"
            >
              {/* Intermittent Fasting Banner */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-teal-500 rounded-full" />
                  </div>
                  <span className="font-medium text-gray-700">Want to start Intermittent Fasting?</span>
                </div>
                <ArrowRight className="w-5 h-5 text-teal-600" />
              </div>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-8">
                <MacroStat label="Protein" value="0" />
                <MacroStat label="Carb" value="0" />
                <MacroStat label="Fat" value="0" />
                <MacroStat label="Fibre" value="0" />
              </div>
            </TrackerCard>

            {/* New Year Gift Banner */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <Gift className="w-8 h-8 text-teal-600" />
                <span className="font-medium text-gray-700 text-lg">Click to Unlock Your New Year Gift</span>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-orange-600">3</span>
              </div>
            </div>

            {/* Secondary Trackers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrackerCard
                icon={<Weight className="w-6 h-6 text-gray-600" />}
                title="Weight"
                subtitle="0 kg of 10 kg Lost"
              />
              
              <TrackerCard
                icon={<Activity className="w-6 h-6 text-gray-600" />}
                title="Workout"
                subtitle="Goal: 372 cal"
              />
              
              <TrackerCard
                icon={<Footprints className="w-6 h-6 text-gray-600" />}
                title="Steps"
                subtitle="Set Up Auto-Tracking"
                hasToggle={true}
                isActive={true}
              />
              
              <TrackerCard
                icon={<Moon className="w-6 h-6 text-gray-600" />}
                title="Sleep"
                subtitle="Set Up Sleep Goal"
              />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrackerCard
                icon={<Droplets className="w-6 h-6 text-gray-600" />}
                title="Water"
                subtitle="Goal: 8 glasses"
              />
              
              {/* Track More Button */}
              <button className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                <Plus className="w-6 h-6 text-teal-600" />
                <span className="font-medium text-gray-700 text-lg">Track More</span>
              </button>
            </div>
          </div>

          {/* Right Column - Today's Logs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">Today's Logs</h2>
                <button className="bg-teal-500 text-white rounded-full p-3 hover:bg-teal-600 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Icons Display */}
              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-32">
                  {/* Food Icon */}
                  <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center absolute left-0 top-0">
                    <Utensils className="w-10 h-10 text-orange-600" />
                  </div>
                  {/* Activity Icon */}
                  <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center absolute left-8 top-12">
                    <Activity className="w-10 h-10 text-purple-600" />
                  </div>
                  {/* Sleep Icon */}
                  <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center absolute right-0 top-4">
                    <Moon className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Nothing Tracked Yet!</h3>
                <p className="text-gray-500 leading-relaxed">
                  Log your meal, workout, water or sleep for detailed feedback & suggestions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTrackerDashboard;  