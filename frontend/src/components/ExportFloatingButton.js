import { Box } from '@mui/material';
import ExportButtons from './ExportButtons'; 

const ExportFloatingButton = ({ onExport }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
        borderRadius: 3,
        p: 1.5,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        zIndex: 1300,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <ExportButtons onExport={onExport} />
    </Box>
  );
};

export default ExportFloatingButton;
