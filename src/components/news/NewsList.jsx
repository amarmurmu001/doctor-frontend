import React from 'react';
import PropTypes from 'prop-types';
import { NEWS_PRIORITY } from '../../constants/newsConstants';

export const NewsList = ({ news, onEdit, onDelete, onStatusChange, status }) => {
  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No news items found</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      [NEWS_PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
      [NEWS_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800',
      [NEWS_PRIORITY.HIGH]: 'bg-yellow-100 text-yellow-800',
      [NEWS_PRIORITY.BREAKING]: 'bg-red-100 text-red-800',
    };
    return colors[priority] || colors[NEWS_PRIORITY.MEDIUM];
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Headline</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {status === NEWS_PRIORITY.DRAFT ? 'Last Modified' : 'Publish Date'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {news.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {item.featured_image && (
                    <img
                      src={item.featured_image}
                      alt={item.headline}
                      className="h-10 w-10 rounded-md object-cover mr-3"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.headline}</div>
                    <div className="text-sm text-gray-500">{item.summary?.substring(0, 100)}...</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.author}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(status === 'draft' ? item.updated_at : item.publish_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item._id, e.target.value)}
                  className="text-sm rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(item)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

NewsList.propTypes = {
  news: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      headline: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      source: PropTypes.string,
      category: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      featured_image: PropTypes.string,
      publish_date: PropTypes.string,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};
