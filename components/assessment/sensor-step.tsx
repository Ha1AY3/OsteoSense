'use client';

import { useState, useEffect, useRef } from 'react';
import { CreateAssessmentRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

interface SensorStepProps {
  data?: Partial<CreateAssessmentRequest>;
  onChange?: (data: Partial<CreateAssessmentRequest>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface SensorNode {
  id: string;
  name: string;
  location: string;
  metric: string;
  baseVal: number;
  unit: string;
  status: 'connected' | 'standby' | 'disconnected';
}

export function SensorStep({ data, onChange, onNext, onBack }: SensorStepProps) {
  const [deviceMode, setDeviceMode] = useState<'simulated' | 'disconnected'>('simulated');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [appliedBiometrics, setAppliedBiometrics] = useState(false);

  // Live telemetry metrics
  const [flexAngle, setFlexAngle] = useState(24);
  const [shankVelocity, setShankVelocity] = useState(114);
  const [crepitusAmp, setCrepitusAmp] = useState(1.2);
  const [batteryLevel] = useState(94);
  const [samplingRate] = useState(50);

  const testTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Realistic telemetry drift when connected
  useEffect(() => {
    if (deviceMode !== 'simulated' || isTestRunning) return;
    const interval = setInterval(() => {
      setFlexAngle(prev => +(24 + Math.sin(Date.now() / 1000) * 8).toFixed(1));
      setShankVelocity(prev => +(112 + Math.cos(Date.now() / 800) * 12).toFixed(1));
      setCrepitusAmp(prev => +(1.2 + Math.abs(Math.sin(Date.now() / 600) * 0.8)).toFixed(2));
    }, 600);
    return () => clearInterval(interval);
  }, [deviceMode, isTestRunning]);

  // Handle 10s Functional Flexion Test
  const startFlexionTest = () => {
    setIsTestRunning(true);
    setTestProgress(0);
    setTestComplete(false);

    let progress = 0;
    testTimerRef.current = setInterval(() => {
      progress += 10;
      setTestProgress(progress);

      // Flexion arc simulation during test: 15° to 118°
      const simulatedAngle = Math.round(15 + Math.sin((progress / 100) * Math.PI) * 98);
      setFlexAngle(simulatedAngle);
      setCrepitusAmp(+(2.1 + (progress > 40 && progress < 80 ? 1.6 : 0.4)).toFixed(2));

      if (progress >= 100) {
        if (testTimerRef.current) clearInterval(testTimerRef.current);
        setIsTestRunning(false);
        setTestComplete(true);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    };
  }, []);

  const handleApplyBiometrics = () => {
    if (onChange) {
      onChange({
        crepitus: true,
        reducedFlexibility: true,
        mobilityLimitation: true,
      });
    }
    setAppliedBiometrics(true);
  };

  const handlePairToggle = () => {
    if (deviceMode === 'simulated') {
      setDeviceMode('disconnected');
      setTestComplete(false);
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setDeviceMode('simulated');
      }, 1200);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl text-teal-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Biomechanical Sensor Telemetry
            </CardTitle>
            <CardDescription>
              Wearable ESP32 IMU & Patellar Flex Arc Telemetry (Dual-Node BLE)
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePairToggle}
              disabled={isConnecting || isTestRunning}
              className="text-xs font-mono"
            >
              {isConnecting ? (
                <span className="flex items-center gap-1.5 text-teal-700">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  Pairing BLE...
                </span>
              ) : deviceMode === 'simulated' ? (
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  OSTEO-ESP32 Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Connect Sensor Kit
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {deviceMode === 'disconnected' ? (
          <div className="space-y-4">
            <Alert variant="info" title="Standard Clinical Questionnaire Mode">
              Physical sensor node is disconnected. Frontline workers can complete the screening questionnaire using standard WHO/ACR symptom criteria.
            </Alert>

            <div className="p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              </div>
              <h4 className="font-semibold text-slate-800">No Wearable Kit Attached</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                If you have the OsteoSense ESP32 wearable kit ready, switch on the Bluetooth transmitter and click Connect Sensor Kit above.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePairToggle}
                className="mt-2 text-teal-700 border-teal-300 hover:bg-teal-50"
              >
                Launch BLE Sensor Simulator
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Live Node Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-900 text-white rounded-xl text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Telemetry Link</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  BLE 5.0 (Active)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Sampling Rate</span>
                <span className="text-sky-300 font-bold mt-0.5 block">{samplingRate} Hz Stream</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">ESP32 Battery</span>
                <span className="text-teal-300 font-bold mt-0.5 block">{batteryLevel}% (Li-Po)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Latency</span>
                <span className="text-slate-200 font-bold mt-0.5 block">14 ms</span>
              </div>
            </div>

            {/* Live Sensor Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg border border-teal-100 bg-teal-50/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-teal-900">Patellar Flex Arc</span>
                  <Badge variant="success" className="text-[10px] py-0 px-1.5">Online</Badge>
                </div>
                <div className="text-2xl font-black text-teal-800 font-mono mt-1">
                  {flexAngle}°
                </div>
                <p className="text-[11px] text-teal-600 mt-1">Knee Flexion Angle</p>
              </div>

              <div className="p-3.5 rounded-lg border border-sky-100 bg-sky-50/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-sky-900">Tibial Shank IMU</span>
                  <Badge variant="info" className="text-[10px] py-0 px-1.5">6-DOF</Badge>
                </div>
                <div className="text-2xl font-black text-sky-800 font-mono mt-1">
                  {shankVelocity} <span className="text-xs font-normal">°/s</span>
                </div>
                <p className="text-[11px] text-sky-600 mt-1">Angular Velocity</p>
              </div>

              <div className="p-3.5 rounded-lg border border-purple-100 bg-purple-50/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-purple-900">Crepitus Acoustic</span>
                  <Badge variant="warning" className="text-[10px] py-0 px-1.5">Transducer</Badge>
                </div>
                <div className="text-2xl font-black text-purple-800 font-mono mt-1">
                  {crepitusAmp} <span className="text-xs font-normal">m/s²</span>
                </div>
                <p className="text-[11px] text-purple-600 mt-1">Vibroacoustic Energy</p>
              </div>
            </div>

            {/* Functional Flexion Test Box */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">10-Second Active Flexion Test</h4>
                  <p className="text-xs text-slate-500">
                    Instruct patient to perform 3 continuous seated knee extensions from 90° to maximum flexion.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={startFlexionTest}
                  disabled={isTestRunning}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shrink-0"
                >
                  {isTestRunning ? `Testing (${testProgress}%)...` : testComplete ? 'Re-Run Test' : 'Run 10s Flexion Test'}
                </Button>
              </div>

              {/* Progress bar during test */}
              {isTestRunning && (
                <div className="space-y-2">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-teal-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${testProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Recording motion artifacts...</span>
                    <span>{10 - Math.round((testProgress / 100) * 10)}s remaining</span>
                  </div>
                </div>
              )}

              {/* Test Results Banner */}
              {testComplete && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Biomechanical Test Complete — Objective Findings Captured
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                    <div className="bg-white/80 p-2.5 rounded border border-emerald-100">
                      <span className="text-slate-400 block text-[10px]">Peak Flexion Arc</span>
                      <span className="font-bold text-slate-800 text-sm">108° (Moderate Deficit)</span>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded border border-emerald-100">
                      <span className="text-slate-400 block text-[10px]">Acoustic Crepitus</span>
                      <span className="font-bold text-amber-700 text-sm">Spikes Detected (&gt;2.8 m/s²)</span>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded border border-emerald-100">
                      <span className="text-slate-400 block text-[10px]">Angular Symmetry</span>
                      <span className="font-bold text-slate-800 text-sm">14% Lateral Unloading</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Button
                      size="sm"
                      onClick={handleApplyBiometrics}
                      disabled={appliedBiometrics}
                      className={appliedBiometrics ? "bg-emerald-700 text-white text-xs" : "bg-teal-700 hover:bg-teal-800 text-white text-xs"}
                    >
                      {appliedBiometrics ? '✓ Biometrics Applied to Screening' : 'Apply Biometrics to Screening Form'}
                    </Button>
                    <span className="text-xs text-slate-500">
                      {appliedBiometrics ? 'Auto-populated: Crepitus, Reduced Flexibility, and Mobility Limitation.' : 'Will automatically set crepitus & flexibility markers in the diagnostic report.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-4 border-t border-slate-100">
        <Button variant="ghost" onClick={onBack} className="text-gray-600">
          &larr; Back
        </Button>
        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white px-6">
          Continue to AI Analysis &rarr;
        </Button>
      </CardFooter>
    </Card>
  );
}
