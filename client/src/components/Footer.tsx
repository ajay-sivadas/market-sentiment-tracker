export default function Footer() {
  return (
    <footer className="bg-white mt-6 py-4 border-t border-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              <span className="ml-1 text-sm font-medium">MarketSense</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Real-time sentiment analysis for financial markets</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">About</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Methodology</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
          
          <div className="mt-4 md:mt-0">
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} MarketSense. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
