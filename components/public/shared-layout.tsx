"use client";

import { MatIcon } from "./shared-primitives";

export function Header({ isPreview }: { isPreview?: boolean }) {
  return (
    <header className={`${isPreview ? "absolute" : "fixed"} top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-primary-fixed/20 shadow-[0_4px_30px_rgba(244,172,183,0.1)] transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-16 sm:h-20 flex justify-between items-center">
        <a href="#" className="text-lg sm:text-xl md:text-2xl font-bold text-primary font-['Epilogue'] tracking-tight hover:scale-105 transition-transform duration-300 cursor-pointer">
          Happy Birthday!
        </a>
        <nav className="hidden md:flex gap-6 lg:gap-10" aria-label="Page sections">
          <a className="text-on-surface-variant hover:text-primary transition-colors font-['Epilogue'] tracking-tight text-xs sm:text-sm uppercase tracking-wider relative group" href="#our-story">
            Our Story
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-['Epilogue'] tracking-tight text-xs sm:text-sm uppercase tracking-wider relative group" href="#photo-gallery">
            Moments
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-['Epilogue'] tracking-tight text-xs sm:text-sm uppercase tracking-wider relative group" href="#gift-board">
            Love Notes
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hover:scale-110 hover:bg-primary-fixed/30 transition-all duration-300 p-2 rounded-full sm:p-2.5 text-primary" aria-label="Favorite">
            <MatIcon name="favorite" className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </button>
          <button className="hidden sm:block festive-gradient-btn text-on-primary-container font-label-md text-xs sm:text-label-md px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_4px_15px_rgba(244,172,183,0.3)] hover:shadow-[0_6px_20px_rgba(244,172,183,0.5)]">
            Send Love
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="py-12 md:py-16 px-4 md:px-6 bg-surface text-center">
      <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
        <p className="font-headline-sm text-primary font-['Epilogue'] text-base sm:text-lg md:text-xl">Made with love</p>
        <p className="font-body-md text-on-surface-variant text-xs sm:text-sm">
          Built with Romantic Microsite Platform
        </p>
      </div>
    </footer>
  );
}
