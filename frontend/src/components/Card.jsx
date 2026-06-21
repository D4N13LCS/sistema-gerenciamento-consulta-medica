const Card = ({ title, children }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {title && (
        <div className="px-3 sm:px-4 py-3 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
