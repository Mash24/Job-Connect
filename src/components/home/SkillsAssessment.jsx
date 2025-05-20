import React, { useState } from 'react';
import { FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import { trackFeatureUsage } from '../../services/analytics';

const SkillsAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      category: 'Technical Skills',
      question: 'How would you rate your proficiency in JavaScript?',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
      ]
    },
    {
      id: 2,
      category: 'Soft Skills',
      question: 'How would you rate your communication skills?',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
      ]
    },
    {
      id: 3,
      category: 'Problem Solving',
      question: 'How would you rate your problem-solving abilities?',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
      trackFeatureUsage('skills_assessment_completed', { answers });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    trackFeatureUsage('skills_assessment_restarted');
  };

  const calculateResults = () => {
    const skillLevels = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4
    };

    const results = {
      technical: 0,
      soft: 0,
      problemSolving: 0
    };

    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer) {
        switch (q.category) {
          case 'Technical Skills':
            results.technical += skillLevels[answer];
            break;
          case 'Soft Skills':
            results.soft += skillLevels[answer];
            break;
          case 'Problem Solving':
            results.problemSolving += skillLevels[answer];
            break;
        }
      }
    });

    return results;
  };

  const renderResults = () => {
    const results = calculateResults();
    const maxScore = 4; // Maximum possible score per category

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Skills Assessment Results</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Technical Skills</span>
              <span className="text-gray-600">{Math.round((results.technical / maxScore) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(results.technical / maxScore) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Soft Skills</span>
              <span className="text-gray-600">{Math.round((results.soft / maxScore) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(results.soft / maxScore) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Problem Solving</span>
              <span className="text-gray-600">{Math.round((results.problemSolving / maxScore) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(results.problemSolving / maxScore) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleRestart}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Take Assessment Again
          </button>
        </div>
      </div>
    );
  };

  const currentQuestion = questions[currentStep];

  return (
    <section className="w-full px-4 md:px-20 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills Assessment</h2>
          <p className="text-gray-600">Evaluate your skills and get personalized recommendations</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {!showResults ? (
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-gray-500">{currentQuestion.category}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.question}
              </h3>

              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full p-4 text-left rounded-lg border transition duration-300 ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{option.label}</span>
                      {answers[currentQuestion.id] === option.value && (
                        <FaCheck className="text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-lg border ${
                    currentStep === 0
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className={`inline-flex items-center px-6 py-3 rounded-lg ${
                    !answers[currentQuestion.id]
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          ) : (
            renderResults()
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsAssessment; 