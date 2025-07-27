// src/utils/audioRecorder.js

export default class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  // ✅ Start Recording
  async startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("❌ Audio recording not supported in this browser.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  // ✅ Stop & Get Blob
  async stopRecording() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        resolve(audioBlob);
      };
      this.mediaRecorder.stop();
    });
  }

  // ✅ Convert to FormData for API
  async toFormData() {
    const audioBlob = await this.stopRecording();
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    return formData;
  }
}
