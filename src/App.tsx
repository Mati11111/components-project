import { Registry } from "@/screens/Registry";
import { Toaster } from "@/components/ui/toast";

function App() {
  return (
    <>
      <Registry />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
