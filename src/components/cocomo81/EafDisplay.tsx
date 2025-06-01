
interface EafDisplayProps {
  eaf: number;
}

export default function EafDisplay({ eaf }: EafDisplayProps) {
  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="text-center flex justify-around items-center p-4">
        <p className="text-sm text-gray-600 mb-2 font-medium">
          Factor de Ajuste del Esfuerzo (EAF)
        </p>
        <div className="text-xl font-bold text-blue-600">
          {eaf.toFixed(3)}
        </div>
      </div>
    </div>
  );
}
