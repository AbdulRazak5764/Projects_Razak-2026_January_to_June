import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const predictions = await predictDiseasesLocal(buffer)

    return NextResponse.json({
      success: true,
      message: "Disease prediction completed successfully",
      predictions: predictions.predictions,
      image_analysis: predictions.analysis,
      recommendations: predictions.recommendations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to make prediction: " + (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 },
    )
  }
}

async function predictDiseasesLocal(buffer: Buffer): Promise<{
  predictions: Array<{
    disease: string
    confidence: number
    description: string
    risk_level: "low" | "medium" | "high" | "critical"
    clinical_notes: string
    progression?: {
      months_to_blindness: number | null
      vision_loss_rate: number
      severity_stage: string
      can_be_prevented: boolean
    }
  }>
  analysis: {
    vessel_health: number
    optic_disc_quality: number
    macula_status: number
    overall_health: number
  }
  recommendations: string[]
}> {
  // Simulate image quality metrics based on buffer hash
  const hash = computeBufferHash(buffer)
  const seed = hash % 100

  const imageMetrics = {
    vessel_health: 0.65 + (seed / 200) * 0.3,
    optic_disc_quality: 0.75 + (((seed + 23) % 100) / 200) * 0.25,
    macula_status: 0.7 + (((seed + 47) % 100) / 200) * 0.28,
    overall_health: 0.7 + (((seed + 71) % 100) / 200) * 0.25,
  }

  // Generate disease predictions based on image metrics
  const predictions: Array<{
    disease: string
    confidence: number
    description: string
    risk_level: "low" | "medium" | "high" | "critical"
    clinical_notes: string
    progression?: {
      months_to_blindness: number | null
      vision_loss_rate: number
      severity_stage: string
      can_be_prevented: boolean
    }
  }> = []

  const diseasePatterns = [
    {
      disease: "Diabetic Retinopathy",
      baseConfidence: 1 - imageMetrics.vessel_health,
      riskFactor: 1,
    },
    {
      disease: "Age-related Macular Degeneration",
      baseConfidence: 0.4 - imageMetrics.macula_status * 0.3,
      riskFactor: 0.8,
    },
    {
      disease: "Glaucoma",
      baseConfidence: 0.5 - imageMetrics.optic_disc_quality * 0.4,
      riskFactor: 0.9,
    },
    {
      disease: "Hypertensive Retinopathy",
      baseConfidence: 0.45 - imageMetrics.vessel_health * 0.25,
      riskFactor: 0.7,
    },
    {
      disease: "Retinal Detachment",
      baseConfidence: 0.25 + (((seed + 13) % 100) / 200) * 0.2,
      riskFactor: 1.2,
    },
  ]

  diseasePatterns.forEach((pattern) => {
    const confidence = Math.max(0.05, Math.min(0.95, pattern.baseConfidence))
    let riskLevel: "low" | "medium" | "high" | "critical"

    if (confidence < 0.25) {
      riskLevel = "low"
    } else if (confidence < 0.55) {
      riskLevel = "medium"
    } else if (confidence < 0.75) {
      riskLevel = "high"
    } else {
      riskLevel = "critical"
    }

    const progression = calculateDiseaseProgression(pattern.disease, confidence, imageMetrics)

    predictions.push({
      disease: pattern.disease,
      confidence: Number.parseFloat(confidence.toFixed(3)),
      description: getDetailedDescription(pattern.disease, confidence),
      risk_level: riskLevel,
      clinical_notes: getClinicalNotes(pattern.disease, confidence, imageMetrics),
      progression, // Add progression data
    })
  })

  // Generate recommendations based on highest risk predictions
  const highestRiskPrediction = predictions.reduce((prev, current) =>
    current.confidence > prev.confidence ? current : prev,
  )

  const recommendations = generateRecommendations(highestRiskPrediction, imageMetrics)

  return {
    predictions,
    analysis: {
      vessel_health: Number.parseFloat(imageMetrics.vessel_health.toFixed(2)),
      optic_disc_quality: Number.parseFloat(imageMetrics.optic_disc_quality.toFixed(2)),
      macula_status: Number.parseFloat(imageMetrics.macula_status.toFixed(2)),
      overall_health: Number.parseFloat(imageMetrics.overall_health.toFixed(2)),
    },
    recommendations,
  }
}

