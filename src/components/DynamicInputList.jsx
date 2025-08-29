import React from 'react';

const DynamicInputList = ({ 
  label, 
  values = [], 
  onChange, 
  placeholder = "Enter item", 
  required = false,
  maxItems = 10,
  inputType = "text",
  rows = 1 
}) => {
  const handleAdd = () => {
    if (values.length < maxItems) {
      onChange([...values, '']);
    }
  };

  const handleRemove = (index) => {
    if (values.length > 1) {
      const newValues = values.filter((_, i) => i !== index);
      onChange(newValues);
    }
  };

  const handleChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  // Ensure at least one input if required
  const displayValues = values.length === 0 ? [''] : values;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}{required && '*'}
      </label>
      
      <div className="space-y-3">
        {displayValues.map((value, index) => (
          <div key={index} className="flex gap-2 items-start">
            {inputType === 'textarea' ? (
              <textarea
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none resize-none"
                placeholder={`${placeholder} ${index + 1}`}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                rows={rows}
              />
            ) : (
              <input
                type={inputType}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none"
                placeholder={`${placeholder} ${index + 1}`}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            )}
            
            <div className="flex gap-1">
              {index === displayValues.length - 1 && displayValues.length < maxItems && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                  title="Add new item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
              
              {displayValues.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                  title="Remove this item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {displayValues.length >= maxItems && (
        <p className="text-xs text-gray-500 mt-2">
          Maximum {maxItems} items allowed
        </p>
      )}
    </div>
  );
};

export default DynamicInputList;
