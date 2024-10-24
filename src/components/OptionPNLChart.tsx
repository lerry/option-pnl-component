import React, { useState, useMemo, useCallback } from "react";
import { XAxis, YAxis, AreaChart, ReferenceLine, Area, Label } from "recharts";

interface OptionPNLChartProps {
  strikePrice: number;
  optionType: "call" | "put";
  currentPrice: number;
  priceRange: [number, number];
}

const CONTRACT_PRICE = 100;

const OptionPNLChart: React.FC<OptionPNLChartProps> = ({
  strikePrice,
  optionType,
  priceRange,
  currentPrice,
}) => {
  // 使用 useMemo 计算初始 hover 数据
  const initialHoverData = useMemo(() => {
    const defaultPrice = (priceRange[0] + priceRange[1]) / 2;
    const defaultPnl =
      optionType === "call"
        ? Math.max(0, defaultPrice - strikePrice) - CONTRACT_PRICE
        : Math.max(0, strikePrice - defaultPrice) - CONTRACT_PRICE;
    return { price: defaultPrice, pnl: defaultPnl };
  }, [priceRange, strikePrice, optionType]);

  const [lastValidHoverData, setLastValidHoverData] =
    useState(initialHoverData);

  // 优化数据生成，使用 useMemo 并提取 PNL 计算逻辑
  const calculatePnl = useCallback(
    (price: number) => {
      return optionType === "call"
        ? Math.max(0, price - strikePrice) - CONTRACT_PRICE
        : Math.max(0, strikePrice - price) - CONTRACT_PRICE;
    },
    [optionType, strikePrice]
  );

  const { data, maxPnl, minPnl } = useMemo(() => {
    const result = [];
    const [minPrice, maxPrice] = priceRange;
    let maxPnl = -Infinity;
    let minPnl = Infinity;

    for (let price = minPrice; price <= maxPrice; price += 1) {
      const pnl = calculatePnl(price);
      result.push({ price, pnl });
      maxPnl = Math.max(maxPnl, pnl);
      minPnl = Math.min(minPnl, pnl);
    }

    return { data: result, maxPnl, minPnl };
  }, [priceRange, calculatePnl]);

  // 优化渐变偏移计算
  const gradientOffset = useMemo(() => {
    if (maxPnl <= 0) return 0;
    if (minPnl >= 0) return 1;
    return maxPnl / (maxPnl - minPnl);
  }, [maxPnl, minPnl]);

  // 优化 Y 轴范围计算
  const yAxisRange = useMemo(
    () => Math.max(Math.abs(minPnl), Math.abs(maxPnl)),
    [minPnl, maxPnl]
  );

  const handleMouseMove = useCallback((e: any) => {
    if (e.activePayload?.[0]) {
      const { price, pnl } = e.activePayload[0].payload;
      setLastValidHoverData({ price, pnl });
    }
  }, []);

  // 优化标签渲染函数，提取静态部分
  const renderLabel = useCallback(
    ({ viewBox }: any) => {
      return (
        <>
          <g
            transform={`translate(${Math.min(Math.max(viewBox.x, 75), 650 - 75)},${70})`}
          >
            <text x={0} y={-25} textAnchor="middle" fill="#666" fontSize={16}>
              MEOW Price at Exp
            </text>
          </g>
          <g
            transform={`translate(${Math.min(Math.max(viewBox.x, 60), 650 - 60)},${70})`}
          >
            <text
              x={0}
              y={-5}
              textAnchor="middle"
              fill="#000"
              fontSize={16}
              fontWeight="bold"
            >
              ${lastValidHoverData.price.toFixed(2)}
            </text>
          </g>
          <g transform={`translate(${viewBox?.x || 0},265)`}>
            <circle
              cx={0}
              cy={0}
              r={20}
              fill="none"
              stroke="#00ff00"
              strokeWidth={2}
              opacity={0.3}
            >
              <animate
                attributeName="r"
                from={15}
                to={25}
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={0} cy={0} r={10} fill="#00ff00" opacity={0.5} />
          </g>
        </>
      );
    },
    [lastValidHoverData.price]
  );

  // 优化点渲染函数
  const renderDot = useCallback(
    (props: any) => {
      const { cx, cy, payload } = props;
      const isHovered = lastValidHoverData.price === payload.price;
      const radius = isHovered ? 10 : 5;

      if (payload.price === currentPrice) {
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="red"
            key={`current-price-dot-${payload.price}`}
            style={{ transition: "r 0.3s ease" }}
          />
        );
      }
      if (Math.abs(payload.pnl) < 0.5) {
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="#000"
            style={{ transition: "r 0.3s ease" }}
            key={`dot-${payload.price}`}
          />
        );
      }
      if (payload.pnl === maxPnl) {
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="green"
            style={{ transition: "r 0.3s ease" }}
            key={`dot-${payload.price}`}
          />
        );
      }
      return null;
    },
    [lastValidHoverData.price, currentPrice, maxPnl]
  );

  return (
    <div className="mx-auto">
      <div className="text-sm mb-2 text-center">
        盈亏: {lastValidHoverData.pnl.toFixed(2)}
      </div>
      <AreaChart
        width={650}
        height={460}
        data={data}
        className="mx-auto"
        margin={{ top: 80, right: 30, left: 20, bottom: 10 }}
        onMouseMove={handleMouseMove}
      >
        <YAxis domain={[-yAxisRange, yAxisRange]} hide={true} />
        <XAxis dataKey="price" hide={true} />
        <ReferenceLine y={0} stroke="#000" />
        <ReferenceLine y={yAxisRange} stroke="#666" strokeDasharray="3 3" />
        <ReferenceLine y={-yAxisRange} stroke="#666" strokeDasharray="3 3" />
        <ReferenceLine
          x={lastValidHoverData.price}
          strokeWidth={2}
          stroke="#000"
        >
          <Label content={renderLabel} />
        </ReferenceLine>
        <Area
          type="monotone"
          dataKey="pnl"
          stroke="url(#strokeColor)"
          fill="url(#splitColor)"
          baseLine={0}
          dot={renderDot}
        />
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={gradientOffset} stopColor="green" stopOpacity={0.4} />
            <stop offset={gradientOffset} stopColor="red" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="strokeColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={gradientOffset} stopColor="green" stopOpacity={1} />
            <stop offset={gradientOffset} stopColor="red" stopOpacity={1} />
          </linearGradient>
        </defs>
      </AreaChart>
    </div>
  );
};

export default OptionPNLChart;
