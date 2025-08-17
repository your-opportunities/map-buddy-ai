import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Bot, User } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSparks, setShowSparks] = useState(false);

  const steps = [
    { icon: MapPin, text: 'Loading Map Buddy AI', delay: 800 },
    { icon: Bot, text: 'Initializing AI Assistant', delay: 1000 },
    { icon: User, text: 'Preparing Your Experience', delay: 1200 },
    { icon: Sparkles, text: 'Ready to Explore!', delay: 1500 }
  ];

  useEffect(() => {
    // Start spark animation after a short delay
    const sparkTimer = setTimeout(() => {
      setShowSparks(true);
    }, 300);

    // Step through the loading sequence
    const stepTimer = setTimeout(() => {
      setCurrentStep(1);
    }, steps[0].delay);

    const step2Timer = setTimeout(() => {
      setCurrentStep(2);
    }, steps[0].delay + steps[1].delay);

    const step3Timer = setTimeout(() => {
      setCurrentStep(3);
    }, steps[0].delay + steps[1].delay + steps[2].delay);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, steps[0].delay + steps[1].delay + steps[2].delay + steps[3].delay);

    return () => {
      clearTimeout(sparkTimer);
      clearTimeout(stepTimer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const Spark = ({ delay = 0 }: { delay?: number }) => (
    <div
      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: '2s'
      }}
    />
  );

  const SparkTrail = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}ms`
      }}
    >
      <div className="relative">
        <Spark delay={0} />
        <Spark delay={200} />
        <Spark delay={400} />
        <Spark delay={600} />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Sparks animation */}
      {showSparks && (
        <>
          <SparkTrail x={20} y={30} delay={0} />
          <SparkTrail x={80} y={20} delay={500} />
          <SparkTrail x={15} y={70} delay={1000} />
          <SparkTrail x={85} y={80} delay={1500} />
          <SparkTrail x={50} y={10} delay={2000} />
          <SparkTrail x={10} y={50} delay={2500} />
          <SparkTrail x={90} y={60} delay={3000} />
          <SparkTrail x={40} y={90} delay={3500} />
        </>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo with sparkle effect */}
        <div className="relative mb-8">
          <div className="p-6 bg-gradient-primary rounded-3xl w-24 h-24 mx-auto mb-4 animate-bounce">
            <MapPin className="w-12 h-12 text-primary-foreground" />
          </div>
          
          {/* Sparkle effects around logo */}
          {showSparks && (
            <>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            </>
          )}
        </div>

        {/* App title */}
        <h1 className="text-4xl font-bold text-foreground mb-2 animate-fade-in">
          Map Buddy AI
        </h1>
        
        {/* Loading steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center justify-center gap-3 transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 
                  isCompleted ? 'opacity-60 scale-95' : 'opacity-30 scale-90'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-primary/20 text-primary' :
                  isCompleted ? 'bg-green-500/20 text-green-500' :
                  'bg-secondary/20 text-muted-foreground'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive ? 'text-foreground' :
                  isCompleted ? 'text-green-500' :
                  'text-muted-foreground'
                }`}>
                  {step.text}
                </span>
                {isActive && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                )}
                {isCompleted && (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-secondary/30 rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%`
            }}
          />
        </div>

        {/* Floating sparkles */}
        {showSparks && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2000}ms`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
