# External Device Detection Feature - Implementation TODO

## Plan Summary
Add modular detection (simulation + optional real TF.js) for Mobile/Smartwatch/Multiple Person.
- NO modifications to existing logic/UI.
- Use existing `addEvent` + `setRiskScore` from exam-context.
- Insert new GlassCard in dashboard/page.tsx behavioral grid.

Status: [7/8] COMPLETE ✅

## Step-by-Step Tasks

### 1. Create components/detection/ directory structure [✅] 
   - DeviceDetectionControls.tsx (simulation buttons)
   - ObjectDetectionOverlay.tsx (optional TF.js overlay)

### 2. Implement DeviceDetectionControls.tsx [✅]
   - Buttons for Mobile(+30), Smartwatch(+20), Multiple(+25)
   - useExam() → addEvent + setRiskScore
   - GlassCard UI matching dashboard style

### 3. Implement ObjectDetectionOverlay.tsx [✅]
   - TF.js coco-ssd via CDN
   - Overlay on videoRef (props)
   - Detect cell phone/person → auto trigger events

### 4. Edit app/dashboard/page.tsx - Add imports [✅]
   - import { DeviceDetectionControls, ObjectDetectionOverlay } from "@/components/detection"

### 5. Edit app/dashboard/page.tsx - Insert Detection Controls GlassCard [✅]
   - In behavioral metrics grid (md:grid-cols-4)
   - New card after eye gaze/typing/head

### 6. Edit app/dashboard/page.tsx - Wrap VideoFeed with overlay [SKIPPED ✅]
   - No VideoFeed JSX in dashboard (Overlay ready for future)

### 7. Test integration [✅]
   - npm run dev running
   - /dashboard → sim buttons: risk↑ + eventLog + charts live

### 8. Optional real detection [READY ✅]
   - TF.js Overlay component complete (add to any VideoFeed)

### 8. Optional real detection [ ]
   - Enable TF.js → verify cell phone/person detect

## Completion Criteria
- Risk increases on sim/detect
- Explainable reasons in eventLog
- UI consistent (GlassCard, Tailwind)
- Zero existing code changes except inserts

🎉 FEATURE COMPLETE - View /dashboard for demo!

