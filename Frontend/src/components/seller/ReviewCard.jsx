const ReviewCard = ({ review }) => {
  const { buyer = {}, rating = 0, comment = '', createdAt } = review || {};
  const initials = (buyer.name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm mb-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold text-lg">
            {initials || 'U'}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{buyer.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{new Date(createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 20 20"
                  fill={i < rating ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  className={
                    'w-4 h-4 ' + (i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600')
                  }
                >
                  <path
                    strokeWidth="0"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.12 3.44a1 1 0 00.95.69h3.62c.969 0 1.371 1.24.588 1.81l-2.93 2.12a1 1 0 00-.364 1.118l1.12 3.44c.3.922-.755 1.688-1.54 1.118l-2.93-2.12a1 1 0 00-1.176 0l-2.93 2.12c-.785.57-1.84-.196-1.54-1.118l1.12-3.44a1 1 0 00-.364-1.118L2.7 8.867c-.783-.57-.38-1.81.588-1.81h3.62a1 1 0 00.95-.69l1.12-3.44z"
                  />
                </svg>
              ))}
            </div>
          </div>

          <p className="mt-3 text-gray-700 dark:text-gray-200 leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;