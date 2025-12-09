import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Pill, Droplet, Footprints, Dumbbell, Scale } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const HealthAnalysisCarousel = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const sleepData = [
    { day: 'Mon', hours: 7.5, quality: 85 },
    { day: 'Tue', hours: 6.8, quality: 72 },
    { day: 'Wed', hours: 8.2, quality: 92 },
    { day: 'Thu', hours: 7.1, quality: 78 },
    { day: 'Fri', hours: 6.5, quality: 68 }, 
    { day: 'Sat', hours: 9.1, quality: 95 },
    { day: 'Sun', hours: 8.7, quality: 88 }
  ];

  const medicineData = [
    { time: '8:00', taken: 1, scheduled: 1 },
    { time: '12:00', taken: 1, scheduled: 1 },
    { time: '16:00', taken: 0, scheduled: 1 },
    { time: '20:00', taken: 1, scheduled: 1 }
  ];

  const waterData = [
    { hour: '6AM', glasses: 1 },
    { hour: '9AM', glasses: 2 },
    { hour: '12PM', glasses: 3 },
    { hour: '3PM', glasses: 2 },
    { hour: '6PM', glasses: 2 },
    { hour: '9PM', glasses: 1 }
  ];

  const stepsData = [
    { day: 'Mon', steps: 8500 },
    { day: 'Tue', steps: 12300 },
    { day: 'Wed', steps: 9800 },
    { day: 'Thu', steps: 15200 },
    { day: 'Fri', steps: 7600 },
    { day: 'Sat', steps: 18900 },
    { day: 'Sun', steps: 11400 }
  ];

  const workoutData = [
    { exercise: 'Cardio', minutes: 45, color: '#A855F7' },
    { exercise: 'Strength', minutes: 30, color: '#EC4899' },
    { exercise: 'Yoga', minutes: 25, color: '#8B5CF6' }
  ];

  const weightData = [
    { week: 'W1', weight: 75.2 },
    { week: 'W2', weight: 74.8 },
    { week: 'W3', weight: 74.5 },
    { week: 'W4', weight: 74.1 },
    { week: 'W5', weight: 73.9 },
    { week: 'W6', weight: 73.6 }
  ];

  const pages = [
    {
      title: "Sleep Analysis",
      icon: <Moon className="w-5 h-5" />,
      color: "from-indigo-500 to-purple-600",
      component: (
        <div className="h-full flex flex-col space-y-3">
          <div className="bg-white/10 rounded-lg p-3 flex-1 min-h-0">
            <h3 className="text-sm font-semibold mb-2 text-white">Sleep Hours & Quality</h3>
            <div className="h-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="day" stroke="white" fontSize={10} />
                  <YAxis stroke="white" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px'
                    }} 
                  />
                  <Line type="monotone" dataKey="hours" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', strokeWidth: 1, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">7.7h</div>
              <div className="text-xs text-white/70">Avg Sleep</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">82%</div>
              <div className="text-xs text-white/70">Avg Quality</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">6</div>
              <div className="text-xs text-white/70">Good Nights</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Medicine Analysis",
      icon: <Pill className="w-5 h-5" />,
      color: "from-green-500 to-teal-600",
      component: (
        <div className="h-full flex flex-col space-y-3">
          <div className="bg-white/10 rounded-lg p-3 flex-1 min-h-0">
            <h3 className="text-sm font-semibold mb-2 text-white">Daily Medicine Schedule</h3>
            <div className="h-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medicineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="time" stroke="white" fontSize={10} />
                  <YAxis stroke="white" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="scheduled" fill="rgba(255,255,255,0.3)" name="Scheduled" />
                  <Bar dataKey="taken" fill="#10B981" name="Taken" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">75%</div>
              <div className="text-xs text-white/70">Adherence</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">3/4</div>
              <div className="text-xs text-white/70">Taken Today</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">1</div>
              <div className="text-xs text-white/70">Missed</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Water Analysis",
      icon: <Droplet className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-600",
      component: (
        <div className="h-full flex flex-col space-y-3">
          <div className="bg-white/10 rounded-lg p-3 flex-1 min-h-0">
            <h3 className="text-sm font-semibold mb-2 text-white">Daily Water Intake</h3>
            <div className="h-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="hour" stroke="white" fontSize={10} />
                  <YAxis stroke="white" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="glasses" stroke="#06B6D4" fill="rgba(6,182,212,0.3)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">11</div>
              <div className="text-xs text-white/70">Glasses Today</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">2.7L</div>
              <div className="text-xs text-white/70">Total Volume</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">137%</div>
              <div className="text-xs text-white/70">Goal Achieved</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Steps Analysis",
      icon: <Footprints className="w-5 h-5" />,
      color: "from-orange-500 to-red-600",
      component: (
        <div className="h-full flex flex-col space-y-3">
          <div className="bg-white/10 rounded-lg p-3 flex-1 min-h-0">
            <h3 className="text-sm font-semibold mb-2 text-white">Weekly Steps</h3>
            <div className="h-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="day" stroke="white" fontSize={10} />
                  <YAxis stroke="white" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="steps" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">12,257</div>
              <div className="text-xs text-white/70">Today's Steps</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">11,811</div>
              <div className="text-xs text-white/70">Daily Average</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">5</div>
              <div className="text-xs text-white/70">Goals Met</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Workout Analysis",
      icon: <Dumbbell className="w-5 h-5" />,
      color: "from-purple-500 to-pink-600",
      component: (
        <div className="h-full flex flex-col space-y-3">
          <div className="bg-white/10 rounded-lg p-3 flex-1 min-h-0">
            <h3 className="text-sm font-semibold mb-2 text-white">Weekly Workout Distribution</h3>
            <div className="h-full pb-4 flex">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workoutData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({exercise, minutes}) => `${exercise}\n${minutes}min`}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="minutes"
                    >
                      {workoutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                      formatter={(value, name, props) => [
                        `${value} minutes`, 
                        props.payload.exercise
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">Cardio</div>
              <div className="text-xs text-white/70">45 min</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">Strength</div>
              <div className="text-xs text-white/70">30 min</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">Yoga</div>
              <div className="text-xs text-white/70">25 min</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Weight Analysis",
      icon: <Scale className="w-5 h-5" />,
      color: "from-teal-500 to-blue-600",
      component: (
        <div className="h-full flex flex-col space-y-3">
          <div className="bg-white/10 rounded-lg p-3 flex-1 min-h-0">
            <h3 className="text-sm font-semibold mb-2 text-white">Weight Progress</h3>
            <div className="h-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="week" stroke="white" fontSize={10} />
                  <YAxis stroke="white" fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.9)', 
                      border: '1px solid rgba(255,255,255,0.2)', 
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value} kg`, 'Weight']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#14B8A6" 
                    strokeWidth={3} 
                    dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#14B8A6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">73.6kg</div>
              <div className="text-xs text-white/70">Current Weight</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">-1.6kg</div>
              <div className="text-xs text-white/70">Total Loss</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold text-white">2.1%</div>
              <div className="text-xs text-white/70">Body Fat</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <div className="w-full h-full">
      <div className="relative h-full">
        {/* Carousel Container */}
        <div className={`rounded-2xl overflow-hidden bg-gradient-to-br ${pages[currentPage].color} h-full flex flex-col`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="text-white">
                {pages[currentPage].icon}
              </div>
              <h1 className="text-lg font-bold text-white">{pages[currentPage].title}</h1>
            </div>
            <div className="text-white/70 text-xs">
              {currentPage + 1} / {pages.length}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 min-h-0">
            {pages[currentPage].component}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevPage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={nextPage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysisCarousel;