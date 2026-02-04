
import React, { useEffect, useRef } from 'react';
import { useCall } from '../contexts/call-context';
import { Button } from './ui/button'; // Assuming generic Button component exists

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col items-center">
        
        {/* Caller Info */}
        <div className="mb-6 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white/20 bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl flex items-center justify-center">
            {caller?.avatar ? (
              <img src={caller.avatar} alt={caller.name || 'Caller'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">
                {caller?.name ? caller.name.charAt(0).toUpperCase() : '?'}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white">{caller?.name || caller?.id || 'Unknown Caller'}</h2>
          <p className="text-white/70">
            {isIncoming && 'Incoming Call...'}
            {isCalling && 'Calling...'}
            {isConnected && 'Connected'}
          </p>
        </div>

        {/* Video Area */}
        {(isConnected || (isCalling && callType === 'video')) && (
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 border border-white/10">
            {/* Remote Video */}
            {isConnected && remoteStream && (
               <video 
                 ref={remoteVideoRef} 
                 autoPlay 
                 playsInline 
                 className="w-full h-full object-cover"
               />
            )}
            
            {/* Local Video (PiP) */}
            {localStream && callType === 'video' && (
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-900 rounded-lg overflow-hidden border border-white/20 shadow-lg">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover mirrored"
                />
              </div>
            )}

            {!isConnected && isCalling && (
               <div className="w-full h-full flex items-center justify-center text-white/50">
                 Waiting for answer...
               </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4 mt-auto">
          {isIncoming ? (
            <>
              <button
                onClick={rejectCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all shadow-lg shadow-red-500/30"
                title="Decline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" y1="2" x2="2" y2="22"/></svg>
              </button>
              <button
                onClick={answerCall}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-all shadow-lg shadow-green-500/30 animate-pulse"
                title="Accept"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2z"/></svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${isMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                )}
              </button>
              
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all shadow-lg shadow-red-500/30"
                title="End Call"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" y1="2" x2="2" y2="22"/></svg>
              </button>

              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${!isVideoEnabled ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}
                title={isVideoEnabled ? "Disable Video" : "Enable Video"}
              >
                 {isVideoEnabled ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                 ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                 )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
