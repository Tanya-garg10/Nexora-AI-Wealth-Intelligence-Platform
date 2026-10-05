/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NexoraProvider } from "./context/NexoraContext";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { MarketsPage } from "./pages/MarketsPage";
import { CopilotPage } from "./pages/CopilotPage";
import { AssetDetailPage } from "./pages/AssetDetailPage";
import { SimulatorPage } from "./pages/SimulatorPage";
import { ActivityPage } from "./pages/ActivityPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <NexoraProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authenticated / Workspace Shell Routes */}
          <Route
            path="/dashboard"
            element={
              <AppShell>
                <DashboardPage />
              </AppShell>
            }
          />
          <Route
            path="/portfolio"
            element={
              <AppShell>
                <PortfolioPage />
              </AppShell>
            }
          />
          <Route
            path="/markets"
            element={
              <AppShell>
                <MarketsPage />
              </AppShell>
            }
          />
          <Route
            path="/copilot"
            element={
              <AppShell>
                <CopilotPage />
              </AppShell>
            }
          />
          <Route
            path="/asset/:symbol"
            element={
              <AppShell>
                <AssetDetailPage />
              </AppShell>
            }
          />
          <Route
            path="/simulator"
            element={
              <AppShell>
                <SimulatorPage />
              </AppShell>
            }
          />
          <Route
            path="/activity"
            element={
              <AppShell>
                <ActivityPage />
              </AppShell>
            }
          />
          <Route
            path="/settings"
            element={
              <AppShell>
                <SettingsPage />
              </AppShell>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </NexoraProvider>
  );
}
