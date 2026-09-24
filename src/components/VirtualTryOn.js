import React, { useEffect, useRef, useState } from "react";


function VirtualTryOn({ product }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const requestIdRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  const [cameraError, setCameraError] = useState("");

  
  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isOpen, capturedImage]);

  function stopCamera() {
    requestIdRef.current += 1;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  async function startCamera(requestId) {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access is not supported here. Please use a modern browser over HTTPS or localhost."
      );
      return;
    }

    try {
  
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

    
      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      setCameraError(
        error.name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access and try again."
          : "The camera could not be opened. Check that it is available and try again."
      );
    }
  }

  function openCamera() {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setCameraError("");
    setCapturedImage("");
    setIsOpen(true);
    startCamera(requestId);
  }

  function closeCamera() {
    stopCamera();
    setIsOpen(false);
    setCameraError("");
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    // Release the webcam as soon as the still image has been captured.
    stopCamera();
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.9));
  }

  function retakePhoto() {
    setCameraError("");
    setCapturedImage("");
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    startCamera(requestId);
  }

  return (
    <>
      <button
        className="virtual-try-on-button"
        type="button"
        onClick={openCamera}
        title={`Try ${product.name} virtually`}
      >
        <span aria-hidden="true">📷</span>
        Virtual TryOn
      </button>

      {isOpen && (
        <div className="try-on-backdrop" role="presentation" onClick={closeCamera}>
          <section
            className="try-on-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`try-on-title-${product.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="try-on-dialog-header">
              <div>
                <span className="section-eyebrow">VEYRAA CAMERA STUDIO</span>
                <h2 id={`try-on-title-${product.id}`}>Virtual TryOn</h2>
                <p>{product.name}</p>
              </div>
              <button className="try-on-close" type="button" onClick={closeCamera} aria-label="Close camera">
                ×
              </button>
            </div>

            <div className="try-on-stage">
              <div className="try-on-camera-panel">
                {cameraError ? (
                  <p className="try-on-error" role="alert">{cameraError}</p>
                ) : capturedImage ? (
                  <img className="try-on-capture" src={capturedImage} alt="Captured virtual try-on preview" />
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted />
                )}
              </div>

              <div className="try-on-product-panel">
                <span>PRODUCT PREVIEW</span>
                <img src={product.image} alt={product.name} />
                <strong>{product.name}</strong>
              </div>
            </div>

            <div className="try-on-actions">
              {capturedImage ? (
                <button className="try-on-secondary-button" type="button" onClick={retakePhoto}>Retake Photo</button>
              ) : (
                <button className="try-on-primary-button" type="button" onClick={capturePhoto} disabled={Boolean(cameraError)}>Capture Photo</button>
              )}
              <button className="try-on-secondary-button" type="button" onClick={closeCamera}>Close</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default VirtualTryOn;
