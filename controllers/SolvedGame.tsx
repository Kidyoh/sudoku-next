interface CongratulationsMessageProps {
  isVisible: boolean;
  time: string; 
}

function CongratulationsMessage({ isVisible, time }: CongratulationsMessageProps) {
  return isVisible && (
    <div className='text-black'>
      Congratulations, you solved the puzzle in {time}!
    </div>
  );
}

export default CongratulationsMessage;
