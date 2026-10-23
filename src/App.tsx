import { Registry } from "@/screens/Registry";
import { Toaster } from "@/components/ui/toast";
import Seo from "@/seo/Seo";

function App() {
  return (
    <>
      <Seo />
      <Registry />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
