## 组件说明

### 在线预览

[期权损益图表组件](https://option-pnl-chart.vercel.app/)

### OptionPNLChart 期权损益图表组件

Recharts 是基于 D3 的 React 图表库，用于绘制区域图表。
这是一个用于展示期权损益的交互式图表组件，使用 React 和 Recharts 库实现。

#### 主要特性

- 实时显示期权损益曲线
- 支持看涨(Call)和看跌(Put)期权
- 动态价格和损益显示
- 关键点高亮显示（最大收益点、零损益点、当前价格点）
- 平滑的动画效果

#### 技术栈

- **React**: 使用 React Hooks (useState, useRef, useMemo, useCallback) 实现状态管理和性能优化
- **Recharts**: 基于 D3 的 React 图表库，用于绘制区域图表
- **TypeScript**: 提供完整的类型支持

#### 性能优化

1. **数据计算优化**:

   - 使用 `useMemo` 缓存图表数据计算结果
   - 使用 `useMemo` 缓存最大/最小损益值计算
   - 使用 `useCallback` 优化事件处理函数

2. **渲染优化**:
   - 自定义 dot 渲染逻辑，只在关键点显示标记
   - 使用 CSS transitions 实现平滑的动画效果
   - 渐变色动态计算，根据盈亏分界点自动调整

#### 交互特性

- 鼠标移动时实时更新价格和损益显示
- 关键点悬停时的动态大小变化
- 当前价格点的动态脉冲动画效果
- 损益曲线的颜色渐变（绿色表示盈利区域，红色表示亏损区域）

#### 使用示例

```typescript
<OptionPNLChart
  strikePrice={100}  // 期权行权价
  optionType="call"  // 期权类型：'call' 或 'put'
  currentPrice={95}  // 当前价格
  priceRange={[80, 120]}  // 价格显示范围
/>
```

#### 可以改进的点

- 目前的组件宽高是固定的，没有根据父级容器的大小进行调整
- 有些样式相关的 magic number 需要优化
- 有些样式细节和文本，未严格遵循示例
- 没有测试更多期权，不限于call和put，更多的价格范围
- 鼠标移动较快时，参考线没有及时更新

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```
