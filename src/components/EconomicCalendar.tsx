import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface EconomicEvent {
  date: string;
  event: string;
  importance: 'High' | 'Medium' | 'Low';
  previous: string;
  actual: string;
  unit: string;
  country: string;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' ? '#1E1E2F' : '#F5F5F5',
  },
}));

const ImportanceChip = styled(Chip)(({ theme }) => ({
  '&.High': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  '&.Medium': {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  '&.Low': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

const EconomicCalendar: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [country, setCountry] = useState<string>('all');

  useEffect(() => {
    // TODO: Replace with actual API call to Zerodha's economic calendar
    const fetchEvents = async () => {
      try {
        const response = await fetch('YOUR_ZERODHA_API_ENDPOINT');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching economic calendar:', error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter !== 'all' && event.importance !== filter) return false;
    if (country !== 'all' && event.country !== country) return false;
    return true;
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Economic Calendar
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Importance</InputLabel>
          <Select
            value={filter}
            label="Importance"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={country}
            label="Country"
            onChange={(e) => setCountry(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="Global">Global</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Importance</TableCell>
              <TableCell>Previous</TableCell>
              <TableCell>Actual</TableCell>
              <TableCell>Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((event, index) => (
              <StyledTableRow key={index}>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.event}</TableCell>
                <TableCell>
                  <ImportanceChip
                    label={event.importance}
                    className={event.importance}
                    size="small"
                  />
                </TableCell>
                <TableCell>{event.previous}</TableCell>
                <TableCell>{event.actual}</TableCell>
                <TableCell>{event.unit}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EconomicCalendar; 