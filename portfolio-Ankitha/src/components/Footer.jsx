import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Ankitha Portfolio</h3>
          <p className="text-gray-400 mb-8">
            © 2024 Ankitha. Built with React & Vite.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <a href="#" className="hover:text-blue-400 transition">GitHub</a>
          <a href="#" className="hover:text-blue-400 transition">LinkedIn</a>
          <a href="#" className="hover:text-blue-400 transition">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