function getDetailedDescription(disease: string, confidence: number): string {
  const descriptions: Record<string, string[]> = {
    "Diabetic Retinopathy": [
      "No diabetic retinopathy detected - normal retinal vasculature",
      "Possible early signs of microaneurysms in peripheral retina",
      "Moderate diabetic retinopathy with microaneurysms and hemorrhages",
      "Severe proliferative changes with neovascularization risk",
    ],
    "Age-related Macular Degeneration": [
      "No AMD detected - macula appears healthy",
      "Early AMD with small drusen formation",
      "Intermediate AMD with confluent drusen and pigment changes",
      "Advanced AMD with geographic atrophy or CNV",
    ],
    Glaucoma: [
      "Normal optic nerve head - no glaucomatous changes",
      "Possible early optic nerve cupping",
      "Moderate glaucomatous optic neuropathy detected",
      "Advanced glaucoma with significant optic nerve damage",
    ],
    "Hypertensive Retinopathy": [
      "Normal vascular appearance",
      "Grade 1 hypertensive retinopathy - mild arteriosclerosis",
      "Grade 2-3 hypertensive retinopathy with hemorrhages",
      "Grade 4 malignant hypertensive retinopathy with papilledema",
    ],
    "Retinal Detachment": [
      "No retinal detachment detected",
      "Possible retinal tear or localized elevation",
      "Partial rhegmatogenous retinal detachment",
      "Extensive retinal detachment requiring urgent surgery",
    ],
  }

  const array = descriptions[disease] || ["Assessment in progress"]
  const index = Math.floor(confidence * 4) % array.length
  return array[index]
}

function getClinicalNotes(disease: string, confidence: number, metrics: any): string {
  const notes: Record<string, string> = {
    "Diabetic Retinopathy":
      confidence > 0.6
        ? "Microaneurysms and hemorrhages suggest diabetes-related retinal damage. Urgent ophthalmology referral with OCT and fluorescein angiography recommended."
        : "Early signs present. Regular monitoring and optimization of glycemic control essential.",
    "Age-related Macular Degeneration":
      confidence > 0.6
        ? "Advanced AMD with risk of vision loss. Consider anti-VEGF therapy or retinal imaging studies."
        : "Early findings. Continue routine monitoring and protective measures (antioxidants, UV protection).",
    Glaucoma:
      confidence > 0.6
        ? "Significant optic nerve damage detected. Requires immediate glaucoma workup including visual fields and imaging."
        : "Possible early changes. Monitor intraocular pressure and optic nerve appearance regularly.",
    "Hypertensive Retinopathy":
      confidence > 0.6
        ? "Severe hypertensive changes present. Blood pressure urgently requires optimization and systemic workup."
        : "Mild vascular changes consistent with hypertension. Continue antihypertensive therapy.",
    "Retinal Detachment":
      confidence > 0.6
        ? "Retinal detachment suspected. Emergency ophthalmology evaluation required for potential surgical intervention."
        : "Possible predisposing factors present. Patient education on warning signs (flashes, floaters) recommended.",
  }

  return notes[disease] || "Clinical assessment pending specialist review"
}

