import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import type { CandleDto } from '../../types/trading';

interface CandlestickChartProps {
  candles: CandleDto[];
  height?: number;
}

export function CandlestickChart({ candles, height = 320 }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const ema21SeriesRef = useRef<any>(null);
  const ema25SeriesRef = useRef<any>(null);
  
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area' | 'bar'>('candlestick');
  const [showVolume, setShowVolume] = useState(false);
  const [showEMA21, setShowEMA21] = useState(false);
  const [showEMA25, setShowEMA25] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [autoScale, setAutoScale] = useState(true);

  // Calculate EMA with proper initialization using SMA
  const calculateEMA = (data: any[], period: number) => {
    if (data.length < period) return [];
    
    const k = 2 / (period + 1);
    const emaData = [];
    
    // First EMA value = SMA of first 'period' values
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i].close;
    }
    let ema = sum / period;
    
    // Add all EMA values starting from the period-th candle
    for (let i = period - 1; i < data.length; i++) {
      if (i === period - 1) {
        ema = sum / period; // First EMA = SMA
      } else {
        ema = data[i].close * k + ema * (1 - k);
      }
      emaData.push({ time: data[i].time, value: ema });
    }
    
    return emaData;
  };

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    // Create chart with Dark Premium theme
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0d0f14' },
        textColor: '#64748b',
        fontSize: 11,
      },
      grid: {
        vertLines: { 
          color: 'rgba(255, 255, 255, 0.02)',
          style: 1,
        },
        horzLines: { 
          color: 'rgba(255, 255, 255, 0.02)',
          style: 1,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: isFullscreen ? window.innerHeight - 100 : height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.05)',
        autoScale: autoScale,
      },
      crosshair: showCrosshair ? {
        vertLine: {
          color: 'rgba(124, 141, 181, 0.3)',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: 'rgba(124, 141, 181, 0.3)',
          width: 1,
          style: 3,
        },
      } : {
        vertLine: { visible: false },
        horzLine: { visible: false },
      },
    });

    chartRef.current = chart;

    // Convert CandleDto to lightweight-charts format
    const chartData = candles
      .map((candle) => ({
        time: (new Date(candle.time).getTime() / 1000) as any,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume || 0,
      }))
      .sort((a, b) => a.time - b.time);

    // Add main series based on chart type
    let mainSeries: any;
    if (chartType === 'candlestick') {
      mainSeries = chart.addCandlestickSeries({
        upColor: '#6b9080',
        downColor: '#a16e7c',
        borderUpColor: '#6b9080',
        borderDownColor: '#a16e7c',
        wickUpColor: '#6b9080',
        wickDownColor: '#a16e7c',
      });
      mainSeries.setData(chartData);
    } else if (chartType === 'line') {
      mainSeries = chart.addLineSeries({
        color: '#7c8db5',
        lineWidth: 2,
      });
      mainSeries.setData(chartData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'area') {
      mainSeries = chart.addAreaSeries({
        topColor: 'rgba(124, 141, 181, 0.3)',
        bottomColor: 'rgba(124, 141, 181, 0.05)',
        lineColor: '#7c8db5',
        lineWidth: 2,
      });
      mainSeries.setData(chartData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'bar') {
      mainSeries = chart.addBarSeries({
        upColor: '#6b9080',
        downColor: '#a16e7c',
      });
      mainSeries.setData(chartData);
    }

    seriesRef.current = mainSeries;

    // Add volume histogram if enabled
    if (showVolume && chartData[0]?.volume) {
      const volumeSeries = chart.addHistogramSeries({
        color: 'rgba(124, 141, 181, 0.2)',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });
      
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      const volumeData = chartData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(107, 144, 128, 0.3)' : 'rgba(161, 110, 124, 0.3)',
      }));
      
      volumeSeries.setData(volumeData);
      volumeSeriesRef.current = volumeSeries;
    }

    // Add EMA21 line if enabled
    if (showEMA21) {
      const ema21Series = chart.addLineSeries({
        color: '#8b7fb8',
        lineWidth: 1,
      });
      const ema21Data = calculateEMA(chartData, 21);
      ema21Series.setData(ema21Data);
      ema21SeriesRef.current = ema21Series;
    }

    // Add EMA25 line if enabled
    if (showEMA25) {
      const ema25Series = chart.addLineSeries({
        color: '#7c8db5',
        lineWidth: 1,
      });
      const ema25Data = calculateEMA(chartData, 25);
      ema25Series.setData(ema25Data);
      ema25SeriesRef.current = ema25Series;
    }

    // Fit content to visible range
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: isFullscreen ? window.innerHeight - 100 : height,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles, height, chartType, showVolume, showEMA21, showEMA25, isFullscreen, showCrosshair, autoScale]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  const zoomIn = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const logicalRange = timeScale.getVisibleLogicalRange();
      if (logicalRange) {
        const delta = (logicalRange.to - logicalRange.from) * 0.2;
        timeScale.setVisibleLogicalRange({
          from: logicalRange.from + delta,
          to: logicalRange.to - delta,
        });
      }
    }
  };

  const zoomOut = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const logicalRange = timeScale.getVisibleLogicalRange();
      if (logicalRange) {
        const delta = (logicalRange.to - logicalRange.from) * 0.2;
        timeScale.setVisibleLogicalRange({
          from: logicalRange.from - delta,
          to: logicalRange.to + delta,
        });
      }
    }
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0d0f14] p-4' : ''}`}>
      {/* Control Panel */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 bg-white/1 border border-white/5 p-0.5">
            {(['candlestick', 'line', 'area', 'bar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-2 py-1 text-[10px] uppercase tracking-widest transition-colors ${
                  chartType === type
                    ? 'bg-[#7c8db5]/15 text-slate-300'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {type === 'candlestick' ? 'CANDLE' : type}
              </button>
            ))}
          </div>

          {/* Indicators */}
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
              showVolume
                ? 'bg-[#7c8db5]/15 border-[#7c8db5]/20 text-slate-300'
                : 'bg-white/1 border-white/5 text-slate-600 hover:text-slate-400'
            }`}
          >
            VOLUME
          </button>
          
          <button
            onClick={() => setShowEMA21(!showEMA21)}
            className={`px-2 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
              showEMA21
                ? 'bg-[#8b7fb8]/15 border-[#8b7fb8]/20 text-slate-300'
                : 'bg-white/1 border-white/5 text-slate-600 hover:text-slate-400'
            }`}
          >
            EMA 21
          </button>
          
          <button
            onClick={() => setShowEMA25(!showEMA25)}
            className={`px-2 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
              showEMA25
                ? 'bg-[#7c8db5]/15 border-[#7c8db5]/20 text-slate-300'
                : 'bg-white/1 border-white/5 text-slate-600 hover:text-slate-400'
            }`}
          >
            EMA 25
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/1 border border-white/5 p-0.5">
            <button
              onClick={zoomIn}
              className="px-2 py-1 text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={zoomOut}
              className="px-2 py-1 text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
              title="Zoom Out"
            >
              −
            </button>
            <button
              onClick={resetZoom}
              className="px-2 py-1 text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
              title="Reset Zoom"
            >
              FIT
            </button>
          </div>

          {/* View Controls */}
          <button
            onClick={() => setShowCrosshair(!showCrosshair)}
            className={`px-2 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
              showCrosshair
                ? 'bg-[#7c8db5]/15 border-[#7c8db5]/20 text-slate-300'
                : 'bg-white/1 border-white/5 text-slate-600 hover:text-slate-400'
            }`}
            title="Toggle Crosshair"
          >
            +
          </button>

          <button
            onClick={() => setAutoScale(!autoScale)}
            className={`px-2 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
              autoScale
                ? 'bg-[#7c8db5]/15 border-[#7c8db5]/20 text-slate-300'
                : 'bg-white/1 border-white/5 text-slate-600 hover:text-slate-400'
            }`}
            title="Auto Scale"
          >
            AUTO
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-2 py-1 text-[10px] uppercase tracking-widest bg-white/1 border border-white/5 text-slate-600 hover:text-slate-400 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? 'EXIT' : 'FULL'}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="border border-white/5 overflow-hidden"
        style={{ height: `${isFullscreen ? window.innerHeight - 100 : height}px` }}
      />
    </div>
  );
}
