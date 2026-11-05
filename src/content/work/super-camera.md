---
title: "Super Camera"
tier: 3
order: 7
hook: "Native Windows screen and camera recorder with hardware H.264 and no Electron."
summary: "Super Camera is a native WPF recorder for camera, screen, or screen with a camera bubble, encoding to MP4 in hardware with microphone and system audio."
categories: ["media-creative", "dev-tools"]
role: "Sole designer and engineer"
period: "Oct 2026"
status: "Working personal tool"
stack: ["C#", ".NET 9", "WPF", "Windows.Graphics.Capture", "Windows.Media.Capture"]
highlights:
  - "Floating control overlay excluded from the capture"
  - "Hardware H.264 encoding, no ffmpeg and no bundled runtime beyond .NET"
  - "Movable camera bubble, microphone and system audio"
  - "Light editing built in"
credits: []
links: {}
openQuestions: []
draft: false
---

I record a lot of demos, and the screen recorders I tried were either heavy Electron apps or lacked a good camera bubble and a control bar that stays out of the shot. Super Camera is the recorder I wanted: camera, screen, or screen with my camera in the corner, recorded properly to MP4, plus enough monitoring and trimming to turn a raw take into something usable.

It is a WPF app on .NET 9 that drives the Windows capture APIs directly: Windows.Media.Capture for the camera and microphone, Windows.Graphics.Capture for the screen, and Windows.Media.Editing for the light editing. Encoding is hardware H.264, so there is no ffmpeg and nothing bundled beyond .NET. The floating control bar is excluded from the capture, so I can see and use it while recording without it showing up in the video. It is the tool I am using to record the clips for this site.
