import React from 'react';

const SoftSkills = () => {
  const skills = ['Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Adaptability'];

  return (
    <section id="softskills" className="py-20 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
          Soft Skills
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center hover:scale-105 transition-transform">
              <h3 className="text-2xl font-semibold mb-4">{skill}</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-600 h-4 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftSkills;
