import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import SupabaseProtectedRoute from "./components/SupabaseProtectedRoute";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Course from "./pages/Course";
import CreateCourse from "./pages/CreateCourse";
import CompletionConfirmation from "./components/CompletionConfirmation";
import MyTrainings from "./pages/MyTrainings";
import Employees from "./pages/Employees";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Files from "./pages/Files";
import FileUpload from "./pages/FileUpload";
import Tasks from "./pages/Tasks";
import Debug from "./pages/Debug";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SessionWrapper from "./components/SessionWrapper";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient();

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
        <pre className="text-sm text-muted-foreground mb-4 p-4 bg-muted rounded overflow-auto">
          {error.message}
        </pre>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/" element={
                <SupabaseProtectedRoute>
                  <Index />
                </SupabaseProtectedRoute>
              } />
              <Route path="/course/:id" element={
                <SupabaseProtectedRoute>
                  <Course />
                </SupabaseProtectedRoute>
              } />
              <Route path="/create-course" element={
                <SupabaseProtectedRoute>
                  <CreateCourse />
                </SupabaseProtectedRoute>
              } />
              <Route path="/course-completion" element={
                <SupabaseProtectedRoute>
                  <CompletionConfirmation />
                </SupabaseProtectedRoute>
              } />
              <Route path="/my-trainings" element={
                <SupabaseProtectedRoute>
                  <MyTrainings />
                </SupabaseProtectedRoute>
              } />
              <Route path="/tasks" element={
                <SupabaseProtectedRoute>
                  <Tasks />
                </SupabaseProtectedRoute>
              } />
              <Route path="/employees" element={
                <SupabaseProtectedRoute>
                  <Employees />
                </SupabaseProtectedRoute>
              } />
              <Route path="/analytics" element={
                <SupabaseProtectedRoute>
                  <Analytics />
                </SupabaseProtectedRoute>
              } />
              <Route path="/team" element={
                <SupabaseProtectedRoute>
                  <Team />
                </SupabaseProtectedRoute>
              } />
              <Route path="/settings" element={
                <SupabaseProtectedRoute>
                  <Settings />
                </SupabaseProtectedRoute>
              } />
              <Route path="/profile" element={
                <SupabaseProtectedRoute>
                  <Profile />
                </SupabaseProtectedRoute>
              } />
              <Route path="/files" element={
                <SupabaseProtectedRoute>
                  <Files />
                </SupabaseProtectedRoute>
              } />
              <Route path="/upload-files" element={
                <SupabaseProtectedRoute>
                  <FileUpload />
                </SupabaseProtectedRoute>
              } />
              <Route path="/debug" element={
                <SupabaseProtectedRoute>
                  <Debug />
                </SupabaseProtectedRoute>
              } />
              <Route path="/admin" element={
                <SupabaseProtectedRoute>
                  <Admin />
                </SupabaseProtectedRoute>
              } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
