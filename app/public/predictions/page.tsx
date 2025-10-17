import React from 'react';
import { TrendingUp, Wrench, Clock, Bell } from 'lucide-react';

const Predictions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
          </div>
          <p className="text-gray-600">AI-powered market predictions and insights</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Under Construction Message */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Icon Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mb-6">
                <Wrench className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                System Under Development
              </h2>
              <p className="text-gray-600">
                Our prediction engine is currently being built
              </p>
            </div>

            {/* Details Section */}
            <div className="p-8">
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Advanced Market Analysis
                    </h3>
                    <p className="text-sm text-gray-600">
                      Machine learning models analyzing market trends and patterns to provide accurate predictions
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Real-time Updates
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get instant predictions as market conditions change throughout the day
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Smart Notifications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Receive alerts when significant prediction changes occur or opportunities arise
                    </p>
                  </div>
                </div>
              </div>

              {/* Coming Soon Badge */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Coming Soon</span>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  We're working hard to bring you the best prediction experience
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">AI</div>
              <p className="text-sm text-gray-600">Powered Analytics</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">24/7</div>
              <p className="text-sm text-gray-600">Market Monitoring</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">100%</div>
              <p className="text-sm text-gray-600">Data-Driven</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;