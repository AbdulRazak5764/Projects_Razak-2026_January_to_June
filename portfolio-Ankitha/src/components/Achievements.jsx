import React from 'react';

const Achievements = () => {
  return (
    <section id="achievements" className="py-20 bg-gradient-to-r from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
          Achievements
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">50+</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Projects</h3>
            <p className="text-gray-600 dark:text-gray-300">Completed</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">10k+</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Lines of Code</h3>
            <p className="text-gray-600 dark:text-gray-300">Written</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">5+</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Hackathons</h3>
            <p className="text-gray-600 dark:text-gray-300">Won</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
