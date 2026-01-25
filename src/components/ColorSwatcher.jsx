import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Sun, 
  Moon, 
  Lightbulb,
  Eye,
  Palette,
  Sparkles
} from 'lucide-react';

const ColorSwatcher = ({ selectedColor, onColorChange }) => {
  const [lightingMode, setLightingMode] = useState('natural');
  const [isAnimating, setIsAnimating] = useState(false);

  const colors = [
    { 
      name: 'Cloud White', 
      value: '#ffffff', 
      description: 'Pure and pristine',
      mood: 'Fresh & Clean',
      roomPreview: 'bg-white'
    },
    { 
      name: 'Mist Grey', 
      value: '#d4d4d8', 
      description: 'Soft and sophisticated',
      mood: 'Calm & Elegant',
      roomPreview: 'bg-gray-300'
    },
    { 
      name: 'Sage Green', 
      value: '#87a96b', 
      description: 'Nature-inspired tranquility',
      mood: 'Peaceful & Natural',
      roomPreview: 'bg-green-300'
    },
    { 
      name: 'Rose Petal', 
      value: '#fbc4ab', 
      description: 'Warm and romantic',
      mood: 'Cozy & Romantic',
      roomPreview: 'bg-orange-200'
    },
    { 
      name: 'Lavender Dream', 
      value: '#e9d5ff', 
      description: 'Soft and soothing',
      mood: 'Relaxing & Dreamy',
      roomPreview: 'bg-purple-200'
    },
    { 
      name: 'Ocean Blue', 
      value: '#60a5fa', 
      description: 'Cool and refreshing',
      mood: 'Serene & Fresh',
      roomPreview: 'bg-blue-300'
    }
  ];

  const lightingModes = [
    { 
      name: 'Natural', 
      icon: Sun, 
      description: 'Daylight simulation',
      filter: 'brightness(100%) contrast(100%)'
    },
    { 
      name: 'Warm', 
      icon: Lightbulb, 
      description: 'Cozy evening light',
      filter: 'brightness(90%) sepia(20%) saturate(120%)'
    },
    { 
      name: 'Cool', 
      icon: Moon, 
      description: 'Soft moonlight',
      filter: 'brightness(85%) hue-rotate(200deg) saturate(80%)'
    }
  ];

  const handleColorChange = (color) => {
    setIsAnimating(true);
    onColorChange(color.value);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getLightingFilter = () => {
    const mode = lightingModes.find(m => m.name === lightingMode);
    return mode ? mode.filter : 'none';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sleep Canvas Color Swatcher
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how each color transforms your bedroom ambiance
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Room Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphism p-8 rounded-3xl">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Preview</h3>
                
                {/* Lighting Mode Selector */}
                <div className="flex space-x-2 mb-6">
                  {lightingModes.map((mode) => (
                    <motion.button
                      key={mode.name}
                      onClick={() => setLightingMode(mode.name)}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        lightingMode === mode.name 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <mode.icon className={`w-5 h-5 ${
                          lightingMode === mode.name ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                        <span className="text-xs font-medium">{mode.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Room Visualization */}
              <motion.div
                className="relative h-80 rounded-2xl overflow-hidden shadow-2xl"
                style={{ filter: getLightingFilter() }}
                animate={{ backgroundColor: selectedColor }}
                initial={{ backgroundColor: '#ffffff' }}
                transition={{ duration: 0.5 }}
              >
                {/* Room Elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                
                {/* Window */}
                <div className="absolute top-4 right-4 w-20 h-24 bg-white/30 rounded-lg border-2 border-white/50" />
                
                {/* Bed */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    className="w-48 h-32 rounded-t-xl shadow-lg relative"
                    style={{ backgroundColor: selectedColor }}
                    animate={{ 
                      backgroundColor: isAnimating ? [selectedColor, '#ffffff', selectedColor] : selectedColor 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Pillow representations */}
                    <div className="absolute top-2 left-4 w-12 h-8 bg-white/40 rounded" />
                    <div className="absolute top-2 right-4 w-12 h-8 bg-white/40 rounded" />
                    
                    {/* Sheet pattern */}
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded" />
                    <div className="absolute bottom-4 left-2 right-2 h-1 bg-white/20 rounded" />
                  </motion.div>
                </div>

                {/* Side Table */}
                <div className="absolute bottom-8 left-8 w-12 h-16 bg-white/20 rounded-lg" />
                <div className="absolute bottom-8 right-8 w-12 h-16 bg-white/20 rounded-lg" />

                {/* Lighting Effect Overlay */}
                <div 
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                    lightingMode === 'warm' ? 'bg-orange-100/20' : 
                    lightingMode === 'cool' ? 'bg-blue-100/20' : 
                    'bg-transparent'
                  }`}
                />
              </motion.div>

              {/* Color Information */}
              <motion.div
                className="mt-6 p-4 bg-white rounded-xl"
                key={selectedColor}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {colors.find(c => c.value === selectedColor)?.name || 'Selected Color'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {colors.find(c => c.value === selectedColor)?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Mood</div>
                    <div className="text-sm font-medium text-purple-600">
                      {colors.find(c => c.value === selectedColor)?.mood}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Color Palette */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Perfect Shade</h3>
                <p className="text-gray-600">Each color is carefully selected to create the perfect bedroom atmosphere</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {colors.map((color, index) => (
                  <motion.button
                    key={color.value}
                    onClick={() => handleColorChange(color)}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      selectedColor === color.value 
                        ? 'border-purple-500 shadow-xl scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Color Swatch */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div 
                        className="w-16 h-16 rounded-xl shadow-inner border-2 border-gray-200"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">{color.name}</h4>
                        <p className="text-sm text-gray-600">{color.description}</p>
                      </div>
                    </div>

                    {/* Mood Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-purple-600">{color.mood}</span>
                      </div>
                      
                      {selectedColor === color.value && (
                        <motion.div
                          className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </div>

                    {/* Room Preview Mini */}
                    <div className={`mt-4 h-20 rounded-lg ${color.roomPreview} relative overflow-hidden`}>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white/40 rounded-t" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Color Psychology Tips */}
              <motion.div
                className="glassmorphism p-6 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Color Psychology Tips</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
                    <p><strong>White & Light Colors:</strong> Create a sense of space and purity</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
                    <p><strong>Blue & Green Tones:</strong> Promote calmness and better sleep</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
                    <p><strong>Warm Colors:</strong> Add coziness and intimacy to the space</p>
                  </div>
                </div>
              </motion.div>

              {/* Interactive Tip */}
              <motion.div
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Pro Tip</h4>
                </div>
                <p className="text-gray-700">
                  Try different lighting modes to see how your chosen color looks throughout the day. 
                  The same color can feel completely different in natural daylight versus warm evening light!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ColorSwatcher;
