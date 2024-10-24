import React from "react";

import OptionPNLChart from "@/components/OptionPNLChart";

const IndexPage: React.FC = () => {
  const range = [6500, 7500] as [number, number];

  return (
    <div className="w-max-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">期权 PNL 图</h1>
      <OptionPNLChart
        strikePrice={7000}
        optionType="call"
        currentPrice={7000}
        priceRange={range}
      />
    </div>
  );
};

export default IndexPage;
