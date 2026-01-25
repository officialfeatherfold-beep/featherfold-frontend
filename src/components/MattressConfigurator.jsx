import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bed, 
  Ruler, 
  CheckCircle,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

const MattressConfigurator = ({ 
  selectedType, 
  mattressThickness, 
  onTypeChange, 
  onThicknessChange 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTypeChange = (type) => {
    setIsAnimating(true);
    setTimeout(() => {
      onTypeChange(type);
      setIsAnimating(false);
    }, 300);
  };

  const handleThicknessChange = (thickness) => {
    setIsAnimating(true);
    setTimeout(() => {
      onThicknessChange(thickness);
      setIsAnimating(false);
    }, 300);
  };

  const bedHeight = 100 + (mattressThickness * 10);
  const sheetFit = selectedType === 'fitted' ? 'perfect' : 'standard';

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart-Fit Mattress Configurator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualize how your FeatherFold sheet will fit your mattress perfectly
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Bed Visualization */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphism p-8 rounded-3xl">
              <div className="relative h-96 flex items-end justify-center">
                {/* Bed Frame */}
                <div className="absolute bottom-0 w-64 h-8 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg" />
                
                {/* Mattress */}
                <motion.div
                  className="relative w-56 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg shadow-lg"
                  style={{ height: `${bedHeight}px` }}
                  animate={{ height: isAnimating ? [bedHeight, bedHeight + 20, bedHeight] : bedHeight }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Sheet */}
                  <motion.div
                    className={`absolute inset-0 ${
                      selectedType === 'fitted' 
                        ? 'bg-gradient-to-t from-purple-200 to-purple-100' 
                        : 'bg-gradient-to-t from-blue-200 to-blue-100'
                    } rounded-t-lg border-2 border-purple-300`}
                    animate={{ 
                      y: selectedType === 'fitted' ? 0 : -10,
                      scale: selectedType === 'fitted' ? 1 : 1.05
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Sheet Details */}
                    <div className="absolute top-4 left-4 right-4">
                      <div className="h-1 bg-purple-300 rounded-full mb-2" />
                      <div className="h-1 bg-purple-300 rounded-full w-3/4" />
                    </div>
                  </motion.div>
                  
                  {/* Mattress Thickness Indicator */}
                  <div className="absolute right-0 top-0 bottom-0 flex items-center">
                    <div className="bg-white px-2 py-1 rounded-l-lg shadow-md">
                      <span className="text-xs font-medium text-gray-700">{mattressThickness}"</span>
                    </div>
                  </div>
                </motion.div>

                {/* Pillows */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <div className="w-16 h-12 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-md" />
                  <div className="w-16 h-12 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-md" />
                </div>
              </div>

              {/* Fit Status */}
              <motion.div
                className={`mt-6 p-4 rounded-xl text-center ${
                  sheetFit === 'perfect' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className={`w-5 h-5 ${
                    sheetFit === 'perfect' ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                  <span className={`font-medium ${
                    sheetFit === 'perfect' ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {sheetFit === 'perfect' ? 'Perfect Fit Guaranteed' : 'Standard Fit'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedType === 'fitted' 
                    ? `360° elastic ensures no messy bunching on your ${mattressThickness}" mattress`
                    : `Traditional style with elastic corners for your ${mattressThickness}" mattress`
                  }
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Configuration Controls */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {/* Sheet Type Selection */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Sheet Type</h3>
                <div className="grid grid-cols-2 gap-6">
                  <motion.button
                    onClick={() => handleTypeChange('flat')}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedType === 'flat' 
                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <Maximize2 className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Flat Sheet</h4>
                      <p className="text-sm text-gray-600">Traditional style with elastic corners</p>
                      <div className="mt-3 flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        <span className="text-xs text-gray-500 ml-2">Easy to tuck</span>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleTypeChange('fitted')}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedType === 'fitted' 
                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                        <Minimize2 className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Fitted Sheet</h4>
                      <p className="text-sm text-gray-600">360° elastic for perfect fit</p>
                      <div className="mt-3 flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-xs text-purple-600 ml-2">Recommended</span>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Mattress Thickness Slider */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Mattress Thickness</h3>
                <div className="glassmorphism p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">6 inches</span>
                    <div className="flex items-center space-x-2">
                      <Ruler className="w-5 h-5 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-600">{mattressThickness}"</span>
                    </div>
                    <span className="text-sm text-gray-600">10 inches</span>
                  </div>
                  
                  <input
                    type="range"
                    min="6"
                    max="10"
                    value={mattressThickness}
                    onChange={(e) => handleThicknessChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((mattressThickness - 6) / 4) * 100}%, #e5e7eb ${((mattressThickness - 6) / 4) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  
                  <div className="flex justify-between mt-4">
                    {[6, 7, 8, 9, 10].map((thickness) => (
                      <motion.button
                        key={thickness}
                        onClick={() => handleThicknessChange(thickness)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          mattressThickness === thickness 
                            ? 'border-purple-500 bg-purple-100 text-purple-700 font-semibold' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {thickness}"
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compatibility Info */}
              <motion.div
                className="glassmorphism p-6 rounded-2xl border border-green-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Perfect Fit Guarantee</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Fits mattresses up to {selectedType === 'fitted' ? '12' : '10'} inches deep</li>
                      <li>• {selectedType === 'fitted' ? '360° elastic' : 'Deep pockets'} ensures secure fit</li>
                      <li>• No messy bunching or slipping during sleep</li>
                      <li>• Easy to put on and remove</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Recommendation */}
              <motion.div
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Bed className="w-6 h-6 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Our Recommendation</h4>
                </div>
                <p className="text-gray-700 mb-3">
                  Based on your {mattressThickness}" mattress, we recommend the 
                  <span className="font-semibold text-purple-600"> {selectedType} sheet</span> for the best sleeping experience.
                </p>
                <div className="flex items-center space-x-2 text-sm text-purple-600">
                  <span>Learn more about sheet types</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MattressConfigurator;
