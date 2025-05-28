
import Header from "@/components/Header";
import CocomoCalculator from "@/components/CocomoCalculator";

export default function CocomoForm() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pb-8">
        <CocomoCalculator />
      </main>
    </div>
  );
}
