import React from 'react';
import { TrendingUp, Wrench, Clock, Bell, Sparkles, Zap } from 'lucide-react';

const Predictions = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Advanced Market Analysis",
      description: "Machine learning models analyzing market trends and patterns to provide accurate predictions"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant predictions as market conditions change throughout the day"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Receive alerts when significant prediction changes occur or opportunities arise"
    }
  ];

  const stats = [
    { value: "AI", label: "Powered Analytics" },
    { value: "24/7", label: "Market Monitoring" },
    { value: "100%", label: "Data-Driven" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-xl mb-3 sm:mb-0">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">Predictions</h1>
          </div>
          <p className="text-emerald-200/80 text-lg sm:text-xl max-w-2xl">
            AI-powered epidemic predictions and insights to help you stay ahead
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Under Construction Card */}
        <div className="mb-12 lg:mb-16">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-emerald-500/20 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Icon Section */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-8 sm:p-12 lg:p-16 text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg">
                    <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                System Under Development
              </h2>
              <p className="text-emerald-200/70 text-base sm:text-lg max-w-xl mx-auto">
                Our prediction engine is currently being crafted to deliver exceptional insights
              </p>
            </div>

            {/* Details Section */}
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="space-y-6 sm:space-y-8">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex gap-4 sm:gap-6 group">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all duration-300 border border-emerald-500/20 group-hover:border-emerald-500/40">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-2 text-base sm:text-lg">
                          {feature.title}
                        </h3>
                        <p className="text-emerald-200/70 text-sm sm:text-base leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coming Soon Badge */}
              <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-emerald-500/20">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold text-base sm:text-lg">Coming Soon</span>
                  </div>
                  <p className="text-center text-sm sm:text-base text-emerald-200/60">
                    We're working hard to bring you the best prediction experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div>
          <h3 className="text-center text-white/60 text-sm font-semibold uppercase tracking-widest mb-6 sm:mb-8">
            Capabilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-default"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <p className="text-emerald-200/70 text-sm sm:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;