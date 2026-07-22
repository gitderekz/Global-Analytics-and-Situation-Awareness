import { render, screen, waitFor } from '@testing-library/react';
import MetricsPage from '../pages/MetricsPage';
import api from '../services/api';

vi.mock('../services/api', () => ({
  get: vi.fn(),
}));

describe('MetricsPage', () => {
  beforeEach(() => {
    api.get.mockReset();
  });

  it('displays metrics, queue state, and recent logs', async () => {
    api.get.mockResolvedValueOnce({ data: { success: true, data: { uptime: 500, timestamp: new Date().toISOString(), counts: { users: 3, events: 4 }, memory: { rss: 1024, heapTotal: 512 }, } } });
    api.get.mockResolvedValueOnce({ data: { success: true, data: { jobs: { queueStatus: { enabled: true, counts: { waiting: 0 } }, scheduled: [] } } } });
    api.get.mockResolvedValueOnce({ data: { success: true, data: { logs: { info: ['info line'], warn: [], error: [] } } } });

    render(<MetricsPage />);

    expect(await screen.findByText(/System Metrics/i)).toBeInTheDocument();
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(3));
    expect(screen.getByText(/users: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Queue enabled:/i)).toBeInTheDocument();
    expect(screen.getByText(/info line/i)).toBeInTheDocument();
  });
});
