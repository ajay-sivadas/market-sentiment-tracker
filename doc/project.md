# MarketMood - Stock Market Sentiment Analysis Platform

## Overview

MarketMood is a web-based platform that provides real-time sentiment analysis of the stock market through a numerical scoring system. The platform combines market data with news analysis to offer insights into market movements and their potential causes.

## Core Features

### 1. Real-time Sentiment Analysis

- Numerical sentiment score (0-100) calculated from multiple market indicators
- Real-time updates of market sentiment
- Visual representation of sentiment trends
- Customizable timeframes for analysis

### 2. News Integration

- Automated news scraping from major financial news sources
- Natural Language Processing for sentiment analysis of news articles
- Correlation tracking between news events and market movements
- Historical news archive with sentiment context

### 3. Data Visualization

- Interactive charts and graphs
- Real-time sentiment score display
- News impact visualization
- Historical trend analysis
- Customizable dashboard layouts

### 4. User Features

- Personalized watchlists
- Custom alerts and notifications
- Historical data export
- News filtering and categorization
- User preferences and settings

## Technical Architecture

### Frontend

- React.js for UI components
- Redux for state management
- Chart.js/D3.js for data visualization
- Responsive design with mobile-first approach

### Backend

- Node.js/Express.js server
- MongoDB for data storage
- Redis for caching
- WebSocket for real-time updates

### Data Processing

- Python-based sentiment analysis engine
- News scraping and processing pipeline
- Market data integration
- Machine learning models for sentiment prediction

## Design Specifications

### Color Scheme

- Primary: #1E88E5 (financial blue)
- Secondary: #FF4081 (alert red)
- Positive: #00C853 (bull green)
- Negative: #D32F2F (bear red)
- Background: #F5F5F5 (light grey)
- Text: #212121 (dark grey)

### Typography

- Primary Font: Inter
- Secondary Font: Roboto Mono
- Base Font Size: 16px
- Line Height: 1.5
- Font Weights: Regular (400), Medium (500), Bold (700)

### Layout

- Grid-based responsive design
- 16px spacing system
- Card-based UI components
- Clear visual hierarchy
- Consistent padding and margins

### Components

1. **Main Dashboard**

   - Prominent sentiment score display
   - Real-time market indicators
   - News feed section
   - Quick access to key features

2. **News Section**

   - Filterable news feed
   - Sentiment impact indicators
   - Article categorization
   - Historical news archive

3. **Analytics Panel**
   - Interactive charts
   - Customizable timeframes
   - Export functionality
   - Comparison tools

## Development Roadmap

### Phase 1: Core Infrastructure

- Basic frontend setup
- Backend API development
- Database schema design
- Authentication system

### Phase 2: Core Features

- Sentiment analysis engine
- News scraping system
- Basic visualization
- User dashboard

### Phase 3: Enhanced Features

- Advanced analytics
- Custom alerts
- Historical data analysis
- Mobile optimization

### Phase 4: Polish & Scale

- Performance optimization
- Additional data sources
- Enhanced visualization
- User feedback integration

## Technical Requirements

### Frontend Dependencies

- React 18+
- Redux Toolkit
- Chart.js/D3.js
- Material-UI
- Axios
- Socket.io-client

### Backend Dependencies

- Node.js 18+
- Express.js
- MongoDB
- Redis
- Python 3.8+
- TensorFlow/PyTorch
- BeautifulSoup/Scrapy

## Security Considerations

- HTTPS implementation
- API key management
- Rate limiting
- Data encryption
- User authentication
- Input validation
- CORS configuration

## Performance Targets

- Page load time < 2s
- API response time < 200ms
- Real-time updates < 1s
- Mobile responsiveness
- Cross-browser compatibility

## Future Enhancements

- AI-powered prediction models
- Social media sentiment integration
- Custom sentiment indicators
- API access for third-party integration
- Advanced filtering options
- Machine learning model improvements

## Implementation Progress

### Completed Features

#### Core Infrastructure

- ✓ Dashboard UI with responsive layout
- ✓ Dark mode implementation with ThemeProvider and ThemeSwitcher
- ✓ WebSocket integration for real-time data updates
- ✓ Server-side WebSocket API with 3-second market data push

#### UI Components

- ✓ Sentiment score panel with current market sentiment
- ✓ Historical sentiment chart with key events overlay
- ✓ News panel with impactful market news display
- ✓ Market metrics panel with indices and sector performance
- ✓ Market factors panel showing contributing economic elements
- ✓ Upcoming events panel for future market events
- ✓ WebSocket connection status indicator

#### Indian Market Focus

- ✓ Indian market indices tables and types
- ✓ Nifty PCR data structures and display
- ✓ Integration of Nifty PCR and India VIX data
- ✓ Live Nifty price chart with sentiment scores
- ✓ Rebranded to "Indian MarketSense"

#### Dark Mode Implementation

- ✓ ThemeProvider and ThemeSwitcher integration
- ✓ Dark mode CSS variables
- ✓ Updated color scheme:
  - Background: #121212
  - Panel backgrounds: #1E1E2F
  - Primary text: #E0E0E0
  - Secondary text: #A0A0A0
  - Accent color: #00C2FF
- ✓ Enhanced chart styling for dark mode
- ✓ Improved scrollbar styling
- ✓ Updated hover states
- ✓ Fixed component-specific dark mode issues

#### Chart Improvements

- ✓ Enhanced sentiment chart readability
- ✓ Fixed Y-axis ranges for stability
- ✓ Thicker graph lines (3px)
- ✓ Larger interactive dots
- ✓ Improved grid styling
- ✓ Enhanced tooltip styling

### Recent Updates

- Renamed "Bullish/Bearish" to "IV Score"
- Improved layout with news and upcoming events side-by-side
- Enhanced chart colors and styling for better dark/light mode support
- Fixed layout issues across components
- Removed redundant explanatory texts
- Optimized chart display and readability

## Current Technical Stack

### Frontend

- React 18+
- Redux Toolkit
- Chart.js/D3.js
- Material-UI
- WebSocket client
- Dark mode support

### Backend

- Node.js/Express.js
- WebSocket server
- Real-time data processing
- Market data integration

### Data Sources

- Indian market indices
- Nifty PCR data
- India VIX
- Market news feeds
