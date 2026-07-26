/**
 * @file compose.js
 * @description Composition root — wires Repositories → Services → Controllers with Catalyst App
 * @module KCIP/Functions/Shared
 * @author KCIP Engineering Team — Phase 5 Catalyst Integration
 * @version 2.0.0
 * @lastUpdated 2026-07-26
 */

/**
 * Build a fully wired KCIP backend graph for a single Catalyst request.
 * @param {object|null} catalystApp
 * @returns {Promise<object>}
 */
export async function composeBackend(catalystApp = null) {
  const {
    FIRRepository,
    VictimRepository,
    AccusedRepository,
    ArrestRepository,
    ChargesheetRepository,
    DashboardRepository,
    PredictionRepository,
    GraphRepository,
    HotspotRepository,
    ReportRepository,
    NotificationRepository,
    AnalyticsRepository,
    FIRService,
    VictimService,
    AccusedService,
    ArrestService,
    ChargesheetService,
    DashboardService,
    PredictionService,
    GraphService,
    HotspotService,
    ReportService,
    NotificationService,
    AnalyticsService,
    AuthService,
    FIRController,
    VictimController,
    AccusedController,
    ArrestController,
    ChargesheetController,
    DashboardController,
    PredictionController,
    GraphController,
    HotspotController,
    ReportController,
    NotificationController,
    AnalyticsController,
    AuthController
  } = await import('../../backend/index.js');

  const firRepo = new FIRRepository(catalystApp);
  const victimRepo = new VictimRepository(catalystApp);
  const accusedRepo = new AccusedRepository(catalystApp);
  const arrestRepo = new ArrestRepository(catalystApp);
  const chargesheetRepo = new ChargesheetRepository(catalystApp);
  const dashboardRepo = new DashboardRepository(catalystApp);
  const predictionRepo = new PredictionRepository(catalystApp);
  const graphRepo = new GraphRepository(catalystApp);
  const hotspotRepo = new HotspotRepository(catalystApp);
  const reportRepo = new ReportRepository(catalystApp);
  const notificationRepo = new NotificationRepository(catalystApp);
  const analyticsRepo = new AnalyticsRepository(catalystApp);

  const firService = new FIRService(firRepo, { catalystApp });
  const victimService = new VictimService(victimRepo);
  const accusedService = new AccusedService(accusedRepo);
  const arrestService = new ArrestService(arrestRepo);
  const chargesheetService = new ChargesheetService(chargesheetRepo);
  const dashboardService = new DashboardService(dashboardRepo);
  const predictionService = new PredictionService(predictionRepo, { catalystApp });
  const graphService = new GraphService(graphRepo);
  const hotspotService = new HotspotService(hotspotRepo, firRepo);
  const reportService = new ReportService(reportRepo, { catalystApp });
  const notificationService = new NotificationService(notificationRepo);
  const analyticsService = new AnalyticsService(analyticsRepo);
  const authService = new AuthService(null, catalystApp);

  // Wire FIR event pipeline handlers (in-process when Signals/Circuits offline)
  firService.setPipelineHandlers({
    runPrediction: async ({ district, crimeType }) =>
      predictionService.generatePrediction(district, crimeType || 'CRIME_SPIKE'),
    runHotspot: async ({ district }) =>
      hotspotService.calculateAndStoreHotspots(district),
    runNetwork: async ({ firNumber }) =>
      graphService.getNetworkGraph(firNumber, 2),
    sendNotification: async ({ recipientId, title, message }) =>
      notificationService.sendNotification(recipientId, title, message),
    notifyRecipientId: 'SCRB',
    aiAnalysis: async (input) => ({ analysed: true, ...input }),
    prediction: async ({ district, crimeType }) =>
      predictionService.generatePrediction(district, crimeType || 'CRIME_SPIKE'),
    generateReport: async ({ district }) =>
      reportService.generateReport('DAILY', 'PDF', { district, generatedBy: 'CIRCUIT' }),
    notifyOfficer: async ({ firNumber, district }) =>
      notificationService.sendNotification(
        'SCRB',
        'FIR Workflow Complete',
        `FIR ${firNumber} processed for ${district}`
      ),
    dashboardRefresh: async ({ district }) =>
      dashboardService.getSummaryMetrics(district)
  });

  const {
    CatalystCronService,
    CatalystQuickMLService,
    CatalystSignalsService,
    CatalystCircuitsService,
    CatalystStratusService
  } = await import('../../backend/services/catalyst/index.js');

  const cronService = new CatalystCronService(catalystApp, {
    hotspotService,
    reportService,
    analyticsService,
    dashboardService
  });
  const quickMLService = new CatalystQuickMLService(catalystApp);
  const signalsService = new CatalystSignalsService(catalystApp);
  const circuitsService = new CatalystCircuitsService(catalystApp);
  const stratusService = new CatalystStratusService(catalystApp);

  // Propagate Catalyst app into all services
  for (const svc of [
    firService, victimService, accusedService, arrestService, chargesheetService,
    dashboardService, predictionService, graphService, hotspotService,
    reportService, notificationService, analyticsService, authService
  ]) {
    if (typeof svc.setCatalystApp === 'function') {
      svc.setCatalystApp(catalystApp);
    }
  }

  return {
    catalystApp,
    repositories: {
      firRepo, victimRepo, accusedRepo, arrestRepo, chargesheetRepo,
      dashboardRepo, predictionRepo, graphRepo, hotspotRepo,
      reportRepo, notificationRepo, analyticsRepo
    },
    services: {
      firService, victimService, accusedService, arrestService, chargesheetService,
      dashboardService, predictionService, graphService, hotspotService,
      reportService, notificationService, analyticsService, authService,
      cronService, quickMLService, signalsService, circuitsService, stratusService
    },
    controllers: {
      fir: new FIRController(firService),
      victim: new VictimController(victimService),
      accused: new AccusedController(accusedService),
      arrest: new ArrestController(arrestService),
      chargesheet: new ChargesheetController(chargesheetService),
      dashboard: new DashboardController(dashboardService),
      prediction: new PredictionController(predictionService),
      graph: new GraphController(graphService),
      hotspot: new HotspotController(hotspotService),
      report: new ReportController(reportService),
      notification: new NotificationController(notificationService),
      analytics: new AnalyticsController(analyticsService),
      auth: new AuthController(authService)
    }
  };
}
