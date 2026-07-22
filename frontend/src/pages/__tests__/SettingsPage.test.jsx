import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from '../SettingsPage';
import { useSettingsStore } from '../../store/settingsStore';

describe('SettingsPage', () => {
  it('renders map mode and accessibility settings', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Map Mode')).toBeInTheDocument();
    expect(screen.getByLabelText('High Contrast Mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Reduce Motion')).toBeInTheDocument();
    expect(screen.getByLabelText('Font Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload MBTiles')).toBeInTheDocument();
  });
});
