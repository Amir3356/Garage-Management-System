const Loader = () => (
  <div className="p-6 space-y-4 animate-fade-in">
    {/* Header shimmer */}
    <div className="flex items-center justify-between mb-6">
      <div className="shimmer h-8 w-48 rounded"></div>
      <div className="shimmer h-10 w-32 rounded-lg"></div>
    </div>
    {/* Cards grid shimmer */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="shimmer h-6 w-24 rounded-full"></div>
            <div className="flex gap-2">
              <div className="shimmer h-8 w-8 rounded-lg"></div>
              <div className="shimmer h-8 w-8 rounded-lg"></div>
            </div>
          </div>
          {/* Customer info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="shimmer h-10 w-10 rounded-full"></div>
              <div className="flex-1">
                <div className="shimmer h-4 w-32 rounded mb-2"></div>
                <div className="shimmer h-3 w-24 rounded"></div>
              </div>
            </div>
          </div>
          {/* Service info */}
          <div className="mb-4">
            <div className="shimmer h-4 w-40 rounded mb-2"></div>
            <div className="shimmer h-3 w-20 rounded"></div>
          </div>
          {/* Vehicle info */}
          <div className="mb-4">
            <div className="shimmer h-4 w-32 rounded mb-2"></div>
            <div className="shimmer h-3 w-28 rounded"></div>
          </div>
          {/* Mechanic section */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="shimmer h-8 w-8 rounded-full"></div>
                <div>
                  <div className="shimmer h-3 w-20 rounded mb-1"></div>
                  <div className="shimmer h-4 w-28 rounded"></div>
                </div>
              </div>
              <div className="shimmer h-8 w-16 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="shimmer h-4 w-1/3 rounded mb-4"></div>
    <div className="shimmer h-3 w-2/3 rounded mb-2"></div>
    <div className="shimmer h-3 w-1/2 rounded"></div>
  </div>
);

export const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    <td className="p-4"><div className="shimmer h-4 w-full rounded"></div></td>
    <td className="p-4"><div className="shimmer h-4 w-full rounded"></div></td>
    <td className="p-4"><div className="shimmer h-4 w-full rounded"></div></td>
    <td className="p-4"><div className="shimmer h-4 w-20 rounded"></div></td>
  </tr>
);

export default Loader;
