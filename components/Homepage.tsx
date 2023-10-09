"use client";
import { useState, useEffect, useRef } from 'react';
import Board, { Difficulty } from './Board';
import lottie, { AnimationItem } from 'lottie-web';
import easyAnimationData from '../public/animations/DifficultyAnimations/EasyDifficultyAnimation/EasyDifficultyAnimation.json';
import mediumAnimationData from '../public/animations/DifficultyAnimations/MediumDifficultyAnimation/MediumDifficultyAnimation.json';
import hardAnimationData from '../public/animations/DifficultyAnimations/HardDifficultyAnimation/HardDifficultyAnimation.json';

function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [animationVisible, setAnimationVisible] = useState<boolean>(false);
  const animationContainer = useRef<HTMLDivElement | null>(null);
  const animationDataMap = {
    [Difficulty.Easy]: easyAnimationData,
    [Difficulty.Medium]: mediumAnimationData,
    [Difficulty.Hard]: hardAnimationData,
  };

  useEffect(() => {
    if (animationContainer.current) {
      if (selectedDifficulty !== null) {
        const animation: AnimationItem = lottie.loadAnimation({
          container: animationContainer.current,
          animationData: animationDataMap[selectedDifficulty],
          loop: true,
          autoplay: true,
        });
        return () => animation.destroy(); // Cleanup
      }
    }
  }, [selectedDifficulty]);

  function handleDifficultySelect(difficulty: Difficulty) {
    setSelectedDifficulty(difficulty);
    setAnimationVisible(true); // Show the animation when a difficulty is selected
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 mx-auto">
      <div className="flex items-center justify-center p-12 rounded-lg shadow-md">
        {selectedDifficulty === null ? (
          <div>
            <h1 className="text-3xl font-semibold mb-4 text-black">Select a difficulty:</h1>
            <div className="space-x-4 my-4">
              <button
                onClick={() => handleDifficultySelect(Difficulty.Easy)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer"
              >
                Easy
              </button>
              <button
                onClick={() => handleDifficultySelect(Difficulty.Medium)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg cursor-pointer"
              >
                Medium
              </button>
              <button
                onClick={() => handleDifficultySelect(Difficulty.Hard)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg cursor-pointer"
              >
                Hard
              </button>
            </div>
          </div>
        ) : (
          <>
          
            <Board difficulty={selectedDifficulty} />
            {animationVisible && (
              <div ref={animationContainer} style={{ width: '200px', height: '200px' }}></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;