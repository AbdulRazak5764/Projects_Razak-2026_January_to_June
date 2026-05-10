import React, { useState } from 'react';
import UploadStep from '@/components/pipeline/UploadStep';
import AnalyzeStep from '@/components/pipeline/AnalyzeStep';
import ClipsStep from '@/components/pipeline/ClipsStep';
import MetadataStep from '@/components/pipeline/MetadataStep';
import PipelineHeader from '@/components/pipeline/PipelineHeader';
import StepIndicator from '@/components/pipeline/StepIndicator';

const STEPS = ['Upload', 'Analyze', 'Clips', 'Metadata'];

export default function Dashboard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoDuration, setVideoDuration] = useState(null);
    const [selectedClip, setSelectedClip] = useState(0);

    const handleFileUploaded = (file, duration, url) => {
        setUploadedFile(file);
        setVideoDuration(duration);
        setVideoUrl(url || null);
        setCurrentStep(1);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setUploadedFile(null);
        setVideoUrl(null);
        setSelectedClip(0);
    };

    const handleAnalysisDone = () => {
        setCurrentStep(2);
    };

    const handleViewMetadata = (clipIndex) => {
        setSelectedClip(clipIndex);
        setCurrentStep(3);
    };



    return (
        <div className="min-h-screen bg-background">
            <PipelineHeader onReset={handleReset} currentStep={currentStep} />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <StepIndicator steps={STEPS} currentStep={currentStep} />

                <div className="mt-10">
                    {currentStep === 0 && (
                        <UploadStep onFileUploaded={handleFileUploaded} />
                    )}
                    {currentStep === 1 && (
                        <AnalyzeStep file={uploadedFile} duration={videoDuration} onDone={handleAnalysisDone} />
                    )}
                    {currentStep === 2 && (
                        <ClipsStep duration={videoDuration} videoUrl={videoUrl} onViewMetadata={handleViewMetadata} onBack={() => setCurrentStep(1)} />
                    )}
                    {currentStep === 3 && (
                        <MetadataStep
                            clipIndex={selectedClip}
                            onBack={() => setCurrentStep(2)}
                            onReset={handleReset}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}