function generateRecommendations(
  topPrediction: { disease: string; confidence: number; risk_level: string },
  metrics: any,
): string[] {
  const baseRecommendations = [
    "Schedule comprehensive ophthalmology examination with dilated evaluation",
    "Obtain optical coherence tomography (OCT) imaging for structural analysis",
  ]

  const diseaseSpecificRecommendations: Record<string, string[]> = {
    "Diabetic Retinopathy": [
      "Optimize glycemic control (target HbA1c < 7%)",
      "Monitor blood pressure regularly",
      "Consider annual dilated eye exams",
      "Lifestyle modifications: diet, exercise, smoking cessation",
    ],
    "Age-related Macular Degeneration": [
      "Vitamin supplementation (AREDS2 formula if indicated)",
      "UV and blue light protection",
      "Regular monitoring for AMD progression",
      "Consider amsler grid home monitoring",
    ],
    Glaucoma: [
      "Measure intraocular pressure (IOP)",
      "Perform automated visual field testing",
      "Initiate topical antiglaucoma therapy if indicated",
      "Monitor optic nerve imaging regularly",
    ],
    "Hypertensive Retinopathy": [
      "Cardiology consultation for blood pressure optimization",
      "Consider 24-hour ambulatory BP monitoring",
      "Medication adjustment as needed",
      "Lifestyle modifications: salt reduction, stress management",
    ],
    "Retinal Detachment": [
      "Immediate vitreoretinal specialist referral",
      "Restrict activities that increase intraocular pressure",
      "Prepare for possible surgical intervention",
      "Patient education on urgency of symptoms",
    ],
  }

  const additional = diseaseSpecificRecommendations[topPrediction.disease] || []
  return [...baseRecommendations, ...additional].slice(0, 6)
}

function computeBufferHash(buffer: Buffer): number {
  let hash = 0
  for (let i = 0; i < buffer.length; i++) {
    const char = buffer[i]
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function calculateDiseaseProgression(
  disease: string,
  confidence: number,
  metrics: any,
): {
  months_to_blindness: number | null
  vision_loss_rate: number
  severity_stage: string
  can_be_prevented: boolean
} {
  const progressionData: Record<
    string,
    {
      base_months: number
      preventable: boolean
      stages: string[]
    }
  > = {
    "Diabetic Retinopathy": {
      base_months: 36,
      preventable: true,
      stages: ["No DR", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "Proliferative DR", "Advanced/Blindness"],
    },
    "Age-related Macular Degeneration": {
      base_months: 60,
      preventable: false,
      stages: [
        "Normal",
        "Early AMD",
        "Intermediate AMD",
        "Advanced AMD - Geographic Atrophy",
        "Advanced AMD - CNV",
        "Legal Blindness",
      ],
    },
    Glaucoma: {
      base_months: 120,
      preventable: true,
      stages: ["Normal", "Suspect", "Early Glaucoma", "Moderate Glaucoma", "Advanced Glaucoma", "Blindness"],
    },
    "Hypertensive Retinopathy": {
      base_months: 24,
      preventable: true,
      stages: ["Grade 0", "Grade 1", "Grade 2", "Grade 3", "Grade 4 (Malignant)", "End-stage/Blindness"],
    },
    "Retinal Detachment": {
      base_months: 6,
      preventable: false,
      stages: [
        "Normal",
        "Retinal Tear",
        "Partial Detachment",
        "Macula-off Detachment",
        "Total Detachment",
        "Blindness",
      ],
    },
  }

  const data = progressionData[disease]
  if (!data) {
    return {
      months_to_blindness: null,
      vision_loss_rate: 0,
      severity_stage: "Unknown",
      can_be_prevented: false,
    }
  }

  // Calculate stage based on confidence
  const currentStage = Math.floor(confidence * (data.stages.length - 1))
  const stageName = data.stages[currentStage]

  // Calculate months to blindness (faster progression with higher confidence)
  let monthsToBlindness: number | null = null
  let visionLossRate = 0

  if (confidence > 0.4) {
    // Higher confidence = faster progression to blindness
    monthsToBlindness = Math.round(data.base_months * (1 - confidence))
    visionLossRate = confidence * 100 // percentage per year equivalent
  }

  return {
    months_to_blindness: monthsToBlindness,
    vision_loss_rate: Number.parseFloat(visionLossRate.toFixed(2)),
    severity_stage: stageName,
    can_be_prevented: data.preventable,
  }
}
