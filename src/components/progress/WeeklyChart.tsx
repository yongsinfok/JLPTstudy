export interface WeeklyData {
  date: Date;
  count: number;
}

export interface WeeklyChartProps {
  data: WeeklyData[];
  className?: string;
}

const WeeklyChart = ({ data, className = '' }: WeeklyChartProps) => {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">本周学习统计</h2>

      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((item, index) => {
          const heightPercent = (item.count / maxCount) * 100;
          const isToday = item.date.toDateString() === new Date().toDateString();

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full flex flex-col justify-end h-full">
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isToday
                      ? 'bg-gradient-to-t from-primary to-primary/70'
                      : 'bg-gradient-to-t from-gray-300 to-gray-200'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                {item.count > 0 && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700">
                    {item.count}
                  </span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-gray-500'}`}>
                  {weekDays[item.date.getDay()]}
                </p>
                <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-primary to-primary/70" />
          <span>今天</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-gray-300 to-gray-200" />
          <span>其他天数</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
