
import { AppProviders } from "./providers/AppProviders";
import { AppErrorBoundary } from "./components/errors/AppErrorBoundary";
import { AppFallbackComponent } from "./components/errors/AppFallbackComponent";
import { AppContent } from "./components/AppContent";

function App() {
  return (
    <AppProviders>
      <AppErrorBoundary fallbackComponent={AppFallbackComponent}>
        <AppContent />
      </AppErrorBoundary>
    </AppProviders>
  );
}

export default App;
