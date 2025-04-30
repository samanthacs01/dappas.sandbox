import Image from 'next/image';

type Props = {
  viewMode: 'front' | 'back';
  setViewMode: (viewMode: 'front' | 'back') => void;
};

const ViewMode: React.FC<Props> = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex flex-col space-y-2">
      <button
        className={`w-16 h-16 ${
          viewMode === 'front' ? 'bg-white shadow-md' : 'bg-gray-100'
        } rounded p-1 flex flex-col items-center justify-center text-xs cursor-pointer`}
        onClick={() => setViewMode('front')}
      >
        <Image
          src="/images/t-shirt/white-front.png"
          alt="Front View"
          className="w-10 h-10 object-cover mb-1 bg-blue-600"
          width={40}
          height={40}
        />
        <span>Front</span>
      </button>
      <button
        className={`w-16 h-16 ${
          viewMode === 'back' ? 'bg-white shadow-md' : 'bg-gray-100'
        } rounded p-1 flex flex-col items-center justify-center text-xs cursor-pointer`}
        onClick={() => setViewMode('back')}
      >
        <Image
          src="/images/t-shirt/white-back.png"
          alt="Back View"
          width={40}
          height={40}
          className="w-10 h-10 object-cover mb-1 bg-blue-600"
        />
        <span>Back</span>
      </button>
    </div>
  );
};

export default ViewMode;
