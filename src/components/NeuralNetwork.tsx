import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralNetworkProps {
  mode: 'idle' | 'training' | 'gameplay';
  targetAccuracy?: number;
  classBalance?: number;
}

// Node coordinates
const LAYERS = [
  {
    name: 'input',
    x: 100,
    nodes: [110, 190, 270, 350],
    labels: ['Clarity', 'Relevance', 'Resolution', 'Noise Level'],
    color: '#4285F4' // Google Blue
  },
  {
    name: 'hidden1',
    x: 300,
    nodes: [70, 130, 190, 250, 310, 370],
    labels: [],
    color: '#818CF8' // Indigo
  },
  {
    name: 'hidden2',
    x: 500,
    nodes: [90, 155, 220, 285, 350],
    labels: [],
    color: '#A78BFA' // Purple
  },
  {
    name: 'output',
    x: 700,
    nodes: [160, 280],
    labels: ['Cat Probability', 'Dog Probability'],
    color: '#34A853' // Google Green
  }
];

export const NeuralNetwork: React.FC<NeuralNetworkProps> = ({
  mode,
  targetAccuracy = 92,
  classBalance = 100
}) => {
  const [phase, setPhase] = useState<number>(0);
  const [accuracyVal, setAccuracyVal] = useState<number>(20);
  const [catProb, setCatProb] = useState<number>(50);
  const [dogProb, setDogProb] = useState<number>(50);

  // Run training animation phases if mode is 'training'
  useEffect(() => {
    if (mode !== 'training') {
      setPhase(0);
      return;
    }

    // Phases timeline (Total 8 seconds)
    // Phase 1 (0s - 1.5s): Input nodes activate
    // Phase 2 (1.5s - 3.5s): Hidden 1 activates, particles flow Input -> H1
    // Phase 3 (3.5s - 5.5s): Hidden 2 activates, particles flow H1 -> H2
    // Phase 4 (5.5s - 7s): Output nodes activate, particles flow H2 -> Output
    // Phase 5 (7s - 8s): Target accuracy and confidence probabilities reveal
    setPhase(1);

    const t1 = setTimeout(() => setPhase(2), 1500);
    const t2 = setTimeout(() => setPhase(3), 3500);
    const t3 = setTimeout(() => setPhase(4), 5500);
    const t4 = setTimeout(() => setPhase(5), 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [mode]);

  // Accuracy and output probabilities counting effect in Phase 5
  useEffect(() => {
    if (phase === 5) {
      // Animate accuracy from 20% to target accuracy
      const duration = 1000; // 1s
      const startTime = performance.now();

      // Dog vs Cat prediction skews based on class balance
      // If classBalance is 100, they get roughly equal representations (50/50)
      // If classBalance is lower, it skews the classifier outputs
      const dogTarget = classBalance >= 80 ? 48 + Math.random() * 4 : 85 - (classBalance * 0.4);
      const catTarget = 100 - dogTarget;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Eased progress
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const currentAcc = Math.round(20 + easedProgress * (targetAccuracy - 20));
        const currentCat = Math.round(50 + easedProgress * (catTarget - 50));
        const currentDog = Math.round(50 + easedProgress * (dogTarget - 50));

        setAccuracyVal(currentAcc);
        setCatProb(currentCat);
        setDogProb(currentDog);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setAccuracyVal(20);
      setCatProb(50);
      setDogProb(50);
    }
  }, [phase, targetAccuracy, classBalance]);

  // Helper to check if a node/layer is active in the current phase
  const isNodeActive = (layerIdx: number) => {
    if (mode === 'idle') return true;
    if (mode === 'gameplay') return true;
    
    // In training mode, activate step-by-step
    if (phase === 1 && layerIdx === 0) return true;
    if (phase === 2 && layerIdx <= 1) return true;
    if (phase === 3 && layerIdx <= 2) return true;
    if (phase >= 4) return true;
    return false;
  };

  const isConnectionActive = (fromLayerIdx: number) => {
    if (mode === 'idle') return true;
    if (mode === 'gameplay') return true;

    if (phase === 2 && fromLayerIdx === 0) return true;
    if (phase === 3 && fromLayerIdx === 1) return true;
    if (phase >= 4 && fromLayerIdx === 2) return true;
    return false;
  };

  // Generate connection paths and flow particles
  const connections: Array<{
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    isActive: boolean;
    layerIdx: number;
  }> = [];

  for (let l = 0; l < LAYERS.length - 1; l++) {
    const currentLayer = LAYERS[l];
    const nextLayer = LAYERS[l + 1];
    const isActive = isConnectionActive(l);

    currentLayer.nodes.forEach((y1, i) => {
      nextLayer.nodes.forEach((y2, j) => {
        connections.push({
          id: `${currentLayer.name}-${i}-${nextLayer.name}-${j}`,
          x1: currentLayer.x,
          y1,
          x2: nextLayer.x,
          y2,
          color: currentLayer.color,
          isActive,
          layerIdx: l
        });
      });
    });
  }

  // Draw fewer flowing particles for performance and cleaner aesthetics
  const particleConnections = connections.filter((_, idx) => idx % 3 === 0);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] flex items-center justify-center bg-slate-950/40 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-md overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(66,133,244,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* SVG Canvas */}
      <svg className="w-full h-full" viewBox="0 0 800 440">
        <defs>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection Lines */}
        <g>
          {connections.map((conn) => {
            const opacity = conn.isActive 
              ? (mode === 'training' ? 0.6 : 0.25)
              : 0.05;
            
            return (
              <motion.line
                key={conn.id}
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
                stroke={conn.isActive ? conn.color : '#475569'}
                strokeWidth={conn.isActive ? 1.5 : 0.75}
                initial={{ opacity: 0.05 }}
                animate={{ opacity }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </g>

        {/* Flowing Information Particles */}
        <g>
          {particleConnections.map((conn, idx) => {
            if (!conn.isActive && mode === 'training') return null;

            // Vary durations and delays for random flow feel
            const duration = mode === 'training' ? 1.5 : 3 + (idx % 3);
            const delay = (idx % 5) * 0.4;

            return (
              <motion.circle
                key={`part-${conn.id}`}
                r={2.5}
                fill={conn.color}
                filter="url(#node-glow)"
                animate={{
                  cx: [conn.x1, conn.x2],
                  cy: [conn.y1, conn.y2],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: 'linear'
                }}
              />
            );
          })}
        </g>

        {/* Layer Nodes */}
        {LAYERS.map((layer, layerIdx) => (
          <g key={layer.name}>
            {layer.nodes.map((y, nodeIdx) => {
              const active = isNodeActive(layerIdx);
              const delay = layerIdx * 0.15 + nodeIdx * 0.05;

              return (
                <g key={`${layer.name}-${nodeIdx}`}>
                  {/* Outer Pulsing Glow */}
                  {active && (
                    <motion.circle
                      cx={layer.x}
                      cy={y}
                      r={14}
                      fill="transparent"
                      stroke={layer.color}
                      strokeWidth={1}
                      filter="url(#node-glow)"
                      animate={mode === 'idle' ? {
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.6, 0.3]
                      } : {
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay,
                        ease: 'easeInOut'
                      }}
                    />
                  )}

                  {/* Core Node */}
                  <motion.circle
                    cx={layer.x}
                    cy={y}
                    r={9}
                    fill={active ? layer.color : '#334155'}
                    stroke={active ? '#FFFFFF' : '#1E293B'}
                    strokeWidth={active ? 2 : 1.5}
                    filter={active ? 'url(#node-glow)' : undefined}
                    animate={
                      active && mode === 'training'
                        ? { scale: [1, 1.25, 1] }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      repeat: mode === 'training' && phase === layerIdx + 1 ? Infinity : 0,
                      repeatType: 'reverse'
                    }}
                  />

                  {/* Text Labels for Input and Output */}
                  {layer.labels[nodeIdx] && (
                    <g>
                      {/* Label Text */}
                      <text
                        x={layer.x + (layer.name === 'input' ? -16 : 16)}
                        y={y + 4}
                        textAnchor={layer.name === 'input' ? 'end' : 'start'}
                        fill={active ? '#E2E8F0' : '#64748B'}
                        className="text-[11px] font-medium tracking-wide pointer-events-none select-none"
                      >
                        {layer.labels[nodeIdx]}
                      </text>

                      {/* Display Probability values for Output Layer in phase 5 */}
                      {layer.name === 'output' && phase === 5 && (
                        <text
                          x={layer.x + 16}
                          y={y + 20}
                          textAnchor="start"
                          fill="#34A853"
                          className="text-[12px] font-bold pointer-events-none select-none font-mono"
                        >
                          {nodeIdx === 0 ? `${catProb}%` : `${dogProb}%`}
                        </text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>

      {/* Accuracy overlay during training Phase 5 */}
      {mode === 'training' && phase === 5 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="text-center"
          >
            <div className="text-sm font-semibold tracking-widest text-brand-blue uppercase mb-2">
              Model Evaluation Complete
            </div>
            <div className="text-7xl font-extrabold tracking-tighter text-white font-mono mb-2">
              {accuracyVal}%
            </div>
            <div className="text-slate-400 max-w-xs mx-auto text-xs">
              Generalization test run on 1,000 unseen validation images.
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Network Metadata Details */}
      <div className="absolute bottom-4 left-6 flex space-x-6 text-[10px] text-slate-500 font-mono">
        <div>EPOCH: <span className="text-slate-400 font-bold">{mode === 'training' ? (phase < 5 ? `0${phase}/04` : '04/04') : '00/04'}</span></div>
        <div>LEARNING RATE: <span className="text-slate-400 font-bold">0.005</span></div>
        <div>OPTIMIZER: <span className="text-slate-400 font-bold">ADAM</span></div>
      </div>
    </div>
  );
};
