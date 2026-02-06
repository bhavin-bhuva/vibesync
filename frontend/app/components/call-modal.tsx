
import React, { useEffect, useRef, useState } from 'react';
import { useCall } from '../contexts/call-context';

export function CallModal() {
  const { 
    callStatus, 
    callType, 
    caller, 
    localStream, 
    remoteStream, 
    answerCall, 
    rejectCall, 
    endCall,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoEnabled
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Timer state for connected calls
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer when call connects
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callStatus]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, callStatus]);

  if (callStatus === 'idle') return null;

  const isIncoming = callStatus === 'incoming';
  const isConnected = callStatus === 'connected';
  const isCalling = callStatus === 'calling';

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Incoming Call Screen (similar to reference/incoming-call-screen.html)
  if (isIncoming) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#191022]/70 to-[#191022]/85 backdrop-blur-md"
          style={{
            backgroundImage: caller?.avatar ? `linear-gradient(rgba(25, 16, 34, 0.7), rgba(25, 16, 34, 0.85)), url(${caller.avatar})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
          {/* Content Container - centered on desktop */}
          <div className="w-full max-w-[500px] mx-auto h-full flex flex-col justify-between">
            {/* Top Content */}
            <div className="flex flex-col items-center justify-center flex-grow pt-20">
              {/* Avatar with glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#7f13ec]/30 rounded-full blur-2xl scale-125"></div>
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#7f13ec]/40 p-1">
                  <div 
                    className="w-full h-full rounded-full bg-cover bg-center border-2 border-white/10 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500"
                    style={{
                      backgroundImage: caller?.avatar ? `url(${caller.avatar})` : undefined,
                    }}
                  >
                    {!caller?.avatar && (
                      <span className="text-5xl font-bold text-white">
                        {caller?.name ? caller.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Caller Info */}
              <div className="mt-8 text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {caller?.name || caller?.id || 'Unknown Caller'}
                </h1>
                <p className="text-[#7f13ec] font-medium text-lg tracking-wide uppercase text-sm">
                  Incoming {callType === 'video' ? 'Video' : 'Audio'} Call...
                </p>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="px-10 pb-20 w-full">
            {/* Additional Options */}
            <div className="flex justify-between items-center mb-12 px-4">
              <button className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl text-white">alarm</span>
                </div>
                <span className="text-xs font-medium text-white">Remind Me</span>
              </button>
              <button className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl text-white">chat_bubble</span>
                </div>
                <span className="text-xs font-medium text-white">Message</span>
              </button>
            </div>
            
            {/* Accept/Reject Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={rejectCall}
                  className="w-20 h-20 bg-[#ef4444] hover:bg-[#ef4444]/90 transition-all rounded-full flex items-center justify-center shadow-lg shadow-[#ef4444]/20"
                  title="Decline"
                >
                  <span className="material-symbols-outlined text-4xl text-white scale-x-[-1] rotate-[135deg]">call_end</span>
                </button>
                <span className="text-sm font-semibold opacity-90 text-white">Decline</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={answerCall}
                  className="w-20 h-20 bg-[#22c55e] hover:bg-[#22c55e]/90 transition-all rounded-full flex items-center justify-center shadow-lg shadow-[#22c55e]/20 animate-[pulse_2s_infinite]"
                  title="Accept"
                  style={{
                    animation: 'pulse-ring 2s infinite',
                  }}
                >
                  <span className="material-symbols-outlined text-4xl text-white">
                    {callType === 'video' ? 'videocam' : 'call'}
                  </span>
                </button>
                <span className="text-sm font-semibold opacity-90 text-white">Accept</span>
              </div>
            </div>
          </div>
          
          </div>{/* End Content Container */}
          
          {/* iOS Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full"></div>
        </div>

        <style>{`
          @keyframes pulse-ring {
            0% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }
        `}</style>
      </div>
    );
  }

  // Active Video Call Screen (similar to reference/active-video-call-screen.html)
  if ((isConnected || isCalling) && callType === 'video') {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Main Video Feed Container */}
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
          {/* Background Video (Remote) */}
          <div className="absolute inset-0 z-0">
            {isConnected && remoteStream ? (
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
                    {caller?.avatar ? (
                      <img src={caller.avatar} alt={caller.name || 'Caller'} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-5xl font-bold text-white">
                        {caller?.name ? caller.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-lg">
                    {isCalling ? 'Calling...' : 'Connecting...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Top Left Info Overlay */}
          <div className="absolute top-16 left-6 z-20 flex items-center gap-3">
            <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
              <span className="material-symbols-outlined text-[#13ecec] text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
              <span className="text-white text-xs font-semibold tracking-wide">Secure Call</span>
            </div>
          </div>
          
          {/* Top Right Picture-in-Picture (Local) */}
          {localStream && (
            <div className="absolute top-16 right-4 w-28 h-40 rounded-xl overflow-hidden border border-white/20 z-20 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="h-full w-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              <div className="absolute bottom-2 right-2">
                <span className="material-symbols-outlined text-white text-xs bg-black/40 p-1 rounded-full">flip_camera_ios</span>
              </div>
            </div>
          )}
          
          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-0 left-0 w-full z-30">
            <div 
              className="rounded-t-[2.5rem] px-8 pt-8 pb-10 flex flex-col items-center space-y-6"
              style={{
                background: 'rgba(16, 34, 34, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Main Control Buttons */}
              <div className="flex items-center justify-center gap-8 w-full">
                {/* Mute Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-white text-2xl">
                      {isMuted ? 'mic_off' : 'mic'}
                    </span>
                  </button>
                  <span className="text-white/60 text-[10px] uppercase tracking-wider font-bold">Mute</span>
                </div>
                
                {/* End Call Button (Center Primary) */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => endCall()}
                    className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>call_end</span>
                  </button>
                  <span className="text-white/60 text-[10px] uppercase tracking-wider font-bold">End</span>
                </div>
                
                {/* Flip Camera Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={toggleVideo}
                    className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-white text-2xl">
                      {isVideoEnabled ? 'flip_camera_android' : 'videocam_off'}
                    </span>
                  </button>
                  <span className="text-white/60 text-[10px] uppercase tracking-wider font-bold">
                    {isVideoEnabled ? 'Flip' : 'Camera'}
                  </span>
                </div>
              </div>
              
              {/* Caller Info & Duration */}
              <div className="w-full flex flex-col items-center">
                <h2 className="text-white text-xl font-bold tracking-tight">
                  {caller?.name || caller?.id || 'Unknown'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#13ecec] animate-pulse"></span>
                  <p className="text-[#13ecec] font-medium text-sm">
                    {isConnected ? formatDuration(callDuration) : 'Connecting...'}
                  </p>
                </div>
              </div>
              
              {/* iOS Home Indicator */}
              <div className="w-32 h-1 bg-white/30 rounded-full mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Audio Call Screen (similar to reference/active-audio-call-screen.html)
  if ((isConnected || isCalling) && callType === 'audio') {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div 
          className="relative flex h-screen w-full flex-col overflow-hidden"
          style={{
            background: 'radial-gradient(circle at center, #2e1052 0%, #120a1a 100%)',
          }}
        >
          {/* Content Container - centered on desktop */}
          <div className="w-full max-w-[600px] mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-white">expand_more</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7f13ec]/20 border border-[#7f13ec]/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-semibold uppercase tracking-widest text-purple-200">End-to-End Encrypted</span>
              </div>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-white">more_horiz</span>
              </button>
            </div>
            
            {/* Center Content */}
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            {/* Avatar with glow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#7f13ec]/30 blur-3xl rounded-full scale-125"></div>
              <div className="relative w-48 h-48 rounded-full border-4 border-[#7f13ec]/20 p-1">
                <div 
                  className="h-full w-full rounded-full bg-cover bg-center overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500"
                  style={{
                    backgroundImage: caller?.avatar ? `url(${caller.avatar})` : undefined,
                  }}
                >
                  {!caller?.avatar && (
                    <span className="text-6xl font-bold text-white">
                      {caller?.name ? caller.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Name and Status */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {caller?.name || caller?.id || 'Unknown Caller'}
            </h1>
            <p className="text-[#7f13ec]/70 text-lg font-medium mb-6">
              {isConnected ? 'Connected' : 'Calling...'}
            </p>
            
            {/* Timer */}
            {isConnected && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div 
                    className="flex h-12 w-16 items-center justify-center rounded-2xl text-2xl font-bold"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {minutes.toString().padStart(2, '0')}
                  </div>
                  <span className="mt-2 text-[10px] uppercase tracking-widest text-white/40 font-bold">Minutes</span>
                </div>
                <div className="flex h-12 items-center text-2xl font-bold text-white/40">:</div>
                <div className="flex flex-col items-center">
                  <div 
                    className="flex h-12 w-16 items-center justify-center rounded-2xl text-2xl font-bold"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {seconds.toString().padStart(2, '0')}
                  </div>
                  <span className="mt-2 text-[10px] uppercase tracking-widest text-white/40 font-bold">Seconds</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom Controls */}
          <div className="px-8 pb-16">
            {/* Control Buttons */}
            <div className="flex justify-center gap-12 mb-12">
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="flex w-20 h-20 items-center justify-center rounded-full hover:bg-white/20 transition-all active:scale-95"
                  style={{
                    background: isMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span className="material-symbols-outlined text-3xl text-white">
                    {isMuted ? 'mic_off' : 'mic'}
                  </span>
                </button>
                <span className={`text-sm font-medium ${isMuted ? 'text-white' : 'text-white/60'}`}>Mute</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  className="flex w-20 h-20 items-center justify-center rounded-full bg-white text-[#120a1a] hover:bg-white/90 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>volume_up</span>
                </button>
                <span className="text-sm font-bold text-white">Speaker</span>
              </div>
            </div>
            
            {/* End Call Button */}
            <div className="flex justify-center">
              <button
                onClick={() => endCall()}
                className="flex h-20 w-full max-w-[280px] items-center justify-center gap-4 rounded-full bg-[#ff453a] text-white shadow-2xl shadow-[#ff453a]/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <div className="flex w-12 h-12 items-center justify-center rounded-full bg-white/20">
                  <span className="material-symbols-outlined text-3xl rotate-[135deg]">call_end</span>
                </div>
                <span className="text-xl font-bold">End Call</span>
              </button>
            </div>
          </div>
          
          </div>{/* End Content Container */}
          
          {/* iOS Home Indicator */}
          <div className="h-8 w-full flex justify-center items-end pb-2">
            <div className="w-32 h-1.5 bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7f13ec] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-900 rounded-full blur-[100px]"></div>
        </div>
      </div>
    );
  }

  return null;
}
