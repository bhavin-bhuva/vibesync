import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { getSocket, initSocket } from '../socket';
// Remove static import of simple-peer
// import SimplePeer from 'simple-peer';

// Define types
export type CallStatus = 'idle' | 'calling' | 'incoming' | 'connected';
export type CallType = 'audio' | 'video';


interface CallContextType {
  callStatus: CallStatus;
  callType: CallType;
  caller: { id: string; name?: string; avatar?: string } | null; // ID of the person calling us or we are calling
  conversationId: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  initiateCall: (recipientId: string, isVideo: boolean, conversationId: string, recipientName?: string, recipientAvatar?: string) => Promise<void>;
  answerCall: () => void;
  rejectCall: () => void;
  endCall: (emitEvent?: boolean) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  flipCamera: () => Promise<void>;
  isMuted: boolean;
  isVideoEnabled: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callType, setCallType] = useState<CallType>('audio');
  const [caller, setCaller] = useState<{ id: string; name?: string; avatar?: string } | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  // Ref to track localStream for cleanup on unmount
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const connectionRef = useRef<any>(null);
  // Store incoming signal to use when answering
  const incomingSignalRef = useRef<any>(null);

  // State to track the socket instance
  const [socket, setSocket] = useState<any>(null);

  const connect = useCallback((token: string) => {
      const s = initSocket(token);
      setSocket(s);
  }, []);

  const disconnect = useCallback(() => {
      if (socket) {
          socket.disconnect();
      }
      setSocket(null);
  }, [socket]);

  // Initial connection check
  useEffect(() => {
    const token = localStorage.getItem('vibesync_access_token');
    if (token) {
        connect(token);
    }
  }, [connect]);

  // Cleanup effect
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, []);



  const initiateCall = async (recipientId: string, isVideo: boolean, convId: string, recipientName?: string, recipientAvatar?: string) => {
    setCallStatus('calling');
    setCallType(isVideo ? 'video' : 'audio');
    setCaller({ id: recipientId, name: recipientName, avatar: recipientAvatar });
    setConversationId(convId);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true });
      setLocalStream(stream);
      setIsVideoEnabled(isVideo);
      
      const SimplePeer = (await import('simple-peer')).default;
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (data) => {
        socket?.emit('call:initiate', {
          conversationId: convId,
          recipientId: recipientId,
          signalData: data,
          isVideo: isVideo
        });
      });

      peer.on('stream', (currentRemoteStream) => {
        setRemoteStream(currentRemoteStream);
      });

      peer.on('close', () => {
        endCall();
      });
      
      peer.on('error', (err) => {
        console.error('Peer connection error:', err);
        endCall();
      });

      connectionRef.current = peer;

    } catch (err) {
      console.error('Failed to get media stream:', err);
      setCallStatus('idle');
      alert('Could not access camera/microphone');
    }
  };

  const answerCall = async () => {
    setCallStatus('connected');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: callType === 'video', 
        audio: true 
      });
      setLocalStream(stream);
      setIsVideoEnabled(callType === 'video');

      const SimplePeer = (await import('simple-peer')).default;
      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (data) => {
        if (caller && conversationId) {
          socket?.emit('call:answer', {
            to: caller.id,
            signal: data,
            conversationId
          });
        }
      });

      peer.on('stream', (currentRemoteStream) => {
        setRemoteStream(currentRemoteStream);
      });

      peer.on('close', () => {
        endCall();
      });

      peer.signal(incomingSignalRef.current);
      connectionRef.current = peer;
      
    } catch (err) {
      console.error('Failed to answer call:', err);
      endCall();
    }
  };

  const rejectCall = () => {
    if (caller && conversationId) {
      socket?.emit('call:reject', { to: caller.id, conversationId });
    }
    endCall(false);
  };

  const endCall = useCallback((emitEvent: boolean = true) => {
    // Notify other peer if we are in a call
    if (emitEvent && (callStatus === 'connected' || callStatus === 'calling') && caller && conversationId) {
       socket?.emit('call:end', { to: caller.id, conversationId });
    }

    setCallStatus('idle');
    setCaller(null);
    setConversationId(null);
    setRemoteStream(null);
    
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach((track) => { track.stop(); });
      setLocalStream(null);
    }
    
    incomingSignalRef.current = null;
  }, [callStatus, caller, conversationId, socket, localStream]);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const flipCamera = async () => {
    if (!localStream) return;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      if (videoDevices.length <= 1) return; // No other camera to flip to

      const currentTrack = localStream.getVideoTracks()[0];
      const currentSettings = currentTrack.getSettings();
      const currentDeviceId = currentSettings.deviceId;

      const currentDeviceIndex = videoDevices.findIndex(d => d.deviceId === currentDeviceId);
      // Switch to next camera
      const nextDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
      const nextDevice = videoDevices[nextDeviceIndex];

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: nextDevice.deviceId } },
        audio: false // Don't replace audio
      });
      const newVideoTrack = newStream.getVideoTracks()[0];

      // Restore enabled state if it was off
      if (!isVideoEnabled) {
        newVideoTrack.enabled = false;
      }

      // Replace in local stream (for preview)
      const audioTracks = localStream.getAudioTracks();
      const newLocalStream = new MediaStream([...audioTracks, newVideoTrack]);
      setLocalStream(newLocalStream);

      // Replace in peer connection (for remote)
      if (connectionRef.current) {
        // SimplePeer supports replaceTrack
        connectionRef.current.replaceTrack(currentTrack, newVideoTrack, localStream);
      }

      // Cleanup old track
      currentTrack.stop();
      
    } catch (err) {
      console.error('Error flipping camera:', err);
    }
  };
  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: { callerId: string; callerName?: string; callerAvatar?: string; conversationId: string; signalData: any; isVideo: boolean }) => {
      console.log('Incoming call received:', data);
      if (callStatus !== 'idle') {
        // Busy - could emit a 'busy' signal back
        return;
      }
      
      setCallStatus('incoming');
      setCaller({ id: data.callerId, name: data.callerName, avatar: data.callerAvatar });
      setConversationId(data.conversationId);
      setCallType(data.isVideo ? 'video' : 'audio');
      incomingSignalRef.current = data.signalData;
    };

    const handleCallAccepted = (data: { responderId: string; signal: any }) => {
      console.log('Call accepted by:', data.responderId);
      setCallStatus('connected');
      connectionRef.current?.signal(data.signal);
    };

    const handleCallRejected = (data: { responderId: string }) => {
      console.log('Call rejected by:', data.responderId);
      endCall(false);
      alert('Call rejected');
    };

    const handleCallEnded = (data: { enderId: string }) => {
      console.log('Call ended by:', data.enderId);
      endCall(false);
    };

    socket.on('call:incoming', handleIncomingCall);
    socket.on('call:accepted', handleCallAccepted);
    socket.on('call:rejected', handleCallRejected);
    socket.on('call:ended', handleCallEnded);

    return () => {
      socket.off('call:incoming', handleIncomingCall);
      socket.off('call:accepted', handleCallAccepted);
      socket.off('call:rejected', handleCallRejected);
      socket.off('call:ended', handleCallEnded);
    };
  }, [socket, callStatus, endCall]);

  return (
    <CallContext.Provider value={{
      callStatus,
      callType,
      caller,
      conversationId,
      localStream,
      remoteStream,
      initiateCall,
      answerCall,
      rejectCall,
      endCall,
      toggleMute,
      toggleVideo,
      flipCamera,
      isMuted,
      isVideoEnabled,
      connect,
      disconnect
    }}>
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
